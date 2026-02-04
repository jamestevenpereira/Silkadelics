@echo off
echo Iniciando WoodPlan Events...

echo Iniciando Backend...
start cmd /k "cd backend && npm install && npm start"

echo Iniciando Frontend...
start cmd /k "cd frontend && npm install && npm start"

echo Tudo pronto! Verifique as janelas abertas.
pause
