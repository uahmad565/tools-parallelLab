# 🐳 Docker Setup - Backend Only

## Overview

The **Backend** runs in a Linux-based Docker container, while the **Frontend** runs locally on your machine. This setup provides:
- ✅ Consistent backend environment (Linux)
- ✅ Easy deployment and portability
- ✅ Frontend development flexibility
- ✅ Simple architecture (no Docker Compose needed)

## Architecture

```
┌─────────────────────────────────────────┐
│     Host Machine (Windows)               │
│                                          │
│  ┌────────────────────────────────┐     │
│  │  React Frontend (Port 5173)    │     │
│  │  - npm run dev                 │     │
│  │  - Vite dev server             │     │
│  └──────────┬─────────────────────┘     │
│             │                            │
│             │ HTTP/WebSocket             │
│             │ (localhost:5193)           │
│             ▼                            │
│  ┌────────────────────────────────┐     │
│  │  Docker Container (Port 5193)  │     │
│  │  ┌──────────────────────────┐  │     │
│  │  │ ASP.NET Core Backend     │  │     │
│  │  │ - Linux Alpine           │  │     │
│  │  │ - .NET 9.0 Runtime       │  │     │
│  │  └──────────────────────────┘  │     │
│  └────────────────────────────────┘     │
└─────────────────────────────────────────┘
```

## Prerequisites

- Docker Desktop installed (Windows/Mac/Linux)
- Node.js 18+ and npm (for frontend)
- .NET 9.0 SDK (optional, only for local development)

## Quick Start

### 1. Build Docker Image

```bash
cd Backend
docker build -t csv-backend:latest .
```

**Build time**: ~2-3 minutes (first time)

### 2. Run Docker Container

```bash
docker run -d \
  --name csv-backend \
  -p 5193:5193 \
  csv-backend:latest
```

**Container starts in ~2 seconds**

### 3. Start Frontend (Local)

```bash
cd frontend
npm install  # First time only
npm run dev
```

**Frontend runs on**: http://localhost:5173

### 4. Access Application

Open browser: **http://localhost:5173**

Upload CSV files and watch real-time SignalR progress! 🚀

## Detailed Commands

### Build Docker Image

```bash
# Navigate to Backend directory
cd Backend

# Build with tag
docker build -t csv-backend:latest .

# Build with custom tag
docker build -t csv-backend:v1.0.0 .

# Build with no cache (clean build)
docker build --no-cache -t csv-backend:latest .
```

### Run Container

**Basic run:**
```bash
docker run -d --name csv-backend -p 5193:5193 csv-backend:latest
```

**With logs visible:**
```bash
docker run --name csv-backend -p 5193:5193 csv-backend:latest
```

**With restart policy:**
```bash
docker run -d \
  --name csv-backend \
  --restart unless-stopped \
  -p 5193:5193 \
  csv-backend:latest
```

**With environment variables:**
```bash
docker run -d \
  --name csv-backend \
  -p 5193:5193 \
  -e ASPNETCORE_ENVIRONMENT=Production \
  csv-backend:latest
```

### Container Management

**View running containers:**
```bash
docker ps
```

**View all containers:**
```bash
docker ps -a
```

**View logs:**
```bash
docker logs csv-backend

# Follow logs (live)
docker logs -f csv-backend

# Last 100 lines
docker logs --tail 100 csv-backend
```

**Stop container:**
```bash
docker stop csv-backend
```

**Start stopped container:**
```bash
docker start csv-backend
```

**Restart container:**
```bash
docker restart csv-backend
```

**Remove container:**
```bash
docker rm csv-backend

# Force remove (if running)
docker rm -f csv-backend
```

**Remove image:**
```bash
docker rmi csv-backend:latest
```

## Configuration

### Port Mapping

The container exposes port **5193** internally. You can map it to a different host port:

```bash
# Map to port 8080 on host
docker run -d --name csv-backend -p 8080:5193 csv-backend:latest
```

Then update frontend URLs to use port 8080.

### Environment Variables

**Development (default):**
```bash
docker run -d --name csv-backend \
  -p 5193:5193 \
  -e ASPNETCORE_ENVIRONMENT=Development \
  csv-backend:latest
```

**Production:**
```bash
docker run -d --name csv-backend \
  -p 5193:5193 \
  -e ASPNETCORE_ENVIRONMENT=Production \
  csv-backend:latest
```

### File Size Limits

Already configured for **5GB** files. No additional configuration needed.

### CORS Configuration

Already configured to allow:
- `http://localhost:5173` (Vite dev server)
- `http://localhost:3000` (Alternative React port)
- `http://host.docker.internal:5173` (Docker internal)

## Dockerfile Explained

```dockerfile
# Stage 1: Build
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src
COPY Backend.csproj .
RUN dotnet restore
COPY . .
RUN dotnet build -c Release -o /app/build

# Stage 2: Publish
FROM build AS publish
RUN dotnet publish -c Release -o /app/publish

# Stage 3: Runtime (Final)
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS final
WORKDIR /app
COPY --from=publish /app/publish .
EXPOSE 5193
ENV ASPNETCORE_URLS=http://+:5193
ENTRYPOINT ["dotnet", "Backend.dll"]
```

**Multi-stage build benefits:**
- ✅ Smaller final image (~200MB vs 1GB+)
- ✅ Faster deployment
- ✅ More secure (no build tools in production)
- ✅ Linux Alpine base (lightweight)

## Testing

