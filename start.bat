@echo off
echo Starting Django backend...
cd backend
call venv\Scripts\activate.bat
start "Django Backend" cmd /c "python manage.py runserver"
cd ..

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
