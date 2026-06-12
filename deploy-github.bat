@echo off
echo ============================================
echo   StoriesByDeep.com - GitHub Deploy
echo   Account: deepkhunt25
echo ============================================
echo.

set GIT="C:\Program Files\Git\bin\git.exe"
set GH="C:\Program Files\GitHub CLI\gh.exe"
set REPO=StoriesByDeep.com
set USER=deepkhunt25

cd /d "%~dp0"

echo Step 1: GitHub login (browser will open)...
%GH% auth login -w -p https -h github.com
if errorlevel 1 goto error

echo.
echo Step 2: Connecting to github.com/%USER%/%REPO% ...
%GIT% remote remove origin 2>nul
%GIT% remote add origin https://github.com/%USER%/%REPO%.git

echo.
echo Step 3: Pushing website code (Orphan Deploy)...
for /f "tokens=*" %%i in ('%GIT% branch --show-current') do set CURRENT_BRANCH=%%i
set TEMP_BRANCH=temp-deploy-%RANDOM%

echo Creating temporary clean branch: %TEMP_BRANCH%...
%GIT% checkout --orphan %TEMP_BRANCH% >nul 2>nul
if errorlevel 1 goto error

%GIT% rm -rf --cached . >nul 2>nul
%GIT% add .

echo Creating clean release commit...
%GIT% commit -m "Deploy from Windows" >nul 2>nul

echo Pushing code to origin/main...
%GIT% push -f origin %TEMP_BRANCH%:main
if errorlevel 1 (
    %GIT% checkout %CURRENT_BRANCH% >nul 2>nul
    %GIT% branch -D %TEMP_BRANCH% >nul 2>nul
    goto error
)

echo Cleaning up temporary branch...
%GIT% checkout %CURRENT_BRANCH% >nul 2>nul
%GIT% branch -D %TEMP_BRANCH% >nul 2>nul

echo.
echo Step 4: Enabling GitHub Pages...
%GH% api repos/%USER%/%REPO%/pages -X POST -f "source[branch]=main" -f "source[path]=/" 2>nul
%GH% api repos/%USER%/%REPO%/pages -X PUT -f "cname=storiesbydeep.com" 2>nul

echo.
echo ============================================
echo   DONE! Your site will be live at:
echo.
echo   https://storiesbydeep.com
echo   (or https://%USER%.github.io/%REPO%/)
echo.
echo   DNS: Point storiesbydeep.com to GitHub Pages
echo   (Settings ^> Pages ^> Custom domain)
echo ============================================
pause
goto end

:error
echo.
echo Login failed or push error.
echo Try manual steps in DEPLOY.md
pause

:end
