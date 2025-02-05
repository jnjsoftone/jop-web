@echo off
:: [syntax] publish.bat patch|minor|major
:: default: patch

IF "%~1"=="" (
  SET mode=patch
) ELSE (
  SET mode=%1
)

:: set PLUGIN_DIR="{{vault_root}}\.obsidian\plugins\{{name}}"
set PLUGIN_DIR=D:\Notes\Obsidian\liveSync\dev\.obsidian\plugins\jop-web

:: 플러그인 디렉토리가 없으면 생성
if not exist "%PLUGIN_DIR%" mkdir "%PLUGIN_DIR%"

REM 1. 기존 빌드 파일 정리
call yarn clean
if errorlevel 1 goto :error

REM 2. git pull 먼저 실행하여 원격 변경사항 가져오기
git pull
if errorlevel 1 goto :error

REM 3. 빌드
call yarn build
if errorlevel 1 goto :error

REM 4. git 변경사항 커밋
git add .
if errorlevel 1 goto :error
git commit -m "chore: build for publish"
if errorlevel 1 goto :error

REM 5. npm 버전 업데이트 (이때 자동으로 버전 태그가 생성됨)
call npm version %mode%
if errorlevel 1 goto :error

REM 6. git push
git push && git push --tags
if errorlevel 1 goto :error

:: 7. obsidian 플러그인 배포
del /Q "%PLUGIN_DIR%\*"
xcopy /E /Y "dist\*" "%PLUGIN_DIR%\"

goto :success

:error
echo 오류가 발생했습니다.
exit /b 1

:success
echo 배포가 성공적으로 완료되었습니다.
exit /b 0