param(
  [switch]$Preview
)

$ErrorActionPreference = "Stop"
$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$bundledPython = "C:\Users\LUIS\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe"
$python = if (Test-Path -LiteralPath $bundledPython) { $bundledPython } else { "python" }

Set-Location $projectRoot
& $python sitegen.py
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

Write-Host "Contenido generado correctamente." -ForegroundColor Green
if ($Preview) {
  Write-Host "Vista previa: http://localhost:8080" -ForegroundColor Cyan
  & $python -m http.server 8080
}
