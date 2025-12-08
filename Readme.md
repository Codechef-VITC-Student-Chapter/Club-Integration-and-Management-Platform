Club Integration and Management Platform

Overview
- Full‑stack monorepo for a club management platform.
- Frontend: Next.js (TypeScript, Tailwind, shadcn/ui, Redux Toolkit) in `Client/`.
- Backend: Go (Gin), MongoDB, JWT auth, SMTP/Resend email in `Server/`.

Prerequisites
- Node.js 18+ and npm (recommended for Next.js)
- Go 1.21+ (or the version in `Server/go.mod`)
- MongoDB Atlas or a local MongoDB connection string
- PowerShell (these commands are written for Windows PowerShell 5.1)

Ports
- API server: `http://localhost:3000`
- Web app: `http://localhost:3001`

Quick Start (Local)
1) Backend (Server)
- Open a new terminal and run:

```powershell
cd "Server"
go mod tidy

# Create .env if you don't have one already
if (!(Test-Path .env)) { New-Item -Path . -Name ".env" -ItemType "file" | Out-Null }

# Start the API (basic)
go run ./cmd/main.go

# Optional: hot-reload via Air
# go install github.com/air-verse/air@latest
# air
```

2) Frontend (Client)
- In another terminal:

```powershell
cd "Client"
npm install

# Create .env.local if you don't have one
if (!(Test-Path .env.local)) { New-Item -Path . -Name ".env.local" -ItemType "file" | Out-Null }

# Start Next.js on port 3001
npm run dev -- -p 3001
```

Environment Variables
Never commit secrets. Use the following templates and replace placeholders with your values.

Server/.env
```dotenv
# MongoDB
CONNECTION_STRING=mongodb+srv://<user>:<password>@<cluster>/<db>?retryWrites=true&w=majority&appName=<appName>
DATABASE_NAME=AppData

# Auth
JWT_SECRET_KEY=<random-long-secret>

# Email (Resend via SMTP)
SMTP_HOST=smtp.resend.com
SMTP_LOGIN=resend
SMTP_PASSWORD=<resend_smtp_key>
CLUB_EMAIL=<no-reply@your-domain>
RESEND_API_KEY=<resend_api_key>

# Gin mode: use "debug" for development
GIN_MODE=debug

# CORS/Client origin for auth flows
CLIENT_URL=http://localhost:3001
```

Client/.env.local
```dotenv
NEXT_PUBLIC_BASE_URL=http://localhost:3001
NEXTAUTH_URL=http://localhost:3001
NEXTAUTH_SECRET=<generate_a_base64_32+_secret>

# Point the frontend to the local API
NEXT_PUBLIC_API_URL=http://localhost:3000/api

# Example production override (commented)
# NEXT_PUBLIC_API_URL=https://<your-prod-backend>/api
```

Generate a NextAuth secret
```powershell
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

Folder Layout
- `Client/`: Next.js app, components, hooks, redux store, schemas, and API types.
- `Server/`: Go service (Gin), routes, controllers, middlewares, Mongo schemas, email service.
- `Server/cmd/main.go`: Application entrypoint.
- `Server/.air.toml`: Optional Air hot-reload config.

Running the Server with Docker (optional)
From `Server/`:
```powershell
# Build
docker build --no-cache -t cimp_backend .

# Run (exposes 3000, loads env from .env)
docker run --env-file .env -p 3000:3000 cimp_backend:latest

# Optional: tag & push
# docker tag cimp_backend:latest <your-dockerhub-username>/cimp_backend:latest
# docker push <your-dockerhub-username>/cimp_backend:latest
```

Verification
- API health: visit or curl `http://localhost:3000` (or check any defined route).
- App: open `http://localhost:3001` in your browser.

Troubleshooting
- 404/Failed fetch from Client: ensure `Server` is running on port 3000 and `NEXT_PUBLIC_API_URL` is `http://localhost:3000/api`.
- NextAuth callback issues: confirm `NEXTAUTH_URL` matches the browser URL (`http://localhost:3001`).
- CORS errors: verify `CLIENT_URL` in `Server/.env` is `http://localhost:3001` and restart the server.
- SMTP/Emails not sending: double-check `RESEND_API_KEY` and `SMTP_*` credentials and sender domain.
- MongoDB connection: ensure your IP is whitelisted in Atlas and your `CONNECTION_STRING` is valid.

Notes
- Use development credentials locally; do not reuse production secrets from any example or committed files.
- If you change ports, update them consistently in both server and client env files.

