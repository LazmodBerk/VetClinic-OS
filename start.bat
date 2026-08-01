@echo off
title Klinik Yonetim Sistemi - Baslatiliyor...
color 0A

echo ============================================
echo   Veteriner Klinik Yonetim Sistemi v1.0
echo ============================================
echo.

:: Backend'i arka planda baslat
echo [1/2] Backend baslatiliyor (http://localhost:8000)...
start "VCMS Backend" cmd /k "cd /d C:\Projects\KlinikYonetimi\backend && uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload"

:: 3 saniye bekle (backend ayaga kalksın)
timeout /t 3 /nobreak >nul

:: Frontend'i arka planda baslat
echo [2/2] Frontend baslatiliyor (http://localhost:5173)...
start "VCMS Frontend" cmd /k "cd /d C:\Projects\KlinikYonetimi\frontend && npm run dev"

:: Biraz bekle ve tarayicida ac
timeout /t 5 /nobreak >nul
echo.
echo Uygulama baslatildi! Tarayici aciliyor...
start "" http://localhost:5173

echo.
echo ============================================
echo   Servisler calisiyor:
echo   - Backend  : http://localhost:8000
echo   - API Docs : http://localhost:8000/docs
echo   - Frontend : http://localhost:5173
echo ============================================
echo.
echo Uygulamayi durdurmak icin stop.bat calistirin
echo veya acilan terminal pencerelerini kapatin.
pause
