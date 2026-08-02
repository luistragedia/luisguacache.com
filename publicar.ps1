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

Write-Host…6379 tokens truncated…stencia informática remota</a><a href="/servicios/desarrollo-web/">Desarrollo web y presencia digital</a><a href="/servicios/marketing-consultoria/">Marketing digital y consultoría para negocios</a></div></aside></div></section></main><footer class="site-footer"><div class="container footer-inner"><small>© <span id="year"></span> Luis Guacache — Todos los derechos reservados</small><nav class="footer-nav" aria-label="Enlaces legales"><a href="/legal/aviso-legal.html">Aviso legal</a><a href="/legal/privacidad.html">Privacidad</a><a href="/legal/cookies.html">Cookies</a></nav></div></footer><script src="/assets/js/main.js?v=300" defer></script></body></html>