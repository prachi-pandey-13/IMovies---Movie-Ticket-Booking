require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/User");
const Movie = require("./models/Movie");
const Show = require("./models/Show");
const Booking = require("./models/Booking");

const movies = [
  { title: "Midnight Express Run", description: "A courier races across the city in one night to deliver a package that could change everything.", genre: ["Action", "Thriller"], language: "English", durationMins: 128, rating: 8.1, releaseDate: "2026-09-12" },
  { title: "Monsoon Letters", description: "Two strangers fall in love through letters left in a village post office during the rainy season.", genre: ["Romance", "Drama"], language: "Hindi", durationMins: 142, rating: 7.8, releaseDate: "2026-09-26" },
  { title: "Laugh Riot Academy", description: "A failing comedy school has one semester to put on a show that saves it from closing.", genre: ["Comedy"], language: "Hindi", durationMins: 118, rating: 7.2, releaseDate: "2026-10-03" },
  { title: "Beyond Orion", description: "A crew of astronauts discovers a signal coming from beyond the edge of the solar system.", genre: ["Sci-Fi", "Adventure"], language: "English", durationMins: 150, rating: 8.6, releaseDate: "2026-10-10" },
  { title: "The Last Lantern", description: "A retired lighthouse keeper guards a secret that a young journalist is determined to uncover.", genre: ["Mystery", "Drama"], language: "English", durationMins: 125, rating: 7.5, releaseDate: "2026-08-29" },
  { title: "Tiger Trail", description: "A family trip into a national park turns into an unforgettable wildlife adventure.", genre: ["Family", "Adventure"], language: "Hindi", durationMins: 112, rating: 7.0, releaseDate: "2026-10-01" },
];

const theatres = ["PVR Treasure Island", "INOX C21 Mall", "Cinepolis Malhar Mega"];
const slots = [10, 13, 16, 19, 22]; // show hours

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected, clearing old data...");
  await Promise.all([User.deleteMany(), Movie.deleteMany(), Show.deleteMany(), Booking.deleteMany()]);

  await User.create([
    { name: "Admin", email: "admin@imovies.com", password: "admin123", role: "admin" },
    { name: "Demo User", email: "user@imovies.com", password: "user123" },
  ]);

  const created = await Movie.insertMany(movies);

  const shows = [];
  for (const movie of created) {
    for (let day = 0; day < 4; day++) {
      // 2 theatres x 2 slots per day for each movie
      for (let t = 0; t < 2; t++) {
        for (let s = 0; s < 2; s++) {
          const start = new Date();
          start.setDate(start.getDate() + day);
          start.setHours(slots[(t * 2 + s + day) % slots.length], 0, 0, 0);
          if (start < new Date()) start.setDate(start.getDate() + 1);
          shows.push({
            movie: movie._id,
            theatre: theatres[(t + day) % theatres.length],
            screen: `Screen ${t + 1}`,
            startTime: start,
            price: 180 + t * 70,
          });
        }
      }
    }
  }
  await Show.insertMany(shows);

  console.log(`Seeded ${created.length} movies and ${shows.length} shows.`);
  console.log("Admin login: admin@imovies.com / admin123");
  console.log("User login:  user@imovies.com / user123");
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
