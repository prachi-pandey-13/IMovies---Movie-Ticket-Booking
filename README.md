# 🎬 IMovies - Movie Ticket Booking

A full stack MERN application for browsing movies, selecting seats and booking tickets online.

🔗 **Live Demo:** [https://imovies-movie-ticket-booking-1.onrender.com](https://imovies-movie-ticket-booking-1.onrender.com)

> The app is hosted on Render's free tier, so the first load may take 30-60 seconds while the server wakes up.

---

## 1. Introduction

- **Project Title:** IMovies - Movie Ticket Booking
- **Team Members:** Prachi Pandey - Full Stack Developer (Frontend, Backend, Database, Deployment)

## 2. Project Overview

**Purpose:** IMovies lets users browse movies, check show details, select seats and book tickets online. The goal is to replace manual ticket counters with a simple, fast and secure online booking experience.

**Key Features:**

- User registration and login with secure authentication (JWT)
- "Now Showing" page with movie cards showing genre, rating, duration and language
- Search movies by name
- Movie details page with showtimes grouped by date, across multiple theatres (PVR, INOX, Cinepolis) with ticket prices
- Seat selection and ticket booking
- My Bookings page with booking status, theatre, screen, show time, seats and amount paid
- Cancel an existing booking
- Responsive design built with Bootstrap

## 3. Architecture

### Frontend (React.js)
- Single page application built with React.js
- Component-based structure with React Router for navigation
- Axios / Fetch for async API calls
- Styled with HTML, CSS and Bootstrap

### Backend (Node.js and Express.js)
- RESTful API built with Node.js and Express.js
- Routes for users, movies and bookings
- Middleware for JWT verification, CORS and error handling
- Async/await for all database and API operations

### Database (MongoDB)
MongoDB with Mongoose. Main collections:

| Collection | Fields |
|------------|--------|
| **Users** | name, email, password (hashed), role |
| **Movies** | title, description, genre, duration, language, poster, showtimes |
| **Bookings** | user, movie, show date and time, seats, total price, booking date |

## 4. Setup Instructions

### Prerequisites
- Node.js (v16 or higher) and npm
- MongoDB (local or MongoDB Atlas)
- Git

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/prachi-pandey-13/IMovies---Movie-Ticket-Booking.git

# 2. Move into the project folder
cd IMovies---Movie-Ticket-Booking

# 3. Install backend dependencies
cd server
npm install

# 4. Install frontend dependencies
cd ../client
npm install
```

Create a `.env` file inside the `server` folder:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

## 5. Folder Structure


```
client/                 # React frontend
├── public/
└── src/
    ├── components/     # Navbar, MovieCard, SeatSelector
    ├── pages/          # Home, Login, Register, Booking
    ├── App.js
    └── index.js

server/                 # Node.js backend
├── models/             # User, Movie, Booking schemas
├── routes/
├── controllers/
├── middleware/         # Auth and error handling
└── server.js
```

## 6. Running the Application

**Backend:**
```bash
cd server
npm start
```

**Frontend:**
```bash
cd client
npm start
```

Frontend runs on `http://localhost:3000` and backend on `http://localhost:5000`.

## 7. API Documentation


### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login and receive a JWT token |

**Example request (login):**
```json
{ "email": "user@example.com", "password": "123456" }
```
**Example response:**
```json
{ "token": "<jwt_token>", "user": { "name": "Prachi" } }
```

### Movies

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/movies` | Get all movies |
| GET | `/api/movies/:id` | Get a single movie |

### Bookings (requires JWT)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/bookings` | Book tickets |
| GET | `/api/bookings/my` | Get logged-in user's bookings |
| PUT / DELETE | `/api/bookings/:id` | Cancel a booking <!-- EDIT: use your actual method and route --> |

**Example request (book):**
```json
{ "movieId": "...", "showTime": "7:00 PM", "seats": ["A1", "A2"] }
```

## 8. Authentication

- Passwords are hashed with **bcrypt** before being stored in MongoDB.
- On login, the server issues a **JSON Web Token (JWT)** signed with a secret key.
- The client sends the token in the request header: `Authorization: Bearer <token>`
- A middleware verifies the token before allowing access to protected routes such as booking and booking history.
- Role-based access separates normal users from admins.

## 9. User Interface

### Now Showing (Home Page)
Browse all movies, search by name and click **Book** on any movie.

![Now Showing](screenshots/home.png)

### Movie Details and Showtimes
Pick a date, theatre and show time. Prices are shown on each showtime.

![Movie Details and Showtimes](screenshots/showtimes.png)

### My Bookings
View confirmed bookings with theatre, screen, seats and amount paid, and cancel a booking if needed.

![My Bookings](screenshots/my-bookings.png)

## 10. Testing

- Manual testing of all user flows: register, login, browse, book, view bookings
- API endpoints tested using Postman
- Browser DevTools used to debug frontend and network requests
- Tested on multiple screen sizes for responsiveness

## 11. Screenshots or Demo

- 🌐 **Live Demo:** [imovies-movie-ticket-booking-1.onrender.com](https://imovies-movie-ticket-booking-1.onrender.com)
- 💻 **GitHub Repo:** [prachi-pandey-13/IMovies---Movie-Ticket-Booking](https://github.com/prachi-pandey-13/IMovies---Movie-Ticket-Booking)

## 12. Known Issues

- First load on the deployed app can be slow due to free-tier hosting.
- No real payment gateway; payment is simulated. <!-- EDIT: adjust if different -->
- <!-- EDIT: add any other known bugs -->

## 13. Future Enhancements

- Integrate a real payment gateway (Razorpay / Stripe)
- Email or SMS ticket confirmation with QR code
- Real-time seat locking to prevent double booking
- Movie reviews and ratings
- Cinema and city selection
- Automatic refund handling when a booking is cancelled
- Admin analytics dashboard

---

👩‍💻 **Author:** [Prachi Pandey](https://github.com/prachi-pandey-13)
