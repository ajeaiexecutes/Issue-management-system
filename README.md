# Minimal Issue Management Platform

A full-stack, modern issue management system built as a machine test.

## Tech Stack
*   **Backend:** Node.js, Express, TypeScript, Drizzle ORM, PostgreSQL
*   **Frontend:** Next.js (App Router), React 19, Tailwind CSS
*   **AI:** Google Gemini API (`gemini-2.5-flash`)

## Architecture
This project is configured as an **NPM Workspaces Monorepo**. This allows you to run both the frontend and backend simultaneously with a single command. 

The backend follows a strict **Controller-Service** architecture with boundary validation powered by **Zod**. The frontend utilizes **React Server Components** for optimal data fetching and clean state management.

---

## Environment Variables
Before running the project, ensure you have the following environment variables configured. 

**Backend (`backend/.env`):**
```env
DATABASE_URL="postgres://user:password@localhost:5432/issue_management"
PORT=3001
GEMINI_API_KEY="your-google-gemini-api-key"
```

**Frontend (`frontend/.env.local`):**
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

*(Note: These files have already been generated for you with local defaults, but you will need to add your real `GEMINI_API_KEY` to the backend `.env` file!)*

---

## Setup & Execution Instructions

### 1. Start the Database (Docker)
We use a local PostgreSQL instance running in Docker to ensure zero-dependency setup.
```bash
# From the root directory:
docker compose up -d
```

### 2. Install Dependencies
Because this is a monorepo, you only need to run this once at the root:
```bash
npm run install:all
```

### 3. Setup Database Schema & Seed Data
Push the Drizzle ORM schema to your Docker database and seed it with mock issues:
```bash
npm run db:migrate
npm run db:seed
```

### 4. Run the Application
Start both the Next.js frontend (Port 3000) and the Express backend (Port 3001) concurrently:
```bash
npm run dev
```

*   **Frontend UI:** http://localhost:3000
*   **Backend API:** http://localhost:3001/health
*   **Swagger API Docs:** http://localhost:3001/api-docs

---

## Features
*   **Dashboard:** View and filter all issues.
*   **Issue Creation:** Create new issues with Zod-validated payloads.
*   **Discussions:** Add comments to issues.
*   **AI Insights:** Click "Generate Analysis" on any issue to trigger Gemini. The AI will read the issue description and all discussions, outputting a JSON summary and action items, which are then cached in the database for optimal performance.
