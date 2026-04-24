#!/usr/bin/env python3
"""
feedback_loop.py — Retroalimentação automática da Skill Product-Integrity-Engineer

Atualiza memória/changelog e, opcionalmente, emite eventos SKILL_CONFLICT canônicos.
"""

import argparse
import json
import sys
from datetime import datetime, timezone
from pathlib import Path


def find_repo_root() -> Path:
    current = Path(__file__).resolve()
    for parent in current.parents:
        if (parent / "docs" / "Vault" / "activity.jsonl").exists() and (parent / "scripts" / "agents").exists():
            return parent
    raise RuntimeError("Nao foi possivel localizar a raiz do repositorio")


REPO_ROOT = find_repo_root()
if str(REPO_ROOT) not in sys.path:
    sys.path.append(str(REPO_ROOT))

from scripts.agents import skill_mesh_events


def load_json(path: Path) -> dict:
    if path.exists():
        try:
            return json.loads(path.read_text(encoding="utf-8"))
        except Exception as e:
            print(f"⚠️ Erro ao ler JSON {path}: {e}")
    return {}


def save_json(path: Path, data: dict) -> None:
    path.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")


def bump_version(version: str, level: str = "patch") -> str:
    parts = [int(x) for x in version.split(".")]
    if level == "major":
        parts = [parts[0] + 1, 0, 0]
    elif level == "minor":
        parts = [parts[0], parts[1] + 1, 0]
    else:
        parts = [parts[0], parts[1], parts[2] + 1]
    return ".".join(str(p) for p in parts)


def update_memory(
    skill_dir: Path,
    session_summary: str,
    learnings: list[str],
    skill_updated: bool = False,
    persist: bool = True,
) -> dict:
    memory_path = skill_dir / "memory.json"
    memory = load_json(memory_path)

    if not memory:
        memory = {
            "skill_name": skill_dir.name,
            "version": "1.0.0",
            "interaction_log": [],
            "accumulated_patterns": []
        }
    memory.setdefault("interaction_log", [])
    memory.setdefault("accumulated_patterns", [])

    now = datetime.now(timezone.utc).isoformat()
    memory["last_updated"] = now

    memory["interaction_log"].append({
        "date": now,
        "summary": session_summary,
        "learnings": learnings
    })

    if learnings:
        memory["version"] = bump_version(memory.get("version", "1.0.0"), "patch")

    if persist:
        save_json(memory_path, memory)
    return memory


def update_changelog(skill_dir: Path, version: str, learned: list[str], persist: bool = True) -> str:
    changelog_path = skill_dir / "changelog.md"
    today = datetime.now(timezone.utc).strftime("%Y-%m-%d")

    new_entry = f"\n## [{version}] — {today}\n"
    if learned:
        new_entry += "### Aprendido (Insights de Integridade)\n" + "".join(f"- {l}\n" for l in learned)

    if changelog_path.exists():
        existing = changelog_path.read_text(encoding="utf-8")
        lines = existing.split("\n", 1)
        updated = lines[0] + "\n" + new_entry + lines[1]
    else:
        updated = f"# Changelog\n{new_entry}"

    if persist:
        changelog_path.write_text(updated, encoding="utf-8")
    return updated


