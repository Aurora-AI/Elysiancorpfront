from __future__ import annotations

import argparse
import json
import os
import shutil
import sys
from datetime import datetime, timezone
from pathlib import Path


SCRIPT_PATH = Path(__file__).resolve()
MASTER_SKILL_DIR = SCRIPT_PATH.parent.parent
CONFIG_PATH = MASTER_SKILL_DIR / "config" / "agents.json"
USER_CONFIG_PATH = MASTER_SKILL_DIR / "user-config.json"

RUNTIME_HINTS = [
    ("codex", ("CODEX_SHELL", "CODEX_THREAD_ID", "CODEX_INTERNAL_ORIGINATOR_OVERRIDE")),
    ("claude-code", ("CLAUDE_CODE_GIT_BASH_PATH",)),
    ("antigravity", ("ANTIGRAVITY_ACTIVE", "GEMINI_SESSION_ID")),
]

ALIASES = {
    "claude": "claude-code",
    "claudecode": "claude-code",
    "claude-code": "claude-code",
    "codex": "codex",
    "antigravity": "antigravity",
    "gemini": "antigravity",
}


def now_iso() -> str:
    return datetime.now(timezone.utc).replace(microsecond=0).isoformat()


def load_json(path: Path, default=None):
    if not path.exists():
        return default
    with path.open("r", encoding="utf-8") as handle:
        return json.load(handle)


def save_json(path: Path, payload) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", encoding="utf-8", newline="\n") as handle:
        json.dump(payload, handle, indent=2, ensure_ascii=True)
        handle.write("\n")


def normalize_agent(value: str | None) -> str | None:
    if not value:
        return None
    return ALIASES.get(value.strip().lower())


def load_agents_config() -> dict:
    payload = load_json(CONFIG_PATH, default={})
    if not payload or "agents" not in payload:
        raise SystemExit(f"Invalid agents config: {CONFIG_PATH}")
    return payload


def load_catalog() -> dict:
    payload = load_json(catalog_path(), default={})
    if not payload or "skills" not in payload:
        raise SystemExit(f"Invalid catalog: {catalog_path()}")
    return payload


def resolve_home_path(raw_path: str) -> Path:
    home = Path.home()
    if raw_path.startswith("~/"):
        return home / raw_path[2:]
    return Path(raw_path)


def resolve_repo_root() -> Path:
    config_payload = load_json(CONFIG_PATH, default={}) or {}
    saved_payload = load_json(USER_CONFIG_PATH, default={}) or {}
    candidates = [
        os.getenv("AURORA_AGENTS_PATH"),
        saved_payload.get("skills_repo"),
        config_payload.get("aurora_agents_path"),
        str(MASTER_SKILL_DIR.parent),
    ]
    for candidate in candidates:
        if not candidate:
            continue
        root = Path(candidate).resolve()
        if (root / "catalog.json").exists():
            return root
    raise SystemExit("Unable to resolve Aurora agents repository root.")


def catalog_path() -> Path:
    return resolve_repo_root() / "catalog.json"


def detect_agent(agents_config: dict, explicit_agent: str | None = None) -> tuple[str, str, bool]:
    explicit = normalize_agent(explicit_agent)
    if explicit:
        return explicit, "manual_override", False

    env_agent = normalize_agent(os.getenv("AURORA_AGENT"))
    if env_agent:
        return env_agent, "env_var", False

    for agent_name, env_vars in RUNTIME_HINTS:
        if any(os.getenv(name) for name in env_vars):
            return agent_name, "runtime_hint", False

    home = Path.home()
    detected = []
    for agent_name, agent_cfg in agents_config["agents"].items():
        marker = agent_cfg.get("detection_marker")
        if marker and (home / marker).exists():
            detected.append(agent_name)
    if detected:
        return detected[0], "directory_marker", len(detected) > 1

    saved = load_json(USER_CONFIG_PATH, default={})
    saved_agent = normalize_agent(saved.get("agent")) if saved else None
    if saved_agent:
        return saved_agent, "saved_config", bool(saved.get("ambiguous_environment"))

    raise SystemExit(
        "Unable to detect active agent. Set AURORA_AGENT or use --agent antigravity|claude-code|codex."
    )


