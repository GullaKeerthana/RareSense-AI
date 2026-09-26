# RareSense AI — Setup Guide

React + FastAPI + MongoDB rare-disease healthcare platform.

## Prerequisites
- Node.js 18+ (built with v24)
- Python 3.11+ (built with 3.13)
- Internet access (MongoDB Atlas and OpenAI are called live over the network)

## 1. Backend setup

```
cd backend
python -m venv .venv
```

Windows:
```
.venv\Scripts\pip install -r requirements.txt
.venv\Scripts\python -m uvicorn app.main:app --reload
```

macOS/Linux:
```
.venv/bin/pip install -r requirements.txt
.venv/bin/python -m uvicorn app.main:app --reload
```

Starts on **http://127.0.0.1:8000**. `backend/.env` already has working MongoDB Atlas and OpenAI credentials — nothing to configure to just run it.

### First-time only: seed the database
Populates the Knowledge Hub, Government Schemes, NGO Directory, and Hospitals. These upsert by name, so it's harmless to run again later:
```
.venv\Scripts\python -m app.seed.seed_knowledge
.venv\Scripts\python -m app.seed.seed_schemes_ngos
.venv\Scripts\python -m app.seed.seed_hospitals
```

### Creating an admin account
Admins can't self-register through the UI (by design). Register a normal account first at the app, then run:
```
.venv\Scripts\python -m app.seed.promote_admin your@email.com
```
Log out and back in — you'll land on the Admin Console instead of the regular app.

## 2. Frontend setup

```
cd frontend
npm install
npm run dev
```

Opens on **http://localhost:5173** — `frontend/.env` is already pointed at the backend on port 8000.

## 3. Using it

With both servers running, open http://localhost:5173, register an account, and go.

## Notes

- `backend/.env` and `frontend/.env` contain live credentials (MongoDB Atlas connection string, OpenAI API key, JWT signing secret) — the project runs as-is, no new keys needed.
- MongoDB Atlas Network Access is currently set to allow any IP (`0.0.0.0/0`), so it should connect fine from this laptop without further Atlas configuration. Worth tightening to specific IPs later if this becomes a long-lived deployment rather than a demo.
- If port 8000 or 5173 is already taken on this machine, add `--port <n>` to the uvicorn/`npm run dev` command and update `frontend/.env`'s `VITE_API_BASE_URL` to match.
- `node_modules/` and `.venv/` are intentionally not included — `npm install` and `pip install -r requirements.txt` regenerate them in a minute or two.