def run(
    skill_dir_path: str,
    session_summary: str,
    learnings_raw: str,
    emit_conflict: bool = False,
    ledger: Path | None = None,
    os_id: str | None = None,
    task_id: str | None = None,
    author: str = "product-integrity-engineer",
    severity: str | None = None,
    resolver: str = "product-integrity-engineer",
    resolution_status: str | None = None,
    conflict_type: str | None = None,
    shared_object: str | None = None,
    claim_a: str | None = None,
    claim_b: str | None = None,
    evidence: list[str] | None = None,
    involved_skills: list[str] | None = None,
    winning_interpretation: str | None = None,
    rejected_interpretation: str | None = None,
    next_owner: str | None = None,
    should_promote_feedback: bool = False,
    intent_text: str | None = None,
    dry_run: bool = False,
    dry_run_complete: bool = False,
):
    skill_dir = Path(skill_dir_path).resolve()
    learnings = [l.strip() for l in learnings_raw.split("|") if l.strip()]
    persist = not dry_run_complete

    memory = update_memory(skill_dir, session_summary, learnings, persist=persist)
    update_changelog(skill_dir, memory["version"], learnings, persist=persist)

    print(f"✅ [Integridade] Retroalimentação concluída — v{memory['version']}")
    if dry_run_complete:
        print("🧪 dry-run-complete ativo: memory.json, changelog.md e activity.jsonl nao serao alterados.")

    if not emit_conflict:
        return

    if not os_id and not task_id:
        raise SystemExit("emit-conflict requer --os-id ou --task-id")

    required_conflict = {
        "severity": severity,
        "resolution_status": resolution_status,
        "conflict_type": conflict_type,
        "shared_object": shared_object,
        "claim_a": claim_a,
        "claim_b": claim_b,
        "winning_interpretation": winning_interpretation,
        "rejected_interpretation": rejected_interpretation,
        "next_owner": next_owner,
    }
    missing = [key for key, value in required_conflict.items() if not value]
    if missing:
        raise SystemExit(f"emit-conflict requer os campos: {', '.join(missing)}")
    if not evidence:
        raise SystemExit("emit-conflict requer ao menos um --evidence")

    skills_involved = involved_skills or ["product-integrity-engineer", next_owner]
    if len(set(skills_involved)) < 2:
        raise SystemExit("emit-conflict requer pelo menos duas skills unicas; use --skill para declarar as envolvidas")

    event_args = argparse.Namespace(
        os_id=os_id,
        task_id=task_id,
        event_id=None,
        author=author,
        skills=skills_involved,
        severity=severity,
        resolver=resolver,
        resolution_status=resolution_status,
        conflict_type=conflict_type,
        shared_object=shared_object,
        claim_a=claim_a,
        claim_b=claim_b,
        evidence=evidence,
        winning_interpretation=winning_interpretation,
        rejected_interpretation=rejected_interpretation,
        next_owner=next_owner,
        should_promote_feedback=should_promote_feedback,
        intent_text=intent_text,
    )
    event = skill_mesh_events.build_conflict_event(event_args)
    skill_mesh_events.validate_or_raise(event, "conflict")
    print(json.dumps(event, ensure_ascii=True, indent=2))
    if not dry_run and not dry_run_complete:
        skill_mesh_events.append_event(ledger or skill_mesh_events.DEFAULT_LEDGER, event)
        print(f"🧾 Evento SKILL_CONFLICT anexado em {ledger or skill_mesh_events.DEFAULT_LEDGER}")


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Retroalimenta product-integrity-engineer e opcionalmente emite SKILL_CONFLICT."
    )
    parser.add_argument("skill_dir")
    parser.add_argument("session_summary")
    parser.add_argument("learnings_raw")
    parser.add_argument("--emit-conflict", action="store_true")
    parser.add_argument("--ledger", type=Path, default=skill_mesh_events.DEFAULT_LEDGER)
    parser.add_argument("--os-id")
    parser.add_argument("--task-id")
    parser.add_argument("--author", default="product-integrity-engineer")
    parser.add_argument("--severity", choices=sorted(skill_mesh_events.SEVERITIES))
    parser.add_argument("--resolver", default="product-integrity-engineer")
    parser.add_argument("--resolution-status", choices=sorted(skill_mesh_events.RESOLUTION_STATUSES))
    parser.add_argument("--conflict-type", choices=sorted(skill_mesh_events.CONFLICT_TYPES))
    parser.add_argument("--shared-object")
    parser.add_argument("--claim-a")
    parser.add_argument("--claim-b")
    parser.add_argument("--evidence", action="append")
    parser.add_argument("--skill", dest="involved_skills", action="append", help="Skill envolvida no conflito. Repita para duas ou mais.")
    parser.add_argument("--winning-interpretation")
    parser.add_argument("--rejected-interpretation")
    parser.add_argument("--next-owner")
    parser.add_argument("--should-promote-feedback", action="store_true")
    parser.add_argument("--intent-text")
    parser.add_argument("--dry-run", action="store_true")
    parser.add_argument("--dry-run-complete", action="store_true")
    return parser.parse_args()


if __name__ == "__main__":
    args = parse_args()
    run(
        skill_dir_path=args.skill_dir,
        session_summary=args.session_summary,
        learnings_raw=args.learnings_raw,
        emit_conflict=args.emit_conflict,
        ledger=args.ledger,
        os_id=args.os_id,
        task_id=args.task_id,
        author=args.author,
        severity=args.severity,
        resolver=args.resolver,
        resolution_status=args.resolution_status,
        conflict_type=args.conflict_type,
        shared_object=args.shared_object,
        claim_a=args.claim_a,
        claim_b=args.claim_b,
        evidence=args.evidence,
        involved_skills=args.involved_skills,
        winning_interpretation=args.winning_interpretation,
        rejected_interpretation=args.rejected_interpretation,
        next_owner=args.next_owner,
        should_promote_feedback=args.should_promote_feedback,
        intent_text=args.intent_text,
        dry_run=args.dry_run,
        dry_run_complete=args.dry_run_complete,
    )