def project_root_from_arg(raw_project: str | None) -> Path:
    return Path(raw_project).resolve() if raw_project else Path.cwd().resolve()


def project_manifest_path(project_root: Path) -> Path:
    return project_root / "project-manifest.json"


def ensure_project_manifest(project_root: Path) -> dict:
    manifest_path = project_manifest_path(project_root)
    existing = load_json(manifest_path, default=None)
    if existing:
        existing["repository_root"] = str(resolve_repo_root())
        existing["project_root"] = str(project_root)
        existing.setdefault("installed_skills", {})
        save_json(manifest_path, existing)
        return existing
    payload = {
        "schema_version": "1.0.0",
        "repository_root": str(resolve_repo_root()),
        "project_root": str(project_root),
        "updated_at": now_iso(),
        "installed_skills": {},
    }
    save_json(manifest_path, payload)
    return payload


def write_user_config(agent_name: str, detection_method: str, ambiguous: bool, agents_config: dict) -> dict:
    agent_cfg = agents_config["agents"][agent_name]
    payload = {
        "agent": agent_name,
        "skills_repo": str(resolve_repo_root()),
        "install_path": str(resolve_home_path(agent_cfg["skills_path"])),
        "commands_path": str(resolve_home_path(agent_cfg["commands_path"])),
        "detected_at": now_iso(),
        "detection_method": detection_method,
        "ambiguous_environment": ambiguous,
        "version": "1.0.0",
    }
    save_json(USER_CONFIG_PATH, payload)
    return payload


def skill_index(catalog: dict) -> dict[str, dict]:
    return {skill["name"]: skill for skill in catalog["skills"]}


def print_json(payload) -> None:
    print(json.dumps(payload, indent=2, ensure_ascii=True))


def list_skills(catalog: dict, tag: str | None = None, status: str | None = None) -> list[dict]:
    results = []
    for skill in catalog["skills"]:
        if tag and tag not in skill.get("tags", []):
            continue
        if status and skill.get("status") != status:
            continue
        results.append(skill)
    return results


def install_target(project_root: Path, skill_name: str) -> Path:
    return project_root / ".aurora" / "skills" / skill_name


def install_skill(project_root: Path, skill_name: str, catalog_lookup: dict[str, dict], manifest: dict) -> dict:
    if skill_name not in catalog_lookup:
        raise SystemExit(f"Unknown skill: {skill_name}")
    metadata = catalog_lookup[skill_name]
    if metadata.get("status") != "production":
        raise SystemExit(f"Skill is not installable from planned status: {skill_name}")
    source_dir = resolve_repo_root() / skill_name
    if not source_dir.exists():
        raise SystemExit(f"Missing source directory for skill: {source_dir}")
    target_dir = install_target(project_root, skill_name)
    shutil.rmtree(target_dir, ignore_errors=True)
    target_dir.parent.mkdir(parents=True, exist_ok=True)
    shutil.copytree(source_dir, target_dir, dirs_exist_ok=True)
    manifest.setdefault("installed_skills", {})[skill_name] = {
        "version": metadata.get("version"),
        "status": metadata.get("status"),
        "installed_at": now_iso(),
        "installed_path": str(target_dir),
        "source_path": str(source_dir),
    }
    manifest["updated_at"] = now_iso()
    save_json(project_manifest_path(project_root), manifest)
    return manifest["installed_skills"][skill_name]


def remove_skill(project_root: Path, skill_name: str, manifest: dict) -> None:
    shutil.rmtree(install_target(project_root, skill_name), ignore_errors=True)
    manifest.setdefault("installed_skills", {}).pop(skill_name, None)
    manifest["updated_at"] = now_iso()
    save_json(project_manifest_path(project_root), manifest)


