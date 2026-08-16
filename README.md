# Fieldnotes - Full-Stack MERN Blogging Platform

👉 [Live Web Application Link](https://railway.app)

## 🏗️ Architecture Overview
This application is designed as a decoupled, full-stack microservices architecture hosted on cloud servers:
- **Frontend Client (`/frontend`):** Built with React, Vite, and optimized with Gzip asset compilation.
- **Backend API Server (`/backend`):** Node.js and Express REST API featuring custom CORS security policies, helmet encryption, and server-side request compression layers.
- **Database Engine:** Managed cloud clustering layer running via MongoDB Atlas.

## 🚀 Local Installation & Setup Instructions

### 1. Configure the Backend Server
```bash
cd backend
npm install
```
Create a `.env` file inside `/backend` and configure your credentials:
```env
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
CLIENT_ORIGIN=http://localhost:5173
```
Start the local server engine: `npm start`

### 2. Configure the Frontend Client
```bash
cd ../frontend
npm install
```
Create a `.env` file inside `/frontend`:
```env
VITE_API_URL=http://localhost:5000/api
```
Start the client server build: `npm run dev`