### 1. Verify Container is Running

```bash
docker ps
```

Expected output:
```
CONTAINER ID   IMAGE                PORTS                    STATUS
abc123def456   csv-backend:latest   0.0.0.0:5193->5193/tcp   Up 2 minutes
```

### 2. Check Container Logs

```bash
docker logs csv-backend
```

Expected output:
```
info: Microsoft.Hosting.Lifetime[14]
      Now listening on: http://[::]:5193
info: Microsoft.Hosting.Lifetime[0]
      Application started. Press Ctrl+C to shut down.
```

### 3. Test API Endpoint

```bash
curl http://localhost:5193/swagger
```

Or open in browser: http://localhost:5193/swagger

### 4. Test File Upload

1. Start frontend: `npm run dev`
2. Open: http://localhost:5173
3. Upload `sample-data.csv`
4. Watch SignalR progress updates! 🎉

## Troubleshooting

### Container won't start

**Check logs:**
```bash
docker logs csv-backend
```

**Common issues:**
- Port 5193 already in use
- Insufficient resources
- Image build failed

**Solution:**
```bash
# Stop any conflicting containers
docker stop $(docker ps -q)

# Use different port
docker run -d --name csv-backend -p 8080:5193 csv-backend:latest
```

### Can't connect from frontend

**Check container is running:**
```bash
docker ps | grep csv-backend
```

**Check container IP:**
```bash
docker inspect csv-backend | grep IPAddress
```

**Test connectivity:**
```bash
curl http://localhost:5193/swagger
```

**Check CORS logs:**
```bash
docker logs csv-backend | grep CORS
```

### SignalR connection fails

**Check CORS configuration:**
- Ensure frontend URL is in CORS allowed origins
- Verify `AllowCredentials()` is enabled

**Check WebSocket support:**
```bash
# Should see WebSocket upgrade
docker logs csv-backend | grep WebSocket
```

### File upload fails

**Check container memory:**
```bash
docker stats csv-backend
```

**Increase Docker memory** (Docker Desktop → Settings → Resources):
- Minimum: 4 GB
- Recommended: 8 GB for large files

### Performance issues

**Check container resources:**
```bash
docker stats csv-backend
```

**Limit resources:**
```bash
docker run -d \
  --name csv-backend \
  --memory="4g" \
  --cpus="2" \
  -p 5193:5193 \
  csv-backend:latest
```

## Production Deployment

### Build for Production

```bash
cd Backend
docker build -t csv-backend:1.0.0 .
```

### Run in Production

```bash
docker run -d \
  --name csv-backend-prod \
  --restart unless-stopped \
  -p 5193:5193 \
  -e ASPNETCORE_ENVIRONMENT=Production \
  --memory="8g" \
  --cpus="4" \
  csv-backend:1.0.0
```

### Push to Registry

```bash
# Tag for registry
docker tag csv-backend:1.0.0 yourusername/csv-backend:1.0.0

# Push to Docker Hub
docker push yourusername/csv-backend:1.0.0
```

### Pull and Run on Server

```bash
# Pull image
docker pull yourusername/csv-backend:1.0.0

# Run
docker run -d \
  --name csv-backend \
  --restart unless-stopped \
  -p 5193:5193 \
  -e ASPNETCORE_ENVIRONMENT=Production \
  yourusername/csv-backend:1.0.0
```

## Container Health Check

Add to Dockerfile for monitoring:

```dockerfile
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl --fail http://localhost:5193/swagger || exit 1
```

Check health:
```bash
docker ps --format "table {{.Names}}\t{{.Status}}"
```

## Image Size

**Typical sizes:**
- SDK image (build): ~1.2 GB
- Runtime image (final): ~200-250 MB

**View image size:**
```bash
docker images csv-backend
```

**Optimize further** (optional):
```dockerfile
# Use Alpine runtime
FROM mcr.microsoft.com/dotnet/aspnet:9.0-alpine AS final
```

This reduces image to ~150 MB.

## Development Workflow

### 1. Make Code Changes
Edit files in `Backend/`

### 2. Rebuild Image
```bash
cd Backend
docker build -t csv-backend:latest .
```

### 3. Stop Old Container
```bash
docker stop csv-backend
docker rm csv-backend
```

### 4. Run New Container
```bash
docker run -d --name csv-backend -p 5193:5193 csv-backend:latest
```

### 5. Test Changes
Frontend automatically reconnects to new backend.

## Quick Reference

| Command | Description |
|---------|-------------|
| `docker build -t csv-backend .` | Build image |
| `docker run -d --name csv-backend -p 5193:5193 csv-backend` | Run container |
| `docker ps` | List running containers |
| `docker logs csv-backend` | View logs |
| `docker stop csv-backend` | Stop container |
| `docker start csv-backend` | Start container |
| `docker restart csv-backend` | Restart container |
| `docker rm csv-backend` | Remove container |
| `docker rmi csv-backend` | Remove image |
| `docker exec -it csv-backend bash` | Enter container shell |

## Summary

✅ **Backend**: Runs in Docker container (Linux)
✅ **Frontend**: Runs locally (npm run dev)
✅ **Communication**: HTTP/WebSocket on port 5193
✅ **SignalR**: Real-time progress updates work perfectly
✅ **File Uploads**: Supports up to 5GB files
✅ **No Docker Compose**: Simple single-container setup
✅ **Production Ready**: Multi-stage build, optimized image

---

**Happy Dockerizing! 🐳🚀**

