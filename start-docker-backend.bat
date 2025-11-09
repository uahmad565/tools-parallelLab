@echo off
echo ================================
echo CSV Backend - Docker Setup
echo ================================
echo.

REM Check if Docker is running
docker version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Docker is not running!
    echo Please start Docker Desktop and try again.
    pause
    exit /b 1
)

echo [1/4] Stopping existing container...
docker stop csv-backend >nul 2>&1
docker rm csv-backend >nul 2>&1

echo [2/4] Building Docker image...
cd Backend
docker build -t csv-backend:latest .
if %errorlevel% neq 0 (
    echo ERROR: Docker build failed!
    cd ..
    pause
    exit /b 1
)
cd ..

echo [3/4] Starting container...
docker run --cpus="1" --memory="1g" -d --name csv-backend --restart unless-stopped -p 5193:5193 csv-backend:latest
if %errorlevel% neq 0 (
    echo ERROR: Failed to start container!
    pause
    exit /b 1
)

echo [4/4] Verifying container...
timeout /t 2 /nobreak >nul
docker ps | findstr csv-backend >nul
if %errorlevel% neq 0 (
    echo ERROR: Container is not running!
    docker logs csv-backend
    pause
    exit /b 1
)

echo.
echo ================================
echo SUCCESS! Backend is running
echo ================================
echo.
echo Backend API: http://localhost:5193
echo Swagger UI: http://localhost:5193/swagger
echo.
echo View logs: docker logs -f csv-backend
echo Stop backend: docker stop csv-backend
echo.
echo Now start frontend with: start-frontend.bat
pause

