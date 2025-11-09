@echo off
echo Stopping Backend Container...
docker stop csv-backend
docker rm csv-backend
echo Backend stopped!
pause

