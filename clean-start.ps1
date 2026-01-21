# Script para limpar processos Node.js e reiniciar o servidor
Write-Host "🧹 Limpando processos Node.js..." -ForegroundColor Yellow

# Matar todos os processos Node.js
Stop-Process -Name node -Force -ErrorAction SilentlyContinue

Write-Host "⏳ Aguardando processos finalizarem..." -ForegroundColor Yellow
Start-Sleep -Seconds 2

# Remover diretório .next
if (Test-Path .next) {
    Remove-Item -Recurse -Force .next -ErrorAction SilentlyContinue
    Write-Host "✅ Cache .next removido" -ForegroundColor Green
}

Write-Host "🚀 Iniciando servidor..." -ForegroundColor Green
npm run dev
