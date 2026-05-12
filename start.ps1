# 销售数据仪表板启动脚本
Write-Host "========================================"
Write-Host "  销售数据仪表板启动器" -ForegroundColor Cyan
Write-Host "========================================"
Write-Host ""
Write-Host "正在启动本地服务器..." -ForegroundColor Green
Write-Host ""
Write-Host "访问地址: http://localhost:8000" -ForegroundColor Yellow
Write-Host ""
Write-Host "按 Ctrl+C 可以停止服务器" -ForegroundColor Yellow
Write-Host ""
Write-Host "========================================"
Write-Host ""

# 进入当前目录
Set-Location $PSScriptRoot

# 启动 Python HTTP 服务器
python -m http.server 8000

Read-Host "按 Enter 退出"
