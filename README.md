# Cerkit AI / Kortex - Autonomous Agentic Intelligence Platform

An enterprise-grade, autonomous web intelligence and data engineering platform. Features dynamic multi-agent DAG planning (LangGraph), vision-guided self-healing scrapers, dialectic red-team fact-checking, and Git-style temporal dataset diffing.

---

## 📁 Monorepo Structure

```text
agentic-system/
├── frontend/               # Vite + React 19 Frontend Dashboard
│   ├── src/                # UI Components (DataTable, SwarmTracker, Inspector, etc.)
│   ├── vercel.json         # Vercel SPA Client-Side Routing Configuration
│   ├── package.json
│   └── vite.config.js
│
├── backend/                # Node.js + Express + LangGraph Runtime Swarm
│   ├── src/                # Multi-Agent Nodes, Tools, Services & REST APIs
│   ├── Dockerfile          # Production Docker Container with Headless Chromium
│   ├── .dockerignore
│   └── package.json
│
└── README.md
```

---

## 🚀 Deployment Guide

### 1. Backend Deployment (Render.com)
1. Go to [Render.com](https://render.com) and click **New + ➔ Web Service**.
2. Connect this repository (`agentic-system`).
3. Set **Root Directory** to: `backend`
4. Set **Runtime** to: `Docker` (Render automatically uses `backend/Dockerfile`).
5. Add the following **Environment Variables**:
   * `NODE_ENV` = `production`
   * `PORT` = `5000`
   * `MONGO_URI` = `<Your MongoDB Atlas Connection String>`
   * `JWT_SECRET` = `<Your Secret>`
   * `GROQ_API_KEY` = `<Your Groq API Key>`
   * `TAVILY_API_KEY` = `<Your Tavily API Key>`
   * `GOOGLE_API_KEY` = `<Your Google Gemini API Key>`
   * `CLIENT_URL` = `<Your Vercel Frontend URL>`
6. Click **Deploy Web Service**.

---

### 2. Frontend Deployment (Vercel.com)
1. Go to [Vercel.com](https://vercel.com) and click **Add New... ➔ Project**.
2. Import this repository (`agentic-system`).
3. In **Project Configuration**:
   * Click **Edit** next to **Root Directory** and select: `frontend`
   * Framework Preset: `Vite` (Auto-detected)
4. Under **Environment Variables**, add:
   * `VITE_API_URL` = `https://<your-backend-service>.onrender.com/api`
5. Click **Deploy**!

---

## 💻 Local Development

### Run Backend
```bash
cd backend
npm install
# Configure your .env file
npm run dev
```

### Run Frontend
```bash
cd frontend
npm install
# Set VITE_API_URL=http://localhost:5000/api in .env
npm run dev
```

---

## 🛡️ Key Features
* **Multi-Agent Swarm Orchestration**: Automated DAG execution with intent parser, query decomposer, and execution validator.
* **Vision-Guided Self-Healing**: Dynamic CSS selector repair via layout grounding when target sites mutate.
* **Forensic Provenance Inspector**: Full cryptographic proof, source URLs, and crawler telemetry for extracted records.
* **Red-Team Fact-Checking**: Dialectic auditing agent verifying financial and metric claims against counter-sources.