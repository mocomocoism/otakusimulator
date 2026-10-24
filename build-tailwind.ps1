$ErrorActionPreference = 'Stop'
Set-Location $PSScriptRoot
if (-not (Get-Command node -ErrorAction SilentlyContinue) -or -not (Get-Command npm.cmd -ErrorAction SilentlyContinue)) {
    Write-Host 'Node.js and npm are required. Please install Node.js LTS, reopen PowerShell, and run this again.'
    exit 1
}
Write-Host ('Node.js: ' + (node --version))
Write-Host ('npm: ' + (npm.cmd --version))
if (-not (Test-Path '.\node_modules\tailwindcss')) {
    Write-Host 'Installing Tailwind CSS dependencies...'
    & npm.cmd install
    if ($LASTEXITCODE -ne 0) { throw 'npm install failed.' }
}
Write-Host 'Generating assets/css/tailwind.css...'
& npm.cmd run build:css
if ($LASTEXITCODE -ne 0) { throw 'Tailwind CSS build failed.' }
if (-not (Test-Path '.\assets\css\tailwind.css')) { throw 'CSS output is missing.' }
Get-Item '.\assets\css\tailwind.css' | Select-Object Name, Length
Write-Host 'CSS build completed.'
