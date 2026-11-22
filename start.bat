@echo off
chcp 65001 > nul
title HỆ THỐNG SÁT HẠCH LÝ THUYẾT GPLX (600 CÂU HỎI)
echo =================================================================
echo   ĐANG KHỞI CHẠY HỆ THỐNG SÁT HẠCH LÝ THUYẾT LÁI XE ONLINE...
echo   Giao diện mô phỏng chuẩn phần mềm Cục Đường Bộ Việt Nam
echo =================================================================
echo.

node -v >nul 2>&1
if %errorlevel% neq 0 (
    echo [LỖI] Máy tính của bạn chưa cài đặt Node.js hoặc chưa cấu hình PATH!
    echo Vui lòng cài đặt Node.js từ https://nodejs.org/ trước khi chạy.
    echo.
    pause
    exit /b
)

node run.js
pause
