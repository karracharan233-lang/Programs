# Habit Tracking Application (MERN Stack)

A beginner-friendly college project based on the supplied PPT. It supports creating, viewing, updating completion status, and deleting habits. Habit data is stored in MongoDB.

## Requirements
- Node.js and npm
- MongoDB running locally, or a MongoDB Atlas connection string

## Run the backend
1. Open a terminal in `backend`.
2. Run `npm install`.
3. Copy `.env.example` to `.env` and adjust `MONGODB_URI` if needed.
4. Run `npm run dev` (or `npm start`).

The API runs at http://localhost:5000.

## Run the frontend
1. Open another terminal in `frontend`.
2. Run `npm install`.
3. Run `npm run dev`.
4. Open the local URL printed by Vite (usually http://localhost:5173).

## API endpoints
- `GET /api/habits?date=YYYY-MM-DD` — list habits for a date
- `POST /api/habits` — create `{ "habitName": "Read 20 pages", "date": "YYYY-MM-DD", "target": "20 pages" }`
- `PUT /api/habits/:id` — update fields such as `{ "completed": true }`
- `DELETE /api/habits/:id` — delete a habit

## Notes
- This demo uses `demo-user` as the default user ID. Real login/authentication and role-based access are not implemented.
- Streak and historical analytics are not implemented in this starter version.
- The visual dashboard is a proposed interface inspired by the PPT; it is not an actual screenshot from a completed app.
