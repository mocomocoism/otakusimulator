$ErrorActionPreference = "Stop"

$base = Split-Path -Parent $MyInvocation.MyCommand.Path
$cssDir = Join-Path $base "assets\css"
$fontDir = Join-Path $base "assets\webfonts"

New-Item -ItemType Directory -Force -Path $cssDir | Out-Null
New-Item -ItemType Directory -Force -Path $fontDir | Out-Null

$files = @(
  @{ Url = "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"; Dest = (Join-Path $cssDir "fontawesome-all.min.css") },
  @{ Url = "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/webfonts/fa-solid-900.woff2"; Dest = (Join-Path $fontDir "fa-solid-900.woff2") },
  @{ Url = "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/webfonts/fa-regular-400.woff2"; Dest = (Join-Path $fontDir "fa-regular-400.woff2") },
  @{ Url = "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/webfonts/fa-brands-400.woff2"; Dest = (Join-Path $fontDir "fa-brands-400.woff2") }
)

foreach ($file in $files) {
  Write-Host "Downloading $($file.Url)..."
  & curl.exe -L --fail --silent --show-error $file.Url -o $file.Dest
  if ($LASTEXITCODE -ne 0) { throw "curl.exe failed: $($file.Url)" }
}

Write-Host ""
Write-Host "Font Awesome 6.5.1 assets downloaded successfully."
Get-ChildItem $cssDir, $fontDir | Select-Object Name, Length
