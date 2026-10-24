$ErrorActionPreference = 'Stop'

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$assetDir = Join-Path $root 'assets\js'
New-Item -ItemType Directory -Force -Path $assetDir | Out-Null

$files = @(
    @{
        Name = 'Chart.js 4.4.1'
        Url  = 'https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.js'
        Dest = (Join-Path $assetDir 'chart.umd.js')
    },
    @{
        Name = 'html2canvas 1.4.1'
        Url  = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js'
        Dest = (Join-Path $assetDir 'html2canvas.min.js')
    }
)

foreach ($file in $files) {
    Write-Host "Downloading $($file.Name)..."
    Invoke-WebRequest -Uri $file.Url -OutFile $file.Dest -UseBasicParsing
}

Write-Host ''
Write-Host 'Done. Files saved to assets\js:'
Get-ChildItem $assetDir | Select-Object Name, Length
