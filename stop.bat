@echo off
title Klinik Yonetim Sistemi - Durduruluyor...
color 0C

echo ============================================
echo   Servisler durduruluyor...
echo ============================================
echo.

:: Port 8000 uzerindeki islemi bul ve sonlandir (Backend)
echo [1/2] Backend durduruluyor (port 8000)...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":8000"') do (
    taskkill /PID %%a /F >nul 2>&1
)

:: Port 5173 uzerindeki islemi bul ve sonlandir (Frontend)
echo [2/2] Frontend durduruluyor (port 5173)...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":5173"') do (
    taskkill /PID %%a /F >nul 2>&1
)

echo.
echo Tum servisler durduruldu.
echo ============================================
timeout /t 2 /nobreak >nul
