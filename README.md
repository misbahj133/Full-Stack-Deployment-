# Fieldnotes — MERN Blog Platform

A full-stack blog platform where users can register, write, edit, and publish
short-form posts ("dispatches"), and readers can browse and search them.
Built with **MongoDB, Express, React (Vite), and Node.js**.

> **Live URL:** `https://your-deployed-frontend-url.example` — replace after you deploy (see below)
> **API URL:** `https://your-deployed-backend-url.example/api` — replace after you deploy

---

## Architecture overview

```
                     ┌───────────────────────┐
                     │        Browser          │
                     └───────────┬────────────┘
                                 │ HTTPS
                     ┌───────────▼────────────┐
                     │   Frontend (React/Vite)  │
                     │   Hosted on Vercel/      │
                     │   Netlify (static site)  │
                     └───────────┬────────────┘
                                 │ REST API calls (JSON, JWT in header)
                     ┌───────────▼────────────┐
                     │  Backend (Node/Express)  │
                     │  Hosted on Render/       │
                     │  Railway/Fly.io          │
                     └───────────┬────────────┘
                                 │ Mongoose (MongoDB driver)
                     ┌───────────▼────────────┐
                     │   MongoDB Atlas (cloud)  │
                     └───────────────────────┘
```

**Frontend** (`/frontend`) — React 18 + Vite, React Router for client-side
routing, `react-helmet-async` for per-page SEO tags, Axios for API calls.
Auth state lives in a React Context (`AuthContext`) backed by a JWT stored in
`localStorage`.

**Backend** (`/backend`) — Node.js + Express REST API. Mongoose models for
`User` and `Post`. JWT-based authentication (`middleware/auth.js`), password
hashing with bcrypt, request validation, centralized error handling,
rate-limiting on auth routes, `helmet` for security headers, and `compression`
for gzip responses.

**Database** — MongoDB (Atlas free tier is enough for this project). Two
collections: `users` and `posts`, with a text index on `posts` for search and
a unique slug per post.

### Data flow for the main features

- **Auth**: `POST /api/auth/register` and `/api/auth/login` return a JWT. The
  frontend stores it and attaches it as `Authorization: Bearer <token>` on
  every subsequent request via an Axios interceptor.
- **Reading posts**: `GET /api/posts` (paginated, searchable) and
  `GET /api/posts/:slug` are public — no auth required.
- **Writing posts**: `POST /api/posts`, `PUT /api/posts/:id`,
  `DELETE /api/posts/:id` all require a valid JWT and check that the
  requesting user is the post's author.

---

## Project structure

```
blogplatform/
├── backend/
│   ├── config/db.js            # MongoDB connection
│   ├── models/                 # User.js, Post.js
│   ├── middleware/              # auth.js, errorHandler.js
│   ├── controllers/             # authController.js, postController.js
│   ├── routes/                  # authRoutes.js, postRoutes.js
│   ├── server.js                 # app entry point
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── api/axios.js
│   │   ├── context/AuthContext.jsx
│   │   ├── components/          # Navbar, Footer, PostCard, SEO, ProtectedRoute
│   │   ├── pages/                # Home, PostDetail, Login, Register, CreatePost, EditPost, Dashboard, NotFound
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── public/                   # favicon.svg, robots.txt
│   ├── index.html                # SEO meta tags live here
│   ├── vercel.json / netlify.toml
│   ├── .env.example
│   └── package.json
└── README.md
```

---

## Local setup

### Prerequisites
- Node.js 18+
- A MongoDB connection string (local MongoDB or a free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster)

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env
# edit .env: set MONGO_URI, JWT_SECRET, CLIENT_ORIGIN
npm run dev
```

Backend runs at `http://localhost:5000`. Health check: `GET /api/health`.

### 2. Frontend

```bash
cd frontend
npm install
cp .env.example .env
# edit .env: set VITE_API_URL=http://localhost:5000/api
npm run dev
```

Frontend runs at `http://localhost:5173`.

---

## Deployment

