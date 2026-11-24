@echo off
chcp 65001 >nul
title BUSDIGIT CODEVERSE - Auto Push & Deploy
color 0A

echo ======================================================================
echo    BUSDIGIT CODEVERSE — AUTO-PUSH & DEPLOY ENGINE (TANPA COPAS)
echo ======================================================================
echo.

:: 1. Verifikasi Git
where git >nul 2>nul
if %errorlevel% neq 0 (
    color 0C
    echo [ERROR] Git belum terinstall di komputer Anda!
    echo Unduh dan install Git dari: https://git-scm.com/
    pause
    exit /b 1
)

:: 2. Inisialisasi Git jika belum
if not exist ".git" (
    echo [*] Menginisialisasi repositori Git lokal...
    git init -b main
    echo [OK] Repositori lokal berhasil dibuat!
    echo.
)

:: 3. Verifikasi Sintaksis Kode jika Node.js tersedia
where node >nul 2>nul
if %errorlevel% equ 0 (
    echo [*] Menjalankan pengujian sintaksis otomatis...
    node -e "try { const fs = require('fs'); const vm = require('vm'); const code = fs.readFileSync('Code.gs', 'utf8'); new vm.Script(code); console.log('[OK] Sintaksis Code.gs 100%% Valid!'); } catch(e) { console.error('[GAGAL] Error sintaksis Code.gs:', e.message); process.exit(1); }"
    if %errorlevel% neq 0 (
        color 0C
        echo [ERROR] Terdapat error sintaksis pada Code.gs. Push dibatalkan demi keamanan!
        pause
        exit /b 1
    )
)

echo.
:: 4. Input Pesan Commit
set /p COMMIT_MSG="Masukkan pesan update (tekan ENTER untuk pesan otomatis): "
if "%COMMIT_MSG%"=="" (
    for /f "tokens=1-4 delims=/ " %%a in ('date /t') do (set MYDATE=%%a-%%b-%%c)
    for /f "tokens=1-2 delims=: " %%a in ('time /t') do (set MYTIME=%%a:%%b)
    set COMMIT_MSG=update: Pembaruan sistem BUSDIGIT CODEVERSE %date% %time%
)

echo.
echo [*] Menyimpan perubahan ke Git...
git add .
git commit -m "%COMMIT_MSG%"

:: 5. Cek Remote Origin
git remote | findstr /i "origin" >nul 2>nul
if %errorlevel% neq 0 (
    echo.
    echo ======================================================================
    echo [INFO] Remote GitHub belum terhubung!
    echo.
    echo Jalankan perintah berikut sekali saja untuk menghubungkan ke GitHub:
    echo    git remote add origin https://github.com/USERNAME/busdigit-codeverse.git
    echo    git push -u origin main
    echo ======================================================================
    echo.
    set /p REPO_URL="Atau masukkan URL Remote GitHub Anda sekarang: "
    if not "%REPO_URL%"=="" (
        git remote add origin %REPO_URL%
        echo [*] Mendorong kode ke remote origin...
        git push -u origin main
    )
) else (
    echo [*] Mendorong update langsung ke GitHub...
    git push origin main
)

if %errorlevel% equ 0 (
    echo.
    echo ======================================================================
    echo    [SUKSES] Seluruh kode berhasil di-push ke GitHub secara otomatis!
    echo    Website hosting Anda akan ter-update otomatis dalam beberapa detik.
    echo ======================================================================
) else (
    echo.
    echo [CATATAN] Jika push gagal karena autentikasi, pastikan Anda sudah login
    echo ke akun GitHub di komputer ini.
)

echo.
pause
