# HackerNews Scraper - MERN Stack App

A full-stack MERN application that scrapes the top 10 stories from [Hacker News](https://news.ycombinator.com), stores them in MongoDB, and provides a clean React frontend with JWT authentication, bookmarking, and pagination.

---

## Features

- **Web Scraper** - Auto-scrapes HN top 10 stories on server start; manually triggerable via API
- **JWT Auth** - Register & Login with secure token-based authentication
- **Stories API** - Sorted by points, paginated, with single-story fetch
- **Bookmarks** - Toggle bookmarks per user (auth-protected)
- **React Frontend** - Minimal white/grey/black UI with Tailwind CSS

---

## Tech Stack

| Layer | Tech |
|---|---|
| Frontend | React + Vite + Tailwind CSS |
| Backend | Node.js + Express.js |
| Database | MongoDB + Mongoose |
| Auth | JWT + bcryptjs |
| Scraping | Axios + Cheerio |

---

## Project Structure

```
scraper/
├── backend/         # Express API server
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── scraper/
│   └── server.js
└── frontend/        # React + Vite app
    └── src/
        ├── components/
        ├── context/
        ├── pages/
        └── api/
```

---

## Environment Variables

Create a `.env` file inside the `backend/` directory:

```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/hn_scraper?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_here
```

---

## Setup & Run Locally

### Prerequisites
- Node.js >= 18
- MongoDB Atlas account (or local MongoDB)

### 1. Clone the repo
```bash
git clone <your-repo-url>
cd scraper
```

### 2. Backend setup
```bash
cd backend
npm install
# Create your .env file (see above)
npm run dev
```

### 3. Frontend setup
```bash
cd frontend
npm install
npm run dev
```

Frontend: http://localhost:5173  
Backend API: http://localhost:5000

---

## API Reference

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | No | Register a new user |
| POST | `/api/auth/login` | No | Login and get JWT token |
| GET | `/api/stories` | No | Get all stories (sorted by points, paginated) |
| GET | `/api/stories/:id` | No | Get a single story |
| POST | `/api/stories/:id/bookmark` | Yes | Toggle bookmark |
| POST | `/api/scrape` | No | Manually trigger scraper |

### Pagination
```
GET /api/stories?page=1&limit=10
```

---

## Deployment

- **Live Demo (Frontend):** [https://scraper-phi-azure.vercel.app/](https://scraper-phi-azure.vercel.app/)
- **Backend API (Render):** [https://scraper-zxa4.onrender.com](https://scraper-zxa4.onrender.com)
