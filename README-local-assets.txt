外部JavaScriptのローカル化（Stage 3）
====================================

この版では次の2ライブラリをローカル参照に変更しています。
- Chart.js 4.4.1
- html2canvas 1.4.1

初回だけ、PowerShellでこのフォルダを開いて次を実行してください。

  powershell -ExecutionPolicy Bypass -File .\setup-assets.ps1

または setup-assets.ps1 を右クリックして PowerShell で実行します。

実行後、次のファイルができます。
  assets\js\chart.umd.js
  assets\js\html2canvas.min.js

その後 index.html をブラウザで開いて動作確認してください。

まだ外部参照のままのもの:
- Tailwind CSS
- Font Awesome

これらは次の段階でローカル化します。
