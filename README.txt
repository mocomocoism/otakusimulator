Tailwind CSS local build (GitHub Pages)
======================================
This package uses the screenshot-icons version of index.html.
It changes ONLY the Tailwind Play CDN to ./assets/css/tailwind.css.
Chart.js, html2canvas, Font Awesome files should be retained from your current local working copy.

1. Extract all files into your local otakusimulator repository, preserving existing assets/js and webfonts.
2. Check whether Node.js and npm are installed in PowerShell:
   node --version
   npm.cmd --version
   If either fails, install current Node.js LTS (e.g. winget install --id OpenJS.NodeJS.LTS -e --source winget) and REOPEN PowerShell.
3. In repository folder run:
   powershell -ExecutionPolicy Bypass -File .\build-tailwind.ps1
4. Verify assets/css/tailwind.css was created. Do NOT commit before this step.
5. Check the app in browser incl. dynamic city customization, card modal, colors, chart, image download.
6. In GitHub Desktop commit the generated assets/css/tailwind.css, index.html, config, package.json, script and .gitignore. Do NOT commit node_modules.
7. Push to GitHub. GitHub Pages serves the prebuilt CSS; npm is not needed on GitHub Pages.

Tailwind v3.4.17 is pinned because the existing Play CDN page uses the v3 utility convention.
The input is assets/css/tailwind-input.css and config scans index.html AND app.js.
The current additional site-specific CSS remains in style.css.
Font Awesome still uses assets/css/fontawesome-all.min.css.
