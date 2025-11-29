@echo off
title YBS Portfolio Launcher 🚀
color 0A

echo.
echo  =======================================================
echo    YBS PORTFOLIO - MERN STACK SISTEMI BASLATILIYOR...
echo  =======================================================
echo.
echo  [1/2] Backend Server (API & Database) tetikleniyor...
:: Backend'i yeni pencerede açar, başlığını ayarlar ve çalıştırır
start "BACKEND - SERVER (Port 5000)" cmd /k "cd server && npm run dev"

echo.
echo  [2/2] Frontend Client (React UI) tetikleniyor...
:: Frontend'i yeni pencerede açar
start "FRONTEND - CLIENT (Port 5173)" cmd /k "cd client && npm run dev"

echo.
echo  =======================================================
echo    TUM SISTEMLER AKTIF!
echo    Tarayici 5 saniye icinde aciliyor...
echo  =======================================================
echo.

:: 5 Saniye bekle (Server'ın kendine gelmesi için)
timeout /t 5 >nul

:: Tarayıcıyı varsayılan adreste aç
start http://localhost:5173

exit