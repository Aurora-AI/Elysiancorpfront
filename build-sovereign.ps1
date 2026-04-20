# OS-006: Sovereign Build Script
# This script neutralizes the IDE's environment drift by unsetting anchor variables.

$ProjectRoot = "C:\Projetos\Aurora\MadLabAurora\ElysianCorp"
Set-Location $ProjectRoot

Write-Host "--- NEUTRALIZING SHADOW ROOT ---" -ForegroundColor Cyan

# 1. Scrub Anchor Variables
$env:VSCODE_CWD = $null
$env:VSCODE_PID = $null
$env:VSCODE_IPC_HOOK = $null
$env:NODE_PATH = $null
$env:npm_config_prefix = $null

# 2. Cleanup PATH
# Remove any references to the Antigravity system bin folders to bypass IDE shims
$CleanPath = ($env:Path -split ';' | Where-Object { $_ -notmatch 'Antigravity' }) -join ';'
$env:Path = $CleanPath

Write-Host "Environment Scrubbed." -ForegroundColor Green

# 3. Execution
if ($args[0] -eq "install") {
    Write-Host "Running Isolated Install (NPM RECONSTRUCTION + LEGACY PEER DEPS)..." -ForegroundColor Yellow
    npm install --no-package-lock --legacy-peer-deps
} elseif ($args[0] -eq "build") {
    Write-Host "Running Sovereign Build..." -ForegroundColor Yellow
    .\node_modules\.bin\astro build --root .
} else {
    Write-Host "Usage: ./build-sovereign.ps1 [install|build]"
}