def compare_versions(left: str | None, right: str | None) -> bool:
    return (left or "") != (right or "")


def cmd_init(args) -> int:
    agents_config = load_agents_config()
    project_root = project_root_from_arg(args.project)
    if args.reset:
        USER_CONFIG_PATH.unlink(missing_ok=True)
    agent_name, detection_method, ambiguous = detect_agent(agents_config, args.agent)
    user_config = write_user_config(agent_name, detection_method, ambiguous, agents_config)
    manifest = ensure_project_manifest(project_root)
    print_json(
        {
            "command": "init",
            "agent": agent_name,
            "detection_method": detection_method,
            "ambiguous_environment": ambiguous,
            "skills_repo": str(resolve_repo_root()),
            "project_manifest": str(project_manifest_path(project_root)),
            "user_config": str(USER_CONFIG_PATH),
            "installed_skills": len(manifest.get("installed_skills", {})),
            "commands_path": user_config["commands_path"],
        }
    )
    return 0


def cmd_status(args) -> int:
    project_root = project_root_from_arg(args.project)
    manifest = ensure_project_manifest(project_root)
    user_config = load_json(USER_CONFIG_PATH, default={})
    print_json(
        {
            "command": "status",
            "skills_repo": str(resolve_repo_root()),
            "user_config": user_config,
            "project_manifest": manifest,
        }
    )
    return 0


def cmd_list(args) -> int:
    catalog = load_catalog()
    results = list_skills(catalog, tag=args.tag, status=args.status)
    print_json({"command": "list", "count": len(results), "skills": results})
    return 0


def cmd_info(args) -> int:
    catalog = load_catalog()
    lookup = skill_index(catalog)
    metadata = lookup.get(args.skill)
    if not metadata:
        raise SystemExit(f"Unknown skill: {args.skill}")
    print_json({"command": "info", "skill": metadata})
    return 0


def cmd_install(args) -> int:
    catalog = load_catalog()
    lookup = skill_index(catalog)
    project_root = project_root_from_arg(args.project)
    manifest = ensure_project_manifest(project_root)
    user_config = load_json(USER_CONFIG_PATH, default={})
    
    requested = list(args.skills)
    if args.status:
        requested.extend(skill["name"] for skill in catalog["skills"] if skill.get("status") == args.status)
    if not requested:
        raise SystemExit("No skills specified for install.")

    ordered = []
    seen = set()
    for name in requested:
        if name not in seen:
            ordered.append(name)
            seen.add(name)

    installed = {}
    global_installed = []
    
    for name in ordered:
        # Local Project Install
        installed[name] = install_skill(project_root, name, lookup, manifest)
        
        # Global IDE Install (if in agent mode and not suppressed, or if --global is set)
        if args.global_install or (user_config.get("agent") and not args.project):
            g_path = Path(user_config.get("install_path", ""))
            if g_path:
                source_dir = resolve_repo_root() / name
                source_file = resolve_repo_root() / f"{name}.skill"
                
                # Copy directory
                if source_dir.exists():
                    target_dir = g_path / name
                    shutil.rmtree(target_dir, ignore_errors=True)
                    shutil.copytree(source_dir, target_dir)
                
                # Copy .skill file
                if source_file.exists():
                    shutil.copy2(source_file, g_path / f"{name}.skill")
                
                global_installed.append(name)

    print_json({
        "command": "install", 
        "project_root": str(project_root), 
        "installed": installed,
        "global_installed": global_installed,
        "global_path": user_config.get("install_path") if global_installed else None
    })
    return 0


