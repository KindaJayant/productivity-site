# Productivity Website Project

**AI-Powered Productivity OS**

SYNAPSE is a high-performance productivity suite designed to clarify your thoughts, secure your focus, and maintain accountability through specialized AI agents. It parks the noise so you can do your best work.

## Core Modules

### 🎯 Focus Mode
Brain-dump everything on your mind before a session. SYNAPSE filters the noise and secures a single, clean focus prompt to guide your deep work.

### 🦆 Rubber Duck
Paste your current approach or architecture. The AI exposes overengineering through Socratic questioning, guiding you toward the simplest, most effective path.

### ⚖️ Accountability
Log your day in plain English. Receive calibrated roasts or hype based on your current streak. Built to keep you honest and consistent.

### ✍️ Silent Journal
A distraction-free space for free-writing thoughts, frustrations, and wins. The agent observes silently and only intercepts when it detects genuine, needle-moving insights.

## Tech Stack

- **Frontend**: Next.js 16 (App Router)
- **Backend/Real-time**: [Convex](https://convex.dev)
- **AI**: OpenRouter (Specialized LLM Agents)
- **Styling**: Tailwind CSS 4 (Neon & Dark Aesthetic)
- **Icons**: Lucide React

## Getting Started

1. **Clone & Install**:
   ```bash
   git clone https://github.com/KindaJayant/productivity-site.git
   cd productivity-site
   npm install
   ```

2. **Environment Setup**:
   Create a `.env.local` file:
   ```env
   CONVEX_DEPLOYMENT=your_deployment_name
   NEXT_PUBLIC_CONVEX_URL=your_convex_url
   OPENROUTER_API_KEY=your_key
   ```

3. **Run Services**:
   ```bash
   # Terminal 1: Next.js dev server
   npm run dev

   # Terminal 2: Convex backend
   npx convex dev
   ```

---
*Built for clarity. Designed for focus.*
