@echo off
echo ========================================================
echo    Starting NexusAI Orchestrator (MAGICMASHUP)
echo ========================================================
echo.

start "NexusAI Backend (FastAPI)" cmd /k "cd backend && python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload"

timeout /t 2 /nobreak >nul

start "NexusAI Frontend (Vite)" cmd /k "cd frontend && npm run dev"

echo.
echo Both services launched!
echo Frontend will be accessible at: http://localhost:5173
echo Backend API docs available at:  http://localhost:8000/docs
echo.
pause
