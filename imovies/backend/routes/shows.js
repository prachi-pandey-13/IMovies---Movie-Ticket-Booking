const express = require("express");
const Show = require("../models/Show");
const { protect, adminOnly } = require("../middleware/auth");

const router = express.Router();

// GET /api/shows/:id  - show details with live seat availability
router.get("/:id", async (req, res, next) => {
  try {
    const show = await Show.findById(req.params.id).populate("movie", "title posterUrl durationMins");
    if (!show) return res.status(404).json({ message: "Show not found" });
    res.json(show);
  } catch (err) {
    next(err);
  }
});

// POST /api/shows  (admin)
router.post("/", protect, adminOnly, async (req, res, next) => {
  try {
    res.status(201).json(await Show.create(req.body));
  } catch (err) {
    next(err);
  }
});

module.exports = router;
