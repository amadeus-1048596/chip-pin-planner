@echo off
setlocal
chcp 65001 >nul
title 芯片引脚规划器 - 更新

rem 更新源（环境变量可覆盖，供测试/镜像）
if "%CPP_UPDATE_BASE%"=="" set "CPP_UPDATE_BASE=https://amadeus-1048596.github.io/chip-pin-planner"
set "VER_URL=%CPP_UPDATE_BASE%/download/version.json"
set "ZIP_URL=%CPP_UPDATE_BASE%/download/latest.zip"

rem 开发目录防护：没有 version.json 说明不是 zip/安装器 装的副本
if not exist "%~dp0version.json" (
  echo [ERR] 未找到 version.json，这不是通过 zip/安装器安装的目录，已退出。
  exit /b 1
)

set "TMPD=%TEMP%\cpp-update-%RANDOM%%RANDOM%"
mkdir "%TMPD%" 2>nul

echo 正在检查更新（%VER_URL%）...
curl.exe -sSL --max-time 60 -o "%TMPD%\version.json" "%VER_URL%"
if errorlevel 1 goto :neterr

rem 解析远端版本（用 PowerShell 正经解析 JSON，避开批处理引号转义雷区）
set "REMOTE="
for /f "usebackq delims=" %%a in (`powershell -NoProfile -Command "(Get-Content -Raw '%TMPD%\version.json' | ConvertFrom-Json).version"`) do set "REMOTE=%%a"
if not defined REMOTE goto :neterr

rem 解析本地版本
set "LOCAL="
for /f "usebackq delims=" %%a in (`powershell -NoProfile -Command "(Get-Content -Raw '%~dp0version.json' | ConvertFrom-Json).version"`) do set "LOCAL=%%a"

if /i "%REMOTE%"=="%LOCAL%" (
  echo [SKIP] 已是最新 %LOCAL%
  rmdir /s /q "%TMPD%" 2>nul
  exit /b 0
)

echo 发现新版本 %REMOTE%（当前 %LOCAL%），开始下载...
curl.exe -sSL --max-time 300 -o "%TMPD%\latest.zip" "%ZIP_URL%"
if errorlevel 1 goto :neterr

powershell -NoProfile -Command "Expand-Archive -LiteralPath '%TMPD%\latest.zip' -DestinationPath '%TMPD%\new' -Force"
if errorlevel 1 (
  echo [ERR] 解压失败，请手动下载：%CPP_UPDATE_BASE%
  rmdir /s /q "%TMPD%" 2>nul
  exit /b 1
)

robocopy "%TMPD%\new" "%~dp0." /E /NFL /NDL /NJH /NJS >nul
if errorlevel 8 (
  echo [ERR] 覆盖文件失败，请手动下载：%CPP_UPDATE_BASE%
  rmdir /s /q "%TMPD%" 2>nul
  exit /b 1
)

rmdir /s /q "%TMPD%" 2>nul
echo [OK] 已更新到 %REMOTE%；请重新打开或刷新 index.html
exit /b 0

:neterr
echo [ERR] 网络不通（手动下载：https://github.com/amadeus-1048596/chip-pin-planner/releases）
rmdir /s /q "%TMPD%" 2>nul
exit /b 1