def cmd_update(args) -> int:
    catalog = load_catalog()
    lookup = skill_index(catalog)
    project_root = project_root_from_arg(args.project)
    manifest = ensure_project_manifest(project_root)
    installed = manifest.get("installed_skills", {})
    targets = list(installed.keys()) if args.all else list(args.skills)
    if not targets:
        raise SystemExit("No skills specified for update.")
    updated = {}
    skipped = {}
    for name in targets:
        if name not in installed:
            skipped[name] = "not installed"
            continue
        catalog_version = lookup.get(name, {}).get("version")
        installed_version = installed[name].get("version")
        if compare_versions(installed_version, catalog_version):
            updated[name] = install_skill(project_root, name, lookup, manifest)
        else:
            skipped[name] = "already current"
    print_json({"command": "update", "updated": updated, "skipped": skipped})
    return 0


def cmd_remove(args) -> int:
    project_root = project_root_from_arg(args.project)
    manifest = ensure_project_manifest(project_root)
    removed = []
    for name in args.skills:
        remove_skill(project_root, name, manifest)
        removed.append(name)
    print_json({"command": "remove", "project_root": str(project_root), "removed": removed})
    return 0


def cmd_installed(args) -> int:
    project_root = project_root_from_arg(args.project)
    manifest = ensure_project_manifest(project_root)
    print_json(
        {
            "command": "installed",
            "project_root": str(project_root),
            "installed_skills": manifest.get("installed_skills", {}),
        }
    )
    return 0


def cmd_check_updates(args) -> int:
    catalog = load_catalog()
    lookup = skill_index(catalog)
    project_root = project_root_from_arg(args.project)
    manifest = ensure_project_manifest(project_root)
    updates = []
    for name, installed in manifest.get("installed_skills", {}).items():
        catalog_version = lookup.get(name, {}).get("version")
        if compare_versions(installed.get("version"), catalog_version):
            updates.append(
                {
                    "name": name,
                    "installed_version": installed.get("version"),
                    "catalog_version": catalog_version,
                }
            )
    print_json({"command": "check-updates", "project_root": str(project_root), "updates": updates})
    return 0


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description="Aurora master skill controller")
    subparsers = parser.add_subparsers(dest="command", required=True)

    init_parser = subparsers.add_parser("init")
    init_parser.add_argument("--project")
    init_parser.add_argument("--agent")
    init_parser.add_argument("--reset", action="store_true")
    init_parser.set_defaults(func=cmd_init)

    status_parser = subparsers.add_parser("status")
    status_parser.add_argument("--project")
    status_parser.set_defaults(func=cmd_status)

    list_parser = subparsers.add_parser("list")
    list_parser.add_argument("--tag")
    list_parser.add_argument("--status")
    list_parser.set_defaults(func=cmd_list)

    info_parser = subparsers.add_parser("info")
    info_parser.add_argument("skill")
    info_parser.set_defaults(func=cmd_info)

    install_parser = subparsers.add_parser("install")
    install_parser.add_argument("skills", nargs="*")
    install_parser.add_argument("--status")
    install_parser.add_argument("--project")
    install_parser.add_argument("--global", dest="global_install", action="store_true")
    install_parser.set_defaults(func=cmd_install)

    update_parser = subparsers.add_parser("update")
    update_parser.add_argument("skills", nargs="*")
    update_parser.add_argument("--all", action="store_true")
    update_parser.add_argument("--project")
    update_parser.set_defaults(func=cmd_update)

    remove_parser = subparsers.add_parser("remove")
    remove_parser.add_argument("skills", nargs="+")
    remove_parser.add_argument("--project")
    remove_parser.set_defaults(func=cmd_remove)

    installed_parser = subparsers.add_parser("installed")
    installed_parser.add_argument("--project")
    installed_parser.set_defaults(func=cmd_installed)

    check_updates_parser = subparsers.add_parser("check-updates")
    check_updates_parser.add_argument("--project")
    check_updates_parser.set_defaults(func=cmd_check_updates)

    return parser


def main(argv: list[str] | None = None) -> int:
    parser = build_parser()
    args = parser.parse_args(argv)
    return args.func(args)


if __name__ == "__main__":
    sys.exit(main())
