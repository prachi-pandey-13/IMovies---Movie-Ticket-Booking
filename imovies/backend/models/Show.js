const mongoose = require("mongoose");

// A "show" is one screening of a movie at a given time. It tracks seat availability.
const showSchema = new mongoose.Schema(
  {
    movie: { type: mongoose.Schema.Types.ObjectId, ref: "Movie", required: true },
    theatre: { type: String, required: true },
    screen: { type: String, default: "Screen 1" },
    startTime: { type: Date, required: true },
    price: { type: Number, required: true },
    rows: { type: Number, default: 8 },
    seatsPerRow: { type: Number, default: 10 },
    bookedSeats: [{ type: String }], // e.g. "A1", "C7"
  },
  { timestamps: true }
);

module.exports = mongoose.model("Show", showSchema);
