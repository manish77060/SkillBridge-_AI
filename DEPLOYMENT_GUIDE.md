# 🚀 SkillBridge AI — Production Deployment Guide

This guide walks you through deploying **SkillBridge AI** into production using the recommended free/low-cost cloud stack:
- **Database**: [Supabase](https://supabase.com) (PostgreSQL + Auth)
- **Backend API**: [Render](https://render.com) (Python FastAPI Web Service)
- **Frontend**: [Vercel](https://vercel.com) (React + Vite SPA)
- **Alternative**: [Docker Compose](#option-b-deploying-via-docker--vps) (Single VPS)

---

## 📋 Prerequisites Checklist

1. A **GitHub** account with this repository pushed.
2. A **Supabase** account (Free tier).
3. A **Render** account (Free tier).
4. A **Vercel** account (Free tier).

---

## Step 1: Database Setup (Supabase)

1. Log in to [Supabase](https://supabase.com) and create a new project.
2. Go to the **SQL Editor** in your Supabase dashboard.
3. Open [`backend/supabase_setup.sql`](backend/supabase_setup.sql) from this repository, paste the contents into the SQL editor, and click **Run**.
4. Navigate to **Project Settings** -> **API**:
   - Copy the **Project URL** (this is `SUPABASE_URL`).
   - Copy the **`service_role` secret key** (this is `SUPABASE_SECRET_KEY`).
     *(Keep this secret key safe and never share it in the frontend!)*

---

## Step 2: Deploy Backend to Render

1. Sign in to [Render](https://dashboard.render.com).
2. Click **New +** -> **Web Service**.
3. Connect your GitHub repository.
4. Configure the service settings:
   - **Name**: `skillbridge-backend` (or your preferred name)
   - **Root Directory**: `backend`
   - **Environment / Runtime**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
5. In the **Environment Variables** section, add the following:

| Variable Name | Value |
| :--- | :--- |
| `PYTHON_VERSION` | `3.11.9` |
| `SUPABASE_URL` | `https://your-project.supabase.co` |
| `SUPABASE_SECRET_KEY` | `your-supabase-service-role-key` |
| `ADMIN_JWT_SECRET` | *(Generate a 32+ character random string)* |
| `USER_JWT_SECRET` | *(Generate a 32+ character random string)* |
| `CORS_ORIGINS` | `http://localhost:5173,https://your-app.vercel.app` *(update once frontend is deployed)* |
| `FRONTEND_URL` | `https://your-app.vercel.app` |
| `SMTP_EMAIL` | *(Optional: your Gmail address for user approvals)* |
| `SMTP_PASSWORD` | *(Optional: Gmail 16-character App Password)* |

6. Click **Deploy Web Service**.
7. Once deployed, copy your backend URL (e.g., `https://skillbridge-backend.onrender.com`).
   - Test it by opening `https://skillbridge-backend.onrender.com/health` and `https://skillbridge-backend.onrender.com/docs` in your browser.

---

## Step 3: Deploy Frontend to Vercel

1. Sign in to [Vercel](https://vercel.com).
2. Click **Add New...** -> **Project**.
3. Import your GitHub repository.
4. In the configuration screen:
   - **Root Directory**: Click **Edit** and choose `frontend`.
   - **Framework Preset**: `Vite` (auto-detected).
5. Open **Environment Variables** and add:

| Key | Value |
| :--- | :--- |
| `VITE_API_URL` | `https://skillbridge-backend.onrender.com` *(your Render URL from Step 2)* |

6. Click **Deploy**.
7. Vercel will build and launch your application, giving you a live URL like `https://skillbridge-ai.vercel.app`.

---

## Step 4: Link Frontend & Backend CORS

1. Go back to your **Render Dashboard** -> `skillbridge-backend` -> **Environment**.
2. Update `CORS_ORIGINS` to include your new Vercel domain:
   ```env
   CORS_ORIGINS=http://localhost:5173,https://skillbridge-ai.vercel.app
   FRONTEND_URL=https://skillbridge-ai.vercel.app
   ```
3. Click **Save Changes** (Render will automatically redeploy with the updated origins).

---

## Option B: Deploying via Docker / VPS

If you want to host both the frontend and backend together on a single server (like an AWS EC2, DigitalOcean Droplet, Linode, or Hetzner VPS):

1. Clone your repo onto the server:
   ```bash
   git clone <your-repo-url>
   cd skillBridge-AI-platform-main
   ```
2. Create `backend/.env` with your Supabase and JWT credentials:
   ```bash
   cp backend/.env.example backend/.env
   nano backend/.env
   ```
3. Start the entire application with Docker Compose:
   ```bash
   docker compose up -d --build
   ```
4. Access:
   - Frontend: `http://<your-server-ip>:5173`
   - Backend API: `http://<your-server-ip>:8000`
   - Swagger API Docs: `http://<your-server-ip>:8000/docs`

---

## ✅ Post-Deployment Verification

- [ ] **Backend Health Check**: Open `https://your-backend.onrender.com/health` — should return `{"status": "healthy"}`.
- [ ] **Swagger Documentation**: Open `https://your-backend.onrender.com/docs` — verify that all student, skill, and assessment endpoints are listed.
- [ ] **Frontend Login**: Register a test account or log in via your Vercel URL.
- [ ] **Admin Portal**: Log in with admin credentials to review user approvals.
- [ ] **Resume Intelligence**: Test uploading a PDF resume to verify parsing and fallback analysis.
