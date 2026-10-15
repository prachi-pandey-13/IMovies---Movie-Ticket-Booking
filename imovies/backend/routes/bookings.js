const express = require("express");
const Show = require("../models/Show");
const Booking = require("../models/Booking");
const { protect } = require("../middleware/auth");

const router = express.Router();

function isValidSeat(seat, show) {
  const m = /^([A-Z])(\d{1,2})$/.exec(seat);
  if (!m) return false;
  const row = m[1].charCodeAt(0) - 65;
  const num = parseInt(m[2], 10);
  return row >= 0 && row < show.rows && num >= 1 && num <= show.seatsPerRow;
}

// POST /api/bookings  { showId, seats: ["A1","A2"] }
router.post("/", protect, async (req, res, next) => {
  try {
    const { showId, seats } = req.body;
    if (!showId || !Array.isArray(seats) || seats.length === 0)
      return res.status(400).json({ message: "showId and at least one seat are required" });
    if (seats.length > 10)
      return res.status(400).json({ message: "You can book at most 10 seats at once" });

    const uniqueSeats = [...new Set(seats)];
    const show = await Show.findById(showId);
    if (!show) return res.status(404).json({ message: "Show not found" });
    if (show.startTime < new Date())
      return res.status(400).json({ message: "This show has already started" });
    if (!uniqueSeats.every((s) => isValidSeat(s, show)))
      return res.status(400).json({ message: "Invalid seat selection" });

    // Atomic update: only succeeds if NONE of the seats are already booked.
    // This prevents double booking even when two users click at the same time.
    const updated = await Show.findOneAndUpdate(
      { _id: showId, bookedSeats: { $nin: uniqueSeats } },
      { $push: { bookedSeats: { $each: uniqueSeats } } },
      { new: true }
    );
    if (!updated)
      return res.status(409).json({ message: "Some selected seats were just booked. Please pick again." });

    const booking = await Booking.create({
      user: req.user._id,
      show: show._id,
      seats: uniqueSeats,
      totalAmount: show.price * uniqueSeats.length,
    });

    res.status(201).json(booking);
  } catch (err) {
    next(err);
  }
});

// GET /api/bookings/mine
router.get("/mine", protect, async (req, res, next) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .populate({
        path: "show",
        select: "theatre screen startTime movie",
        populate: { path: "movie", select: "title posterUrl" },
      });
    res.json(bookings);
  } catch (err) {
    next(err);
  }
});

// PATCH /api/bookings/:id/cancel
router.patch("/:id/cancel", protect, async (req, res, next) => {
  try {
    const booking = await Booking.findOne({ _id: req.params.id, user: req.user._id });
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    if (booking.status === "cancelled")
      return res.status(400).json({ message: "Booking already cancelled" });

    const show = await Show.findById(booking.show);
    if (show && show.startTime < new Date())
      return res.status(400).json({ message: "Cannot cancel after the show has started" });

    await Show.updateOne({ _id: booking.show }, { $pull: { bookedSeats: { $in: booking.seats } } });
    booking.status = "cancelled";
    await booking.save();
    res.json(booking);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
