# Student Registration — React, Node.js and MongoDB

A full-stack student registration application demonstrating client-side validation, a Node.js/Express REST API, and persistent NoSQL storage using MongoDB.

## Project structure

- `src/` — React + Vite frontend
- `backend/` — Express API, Mongoose model and MongoDB CRUD routes

## Features

- Student registration form with client-side validation
- Create, read, update and delete student records
- MongoDB persistence through Mongoose
- Password hashing with bcrypt
- Duplicate email validation
- Student list retrieved from the API

## Run locally

### 1. Start MongoDB

Start your local MongoDB service, or use a MongoDB Atlas connection string.

### 2. Start the backend

```bash
cd backend
npm install
```

Copy `backend/.env.example` to `backend/.env` and configure `MONGODB_URI`. Then run:

```bash
npm run dev
```

### 3. Start the React frontend

Open a second terminal in the repository root:

```bash
npm install
npm run dev
```

For local development, the frontend uses `http://localhost:5000` as its default API URL.

## Deployment

- Frontend: Vercel
- Backend: Railway (service root directory: `/backend`)
- Database: MongoDB Atlas

See [backend/README.md](backend/README.md) for backend setup and deployment instructions. Configure `VITE_API_URL` in Vercel to the deployed Railway API URL and set `FRONTEND_URL` in Railway to the Vercel website URL.

## Security note

The API stores only a bcrypt password hash, never the plain-text password. Do not commit real database connection strings or `.env` files.
