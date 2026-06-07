@echo off
REM Simple git push helper for Windows (run outside VS Code if terminal fails)
REM Usage: scripts\git-push.bat [commit message]

cd /d "%~dp0.."

echo Current branch:
git rev-parse --abbrev-ref HEAD || goto git_error

echo
echo Git status (porcelain):
git status --porcelain

if "%~1"=="" (
  set "MSG=chore: save changes"
) else (
  set "MSG=%~1"
)

set CHANGED=
for /f "delims=" %%i in ('git status --porcelain') do set CHANGED=1

if not defined CHANGED (
  echo Working tree clean — pushing current branch
  git push || goto git_error
  goto end
)

echo Changes detected. Staging all changes...
git add -A || goto git_error

echo Committing with message: %MSG%
git commit -m "%MSG%" || (
  echo Nothing to commit or commit failed.
)

echo Pushing...
git push || goto git_error

:end
echo Done.
pause
goto :eof

:git_error
echo Git command failed. Please run the commands manually or fix your git setup.
pause
exit /b 1
