# ⚡ Cerkit AI — Mission Control & Data Intelligence Workspace (Frontend)

[![React](https://img.shields.io/badge/React-v19.2.8-61DAFB?style=flat-square&logo=react)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-v8.3.0-646CFF?style=flat-square&logo=vite)](https://vitejs.dev)
[![Lucide](https://img.shields.io/badge/Lucide_Icons-v1.48-F56565?style=flat-square)](https://lucide.dev)
[![SSE](https://img.shields.io/badge/Streaming-Server--Sent_Events-38BDF8?style=flat-square)](#)

> Modern, reactive, cyberpunk-aesthetic Mission Control frontend for **Cerkit AI** — an autonomous multi-agent data engineering and swarm intelligence platform.

---

## 📚 Complete Technical Documentation

* 📖 **[PROJECT_ARCHITECTURE.md](./PROJECT_ARCHITECTURE.md)** *(or [docs/PROJECT_ARCHITECTURE.md](./docs/PROJECT_ARCHITECTURE.md))*  
  Complete master architecture specification covering the entire multi-agent pipeline, data models, APIs, and UI components.
* ⚙️ **[SYSTEM_ARCHITECTURE.md](./SYSTEM_ARCHITECTURE.md)** *(or [docs/SYSTEM_ARCHITECTURE.md](./docs/SYSTEM_ARCHITECTURE.md))*  
  Deep-dive into the dynamic LangGraph execution engine.

---

## 🌟 Core Frontend Capabilities

* **🛸 Mission Control & Live Swarm Tracker (`LiveSwarmTracker.jsx`)**:
  Connects to backend via Server-Sent Events (SSE) to display live DAG state transitions, active sub-agents, real-time logs, and progress bars.
* **📊 Cybernetic Data Grid (`DataTable.jsx`)**:
  Feature-rich dataset table with multi-column sorting, search filters, category pills, and 2-tier header actions:
  - 💬 **Ask AI**: Direct contextual Q&A over dataset records
  - 🔄 **AI Change Tracker**: Opens visual Time-Travel Diff explorer
  - 📄 **Research Report**: Generates synthesized markdown executive dossiers
  - 📥 **Export Data**: Instant CSV / JSON downloads
* **🔍 Cyber-Forensics Source Inspector (`SourceInspectorDrawer.jsx`)**:
  Interactive drawer showing crawl headers, proxy status, raw excerpts, and dual-source verification badges (`VERIFIED` vs `CONTESTED`).
* **⏳ Time-Travel Git Diff Explorer (`TimeTravelDiffModal.jsx`)**:
  Visual comparison of historical dataset snapshots showing newly `Added`, `Removed`, and `Mutated` attributes.
* **🛡️ Human-in-the-Loop Contract Guard (`SchemaReviewModal.jsx`)**:
  Interactive modal presenting inferred data types for operator approval prior to database persistence.

---

## ⚡ Quick Start

### 1. Prerequisites
* Node.js v20+
* Cerkit AI Backend running on port 5000

### 2. Environment Configuration
Create `.env` in `Agentic_system_frontend/`:
```env
VITE_API_URL=http://localhost:5000/api
```

### 3. Installation & Run
```bash
# Install dependencies
npm install

# Start Vite development server
npm run dev

# Build production bundle
npm run build
```

---

## 📂 Key Components Architecture

```
src/
├── components/
│   ├── AIChatPanel.jsx           # Conversational AI panel with starter queries
│   ├── DataTable.jsx             # 2-Tier data grid with status badges
│   ├── LiveSwarmTracker.jsx      # Real-time SSE DAG step tracker
│   ├── SourceInspectorDrawer.jsx # Cyber-forensics crawl metadata drawer
│   ├── TimeTravelDiffModal.jsx   # Git-style snapshot diff comparator
│   ├── ResearchReportModal.jsx   # Markdown executive dossier viewer
│   ├── SchemaReviewModal.jsx     # HITL schema contract review modal
│   └── PromptStudio.jsx          # Natural-language task dispatch studio
├── services/
│   └── api.js                    # Fetch client with JWT session & SSE reader
├── App.jsx                       # Main navigation router & view switch
└── index.css                     # Custom cybernetic dark-mode design system
```

---

## 📄 License
ISC License — Cerkit AI Swarm Engine.
