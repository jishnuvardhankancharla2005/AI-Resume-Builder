@echo off
echo =========================================
echo    Starting AI Resume Generator...
echo =========================================

echo.
echo [1/3] Starting Ollama Local Server with Mistral Model...
start /MIN "Ollama" cmd /k "ollama serve"
timeout /t 3 /nobreak > nul
start /MIN "Mistral" cmd /k "ollama run mistral"
timeout /t 5 /nobreak > nul

echo.
echo [2/3] Starting Backend API Server...
cd server
start "Backend" cmd /k "npm start"

echo.
echo [3/3] Starting Frontend React Server...
cd ../client
start "Frontend" cmd /k "npm run dev"

echo.
echo =========================================
echo All services are starting up!
echo You can close this window at any time.
echo To stop services, you may need to close the NodeJS and Ollama processes in Task Manager.
echo =========================================
exit
