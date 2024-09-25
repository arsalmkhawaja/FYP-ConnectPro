@echo off
REM Start the frontend server
echo Starting frontend server...
cd /d C:/Users/Muhammad Arsal/Desktop/COMSATS/FYP/Connect Pro/Connect Pro Implimentation/connect_pro/
start npm start

REM Start the Python script (if needed)
echo Starting Python script...
cd /d C:/Users/Muhammad Arsal/Desktop/COMSATS/FYP/Connect Pro/Connect Pro Implimentation/connect_pro/
start python app.py

REM Start the backend server
echo Starting backend server...
cd /d C:/Users/Muhammad Arsal/Desktop/COMSATS/FYP/Connect Pro/Connect Pro Implimentation/connect_pro/backend
start npm start

echo All services started.
