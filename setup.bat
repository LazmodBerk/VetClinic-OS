@echo off
title Klinik Yonetim Sistemi - Ilk Kurulum
color 0E

echo ============================================
echo   Veteriner Klinik Yonetim Sistemi
echo   Ilk Kurulum
echo ============================================
echo.
echo Bu script gerekli tum bagimliliklari yukleyecek.
echo Lutfen bekleyin...
echo.

:: Backend bagimlilikları
echo [1/2] Backend bagimliliklari yukleniyor...
cd /d C:\Projects\KlinikYonetimi\backend
pip install -r requirements.txt
echo Backend bagimliliklari tamamlandi!
echo.

:: Frontend bagimlilikları
echo [2/2] Frontend bagimliliklari yukleniyor...
cd /d C:\Projects\KlinikYonetimi\frontend
npm install
echo Frontend bagimliliklari tamamlandi!
echo.

echo ============================================
echo   Kurulum tamamlandi!
echo   Uygulamayi baslatmak icin start.bat calistirin.
echo ============================================
echo.
pause
