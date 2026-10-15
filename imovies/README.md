# IMovies – Movie Ticket Booking (MERN Stack)

A full-stack movie ticket booking platform: browse movies, pick a showtime, select seats on a live seat map, and manage your bookings.

## Tech stack (matches the SkillWallet "Skills Required")

| Skill | Where it is used |
|---|---|
| HTML | `frontend/index.html`, JSX markup |
| CSS | `frontend/src/styles.css` (seat map, cards) |
| JavaScript | Whole project |
| React.js | `frontend/src` (pages, components, context, router) |
| Node.js | Runtime for the backend |
| Express.js | `backend/server.js`, `backend/routes/*` |
| MongoDB (+ Mongoose) | `backend/models/*` |
| Asynchronous JavaScript | async/await in routes, `api.js`, React effects, polling |
| JWT | `backend/routes/auth.js`, `backend/middleware/auth.js`, `AuthContext.jsx` |
| Bootstrap | Layout, navbar, forms, cards, grid |

## Features
- Register / login with JWT, passwords hashed with bcrypt
- Protected routes (booking, my bookings) on both backend and frontend
- Movie list with search, movie details, showtimes grouped by day
- Seat map with live availability (polls every 5 seconds)
- **Double-booking prevention**: seats are reserved with one atomic MongoDB update
- Booking history and cancellation (seats are released)
- Admin-only APIs to add/edit/delete movies and shows

## Folder structure
```
imovies/
├── backend/
│   ├── server.js
│   ├── seed.js
│   ├── .env.example
│   ├── models/        User, Movie, Show, Booking
│   ├── middleware/    auth.js (JWT protect + adminOnly)
│   └── routes/        auth, movies, shows, bookings
└── frontend/
    ├── index.html
    ├── vite.config.js (proxies /api to port 5000)
    └── src/
        ├── main.jsx, App.jsx, api.js, styles.css
        ├── context/AuthContext.jsx
        ├── components/  Navbar, ProtectedRoute
        └── pages/       Home, MovieDetail, SeatBooking, MyBookings, Login, Register
```

## Setup

### 1. Install the prerequisites
Node.js v16+ and npm, MongoDB (local Community Server or a free MongoDB Atlas cluster), VS Code, Postman.

### 2. Backend
```bash
cd backend
npm install
cp .env.example .env      # on Windows: copy .env.example .env
```
Edit `.env` and set `MONGO_URI` (local default works if MongoDB is running; for Atlas paste your connection string) and a strong `JWT_SECRET`.

```bash
npm run seed              # adds demo movies, shows and users
npm run dev               # API on http://localhost:5000
```

### 3. Frontend (new terminal)
```bash
cd frontend
npm install
npm run dev               # App on http://localhost:5173
```

### Demo logins (from the seed script)
- User: `user@imovies.com` / `user123`
- Admin: `admin@imovies.com` / `admin123`

## API reference

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | /api/auth/register | – | Create account |
| POST | /api/auth/login | – | Login, returns JWT |
| GET | /api/auth/me | JWT | Current user |
| GET | /api/movies?search= | – | List movies |
| GET | /api/movies/:id | – | Movie + upcoming shows |
| POST/PUT/DELETE | /api/movies(/:id) | Admin | Manage movies |
| GET | /api/shows/:id | – | Show + booked seats |
| POST | /api/shows | Admin | Create show |
| POST | /api/bookings | JWT | Book seats `{ showId, seats }` |
| GET | /api/bookings/mine | JWT | My bookings |
| PATCH | /api/bookings/:id/cancel | JWT | Cancel booking |

Test these in Postman: login first, then send `Authorization: Bearer <token>` on protected routes.

## Submit to SkillWallet
1. Push the project to GitHub (`git init`, `git add .`, `git commit`, create repo, `git push`). Add a `.gitignore` containing `node_modules` and `.env`.
2. Deploy (optional but recommended): backend on Render, frontend on Vercel/Netlify, database on MongoDB Atlas. For production set the frontend API base URL (in `api.js`) to your deployed backend URL and `CLIENT_URL` in the backend env.
3. In SkillWallet click **Add Demo Link** and **Add Github Link** on the project page.

## Ideas to extend
Payment integration (Razorpay test mode), email confirmations, admin dashboard UI, seat locking with expiry, movie posters via image URLs.
