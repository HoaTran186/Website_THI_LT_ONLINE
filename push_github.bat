@echo off
chcp 65001 > nul
echo Đang đẩy mã nguồn lên GitHub (HoaTran186/Website_THI_LT_ONLINE)...
git push -u origin main
echo.
if %ERRORLEVEL% EQU 0 (
    echo ==============================================
    echo [THÀNH CÔNG] Đã đẩy dự án lên GitHub thành công!
    echo Link: https://github.com/HoaTran186/Website_THI_LT_ONLINE
    echo ==============================================
) else (
    echo [LỖI] Đẩy lên thất bại. Hãy chắc chắn bạn đã tạo repository trống 'Website_THI_LT_ONLINE' trên GitHub!
)
pause
