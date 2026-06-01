@echo off
echo Starting Django backend...
cd backend
call venv\Scripts\activate.bat
start "Django Backend" cmd /c "python manage.py runserver"
cd ..

echo --------------------------------------------------------
echo To use the advanced Dukan AI chat, you can provide an OpenRouter API key.
echo If you don't have one, just press Enter to use the basic offline AI.
set /p OPENROUTER_KEY="Enter OpenRouter API Key (sk-or-...): "

if "%OPENROUTER_KEY%"=="" (
    echo VITE_OPENROUTER_API_KEY= > frontend\.env.local
    echo Skipped API Key. Basic offline AI will be used.
) else (
    echo VITE_OPENROUTER_API_KEY=%OPENROUTER_KEY% > frontend\.env.local
    echo API Key saved to frontend\.env.local
)
echo --------------------------------------------------------

echo Starting Vite frontend...
cd frontend
call npm install
start "Vite Frontend" cmd /c "npm run dev"
cd ..

echo Waiting for servers to initialize...
timeout /t 3 /nobreak > nul

echo Opening browser...
start http://localhost:5173

echo.
echo Servers are running in separate command windows. 
echo To stop the servers, close the "Django Backend" and "Vite Frontend" windows.
pause
