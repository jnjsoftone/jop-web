@echo off
:: [syntax] publish.bat patch|minor|major
:: default: patch

set mode=%1
if "%mode%"=="" set mode=patch

set PLUGIN_DIR=D:\Notes\Obsidian\liveSync\dev\.obsidian\plugins\jop-web

:: 플러그인 디렉토리가 없으면 생성
if not exist "%PLUGIN_DIR%" mkdir "%PLUGIN_DIR%"

:: 1. 빌드
call yarn build && ^
:: 2. git 변경사항 커밋
call git add . && ^
call git commit -m "chore: build for publish to obsidian" && ^
:: 3. npm 버전 업데이트 (이때 자동으로 버전 태그가 생성됨)
call npm version %mode% && ^
:: 4. git push
call git push --follow-tags && ^
:: 5. obsidian 플러그인 배포
xcopy /E /Y dist\* "%PLUGIN_DIR%\"