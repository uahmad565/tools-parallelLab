# 🚀 Docker Quick Start

## Super Fast Setup (Windows)

### 1. Start Backend (in Docker)
```bash
start-docker-backend.bat
```
Waits for: Image build + container start (~3 minutes first time, ~10 seconds after)

### 2. Start Frontend (local)
```bash
start-frontend.bat
```

### 3. Open Browser
```
http://localhost:5173
```

**Done!** 🎉

---

## Manual Setup

### Build & Run Backend
```bash
cd Backend
docker build -t csv-backend:latest .
docker run -d --name csv-backend -p 5193:5193 csv-backend:latest
```

### Start Frontend
```bash
cd frontend
npm run dev
```

---

## Verify Everything is Running

### Check Backend
```bash
docker ps
```
Should see `csv-backend` running.

### Test API
Open: http://localhost:5193/swagger

### Test Frontend
Open: http://localhost:5173

---

## Stop Everything

### Stop Backend
```bash
stop-docker-backend.bat
```
Or:
```bash
docker stop csv-backend
docker rm csv-backend
```

### Stop Frontend
Press `Ctrl+C` in terminal

---

## View Logs

```bash
docker logs -f csv-backend
```

---

## Common Issues

### "Docker is not running"
**Solution**: Start Docker Desktop

### "Port 5193 already in use"
**Solution**: 
```bash
docker stop csv-backend
docker rm csv-backend
```

### "Can't connect to backend"
**Solution**: Check container is running:
```bash
docker ps | grep csv-backend
```

---

## Architecture

```
Your Computer
├── Docker Container (Backend)
│   └── Linux + .NET 9 + Port 5193
└── Local (Frontend)
    └── Node.js + Vite + Port 5173
```

Frontend (local) → HTTP/WebSocket → Backend (Docker)

---

## What's Different from Regular Setup?

| Aspect | Regular | Docker |
|--------|---------|--------|
| Backend | `dotnet run` | Docker container |
| Frontend | `npm run dev` | `npm run dev` (same) |
| Backend Port | 5193 | 5193 (mapped) |
| OS | Windows | **Linux** (in container) |
| Deployment | Manual | **Portable image** |

---

## Full Documentation

See [DOCKER_SETUP.md](DOCKER_SETUP.md) for complete details.