### Backend → Render (or Railway / Fly.io)

1. Push this repo to GitHub.
2. On [Render](https://render.com), create a **New Web Service**, point it at
   the `backend/` folder (root directory: `backend`).
3. Build command: `npm install` · Start command: `npm start`.
4. Add environment variables in the Render dashboard:
   - `MONGO_URI` — your Atlas connection string
   - `JWT_SECRET` — a long random string
   - `JWT_EXPIRES_IN` — e.g. `7d`
   - `CLIENT_ORIGIN` — your deployed frontend URL (set this **after** step below, then redeploy)
   - `NODE_ENV=production`
5. Deploy. Note the resulting URL, e.g. `https://fieldnotes-api.onrender.com`.

A `render.yaml` is included in `/backend` if you prefer Render's Blueprint deploys.

### Frontend → Vercel (or Netlify)

1. On [Vercel](https://vercel.com), import the repo, set **root directory** to `frontend`.
2. Framework preset: Vite. Build command: `npm run build`. Output dir: `dist`.
3. Add environment variable:
   - `VITE_API_URL` = `https://fieldnotes-api.onrender.com/api` (your backend URL from above)
4. Deploy. Vercel gives you a URL like `https://fieldnotes.vercel.app`.
5. Go back to your backend's `CLIENT_ORIGIN` env var and set it to this
   frontend URL, then redeploy the backend so CORS allows it.

`vercel.json` (SPA rewrites + asset caching) and `netlify.toml` are both
included — use whichever host you pick.

### After deploying, update:
- The `<link rel="canonical">`, Open Graph, and Twitter meta tags in
  `frontend/index.html` with your real domain.
- `frontend/public/robots.txt` sitemap URL.
- The **Live URL** and **API URL** at the top of this README.

---

## Performance & Lighthouse

Optimizations already built in:
- Route-based code splitting (`React.lazy`) so each page ships its own JS chunk
- Vendor chunk splitting in `vite.config.js` for long-term browser caching
- Gzip compression both at build time (`vite-plugin-compression2`) and at
  runtime (`compression` middleware on the API)
- `loading="lazy"` + explicit `width`/`height` on all post images to prevent
  layout shift and defer offscreen image loads
- `font-display: swap` and `<link rel="preconnect">` for Google Fonts
- No render-blocking third-party scripts

**To audit your live deployment:**
1. Open the deployed frontend URL in Chrome.
2. DevTools → Lighthouse tab → run an audit (Mobile and Desktop, Performance + SEO + Accessibility + Best Practices).
3. Record the scores, fix flagged issues, and re-run.
4. Fill in your before/after scores below.

| Category | Before | After |
|---|---|---|
| Performance | — | — |
| Accessibility | — | — |
| Best Practices | — | — |
| SEO | — | — |

---

## SEO essentials included

- Unique `<title>` and meta description per route via `react-helmet-async` (see `src/components/SEO.jsx`)
- Open Graph + Twitter card tags in `index.html`
- Descriptive `alt` text required on every post cover image (enforced in the create-post form)
- Semantic HTML (`<article>`, `<time>`, `<nav>`, one `<h1>` per page)
- `robots.txt` and a canonical URL tag

---

## Testing on mobile and desktop after deployment

- Open the live URL on an actual phone (not just DevTools device emulation) and check: nav menu usability, form inputs (no zoom-jump on focus), image loading, touch target sizes.
- Test on desktop Chrome, Firefox, and Safari if available.
- Check the full auth flow end-to-end against the deployed backend: register → login → create a post → edit → delete → log out.
- Verify CORS works (no blocked requests in the browser console) between the deployed frontend and backend domains.

---

## Tech stack

- **Frontend:** React 18, Vite, React Router 6, react-helmet-async, Axios
- **Backend:** Node.js, Express, Mongoose, JWT, bcrypt, helmet, compression, express-rate-limit
- **Database:** MongoDB (Atlas)
- **Hosting:** Vercel/Netlify (frontend), Render/Railway (backend), MongoDB Atlas (database)
