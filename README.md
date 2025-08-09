# Task Manager (MERN + JWT)

A clean, job-ready Task Manager built with **React**, **Node/Express**, **MongoDB (Mongoose)** and **JWT auth**.  
Live demo + API deployed on free tiers: **Netlify** (frontend) and **Render** (backend).

## ✨ Features

- Email/password auth (register/login with JWT stored in localStorage)
- Create / Read / Update / Delete tasks
- **Priority** (Low/Medium/High) and **Due date**
- Search + filters (by priority and status)
- **Sorting:** by due date, priority, title, or newest
- Colored priority badges, overdue highlighting
- Loading states, toasts, and disabled buttons during requests

## 🖥 Live

- Frontend: `https://<your-netlify-site>.netlify.app`
- API health: `https://task-manager-app-apez.onrender.com/` (should say “Task Manager API is running”)

## 🧱 Tech Stack

- **Frontend:** React (CRA), Axios, Tailwind classes
- **Backend:** Node.js, Express, JWT, bcrypt
- **Database:** MongoDB Atlas (Mongoose)
- **Deployment:** Netlify (SPA + redirects), Render (Web Service)

## 🚀 Quickstart (Local)

```bash
# 1) Backend
cd server
cp .env.example .env   # create and fill MONGO_URI, JWT_SECRET
npm install
node index.js          # starts on port 5050 by default

# 2) Frontend
cd ../client
npm install
npm start              # http://localhost:3000 (proxy to 5050)
