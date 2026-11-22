# 🌙 LunarNote — Celestial Editorial Blog Platform

> *"Your thoughts deserve their own universe."*

**LunarNote** is a modern, celestial-inspired editorial blogging platform built with the MERN stack. Designed with deep midnight tones, refined typography, and moonlit aesthetics, LunarNote offers a distraction-free environment for reading, writing, and exploring thoughtful essays.

---

## ✨ Features

- **Celestial Design System:** Deep midnight-blue canvas (`#070B14`), restrained cyan illumination, and elegant typography paired with clean sans-serif UI controls.
- **Dual Theme Support:** Seamless, high-contrast dark and light modes with zero flash-of-theme on load and `localStorage` persistence.
- **Dynamic Category Management:** Choose from curated editorial presets (`Engineering`, `Design`, `Culture`, etc.) or freely type custom categories that automatically sync and aggregate into filter pills.
- **Editorial Reading Experience:** Comfortable typography measure (60-75 characters per line), estimated reading times, and markdown formatting.
- **Rich Story Editor:** Real-time word count, live reading time estimates, cover image presets, tag management, and instant live preview tab.
- **Resilient MERN Architecture:** Powered by React 19, TanStack Query v5, Node.js 20 Express, and MongoDB Atlas with Mongoose 9.
- **Production-Ready Containerization:** Multi-stage Docker builds, Nginx Alpine reverse proxy, persistent MongoDB storage, and health checks.
- **Automated CI/CD:** Complete GitHub Actions workflows for continuous integration, Docker Hub publishing, and Google Cloud Run deployment.

---

## 🛠️ Tech Stack

- **Frontend:** React 19, Vite, TanStack Query v5, Vanilla CSS Design System with CSS Custom Properties.
- **Backend:** Node.js 20 LTS, Express 5, Mongoose 9, dotenv.
- **Database:** MongoDB 7 / MongoDB Atlas Cloud Cluster.
- **DevOps & Infrastructure:** Docker, Docker Compose, Nginx, GitHub Actions, Google Cloud Run.

---

## 🚀 Getting Started

### 1. Prerequisites
- [Node.js 20 LTS](https://nodejs.org/) or higher
- [Docker](https://www.docker.com/) & Docker Compose (optional for containerized run)
- [MongoDB](https://www.mongodb.com/) (local or MongoDB Atlas connection string)

### 2. Clone the Repository
```bash
git clone https://github.com/preeym25/LunarNote.git
cd LunarNote
```

### 3. Quickstart with Docker Compose (Recommended)
Launch the entire stack (MongoDB, Express Backend, and Nginx-served Frontend) with one command:
```bash
docker compose up --build
```
- **Frontend App:** http://localhost:80
- **Backend API:** http://localhost:3000
- **Health Check:** http://localhost:3000/health

---

## 💻 Local Development Setup

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables:
   ```bash
   cp .env.example .env
   ```
   Edit `.env` to configure `PORT=3000` and your `DATABASE_URL` (local or MongoDB Atlas).
4. Start the backend development server:
   ```bash
   npm run dev
   ```
5. *(Optional)* Seed sample celestial articles:
   ```bash
   npm run seed
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start Vite development server:
   ```bash
   npm run dev
   ```
4. Open http://localhost:5173 in your browser.

---

## 🧪 Testing

Run backend automated Jest test suite (31 unit & integration tests):
```bash
cd backend
npm test
```

Lint frontend code:
```bash
cd frontend
npm run lint
```

Build production bundle:
```bash
cd frontend
npm run build
```

---

## ☁️ Cloud Deployment & CI/CD

See detailed step-by-step instructions in [docs/CLOUD_DEPLOYMENT.md](docs/CLOUD_DEPLOYMENT.md) for:
- MongoDB Atlas cluster setup & network access.
- Docker Hub repository setup and automated image tagging.
- Google Cloud Run continuous deployment.
- Configuring GitHub repository secrets for GitHub Actions workflows:
  - `.github/workflows/backend-ci.yml` (Tests & container build checks)
  - `.github/workflows/frontend-ci.yml` (Linting, bundling & container checks)
  - `.github/workflows/deploy-cd.yml` (Continuous delivery to Cloud Run)

---

## 📄 License
ISC License.
