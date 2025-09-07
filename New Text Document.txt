@echo off
REM ====== CHANGE THIS PATH TO YOUR PROJECT FOLDER ======
cd /d C:\Users\HP\Desktop\MyAI

REM ====== ACTIVATE VIRTUAL ENVIRONMENT ======
call virtEnv\Scripts\activate

REM ====== CHANGE THIS PATH TO YOUR PROJECT FOLDER ======
cd /d C:\Users\HP\Desktop\MyAI\backend

REM ====== RUN FLASK APP in background (same CMD window stays) ======
start /b python server.py

REM ====== WAIT 3 SECONDS ======
timeout /t 5 /nobreak >nul

REM ====== OPEN BROWSER ======
start "" http://127.0.0.1:5000

REM ====== KEEP WINDOW OPEN AFTER EXIT ======
pause
