@echo off
chcp 65001 >nul
echo.
echo ========================================
echo   销售数据仪表板启动器
echo ========================================
echo.
echo 正在启动本地服务器...
echo.
echo 访问地址: http://localhost:8000
echo.
echo 按 Ctrl+C 可以停止服务器
echo.
echo ========================================
echo.

cd /d "%~dp0"
python -m http.server 8000

pause
