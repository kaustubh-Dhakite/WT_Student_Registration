# Student Registration API

Node.js, Express and MongoDB backend for the React Student Registration application.

## Local setup

1. Install Node.js (LTS).
2. Open a terminal in this `backend` folder.
3. Install dependencies:

   ```bash
   npm install
   ```

4. Copy `.env.example` to `.env`.
5. Set `MONGODB_URI` to your MongoDB connection string. For a local MongoDB server:

   ```env
   MONGODB_URI=mongodb://127.0.0.1:27017/student_registration
   FRONTEND_URL=http://localhost:5173
   ```

6. Start the API:

   ```bash
   npm run dev
   ```

The API runs at http://localhost:5000.

## API routes

- `GET /api/students` — list students (password hashes are never returned)
- `POST /api/students` — register a student
- `PUT /api/students/:id` — update student details
- `DELETE /api/students/:id` — delete a student

Passwords are hashed with bcrypt before they are stored.

## Railway deployment

Deploy this repository to Railway and set the service Root Directory to `/backend`. Add these environment variables in Railway:

- `MONGODB_URI` — MongoDB Atlas connection string
- `FRONTEND_URL` — deployed Vercel frontend URL
- `NODE_ENV` — `production`

Railway supplies the `PORT` variable automatically. The start command is `npm start`.

After deployment, set `VITE_API_URL` in the Vercel project's Environment Variables to the Railway service's public URL, then redeploy the frontend.
