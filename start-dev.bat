@echo off
echo Starting Fit Genie Development Environment...
echo.

echo Starting Backend Server...
start "Backend Server" cmd /k "cd /d C:\Users\ritsa\projects\Stylin && npm start"

echo Waiting for backend to start...
timeout /t 3 /nobreak > nul

echo Starting Frontend React App...
start "Frontend React App" cmd /k "cd /d C:\Users\ritsa\projects\Stylin\frontend && npm start"

echo.
echo ================================================
echo   Fit Genie Development Environment Started!
echo ================================================
echo.
echo Backend API:  http://localhost:3001/api
echo Frontend:     http://localhost:3000
echo.
echo Press any key to close this window...
pause > nul