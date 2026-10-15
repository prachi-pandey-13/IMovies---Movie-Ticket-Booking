const express = require("express");
const Movie = require("../models/Movie");
const Show = require("../models/Show");
const { protect, adminOnly } = require("../middleware/auth");

const router = express.Router();

// GET /api/movies?search=&genre=
router.get("/", async (req, res, next) => {
  try {
    const { search, genre } = req.query;
    const filter = {};
    if (search) filter.title = { $regex: search, $options: "i" };
    if (genre) filter.genre = genre;
    const movies = await Movie.find(filter).sort({ releaseDate: -1 });
    res.json(movies);
  } catch (err) {
    next(err);
  }
});

// GET /api/movies/:id  (movie + its upcoming shows)
router.get("/:id", async (req, res, next) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) return res.status(404).json({ message: "Movie not found" });
    const shows = await Show.find({ movie: movie._id, startTime: { $gte: new Date() } })
      .sort({ startTime: 1 })
      .select("-bookedSeats");
    res.json({ movie, shows });
  } catch (err) {
    next(err);
  }
});

// Admin: create / update / delete
router.post("/", protect, adminOnly, async (req, res, next) => {
  try {
    res.status(201).json(await Movie.create(req.body));
  } catch (err) {
    next(err);
  }
});

router.put("/:id", protect, adminOnly, async (req, res, next) => {
  try {
    const movie = await Movie.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!movie) return res.status(404).json({ message: "Movie not found" });
    res.json(movie);
  } catch (err) {
    next(err);
  }
});

router.delete("/:id", protect, adminOnly, async (req, res, next) => {
  try {
    await Movie.findByIdAndDelete(req.params.id);
    await Show.deleteMany({ movie: req.params.id });
    res.json({ message: "Movie deleted" });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
