import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { api } from "../api";

export default function SeatBooking() {
  const { showId } = useParams();
  const navigate = useNavigate();
  const [show, setShow] = useState(null);
  const [selected, setSelected] = useState([]);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const loadShow = useCallback(async () => {
    try {
      setShow(await api(`/shows/${showId}`));
    } catch (err) {
      setError(err.message);
    }
  }, [showId]);

  // Load once, then poll every 5s for real-time seat availability
  useEffect(() => {
    loadShow();
    const timer = setInterval(loadShow, 5000);
    return () => clearInterval(timer);
  }, [loadShow]);

  // Drop any selected seat that someone else just booked
  useEffect(() => {
    if (show) setSelected((sel) => sel.filter((s) => !show.bookedSeats.includes(s)));
  }, [show]);

  function toggle(seat) {
    if (show.bookedSeats.includes(seat)) return;
    setSelected((sel) =>
      sel.includes(seat) ? sel.filter((s) => s !== seat) : sel.length < 10 ? [...sel, seat] : sel
    );
  }

  async function confirm() {
    setBusy(true);
    setError("");
    try {
      await api("/bookings", { method: "POST", body: { showId, seats: selected } });
      navigate("/my-bookings", { state: { justBooked: true } });
    } catch (err) {
      setError(err.message);
      setSelected([]);
      loadShow();
    } finally {
      setBusy(false);
    }
  }

  if (!show) return error ? <div className="alert alert-danger">{error}</div> : <div className="text-center mt-5">Loading...</div>;

  const rowLetters = Array.from({ length: show.rows }, (_, i) => String.fromCharCode(65 + i));
  const cols = Array.from({ length: show.seatsPerRow }, (_, i) => i + 1);

  return (
    <>
      <Link to={`/movies/${show.movie._id}`} className="text-decoration-none">
        ← Back
      </Link>
      <h3 className="mt-2">{show.movie.title}</h3>
      <p className="text-muted">
        {show.theatre} · {show.screen} · {new Date(show.startTime).toLocaleString()} · ₹{show.price}/seat
      </p>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="screen-bar">SCREEN THIS WAY</div>
      <div className="seat-grid">
        {rowLetters.map((r) => (
          <div className="seat-row" key={r}>
            <span className="row-label">{r}</span>
            {cols.map((c) => {
              const seat = `${r}${c}`;
              const booked = show.bookedSeats.includes(seat);
              const isSel = selected.includes(seat);
              return (
                <button
                  key={seat}
                  type="button"
                  disabled={booked}
                  className={`seat ${booked ? "booked" : isSel ? "selected" : ""}`}
                  onClick={() => toggle(seat)}
                  title={seat}
                >
                  {c}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      <div className="d-flex gap-3 justify-content-center my-3 small">
        <span><span className="seat legend"></span> Available</span>
        <span><span className="seat legend selected"></span> Selected</span>
        <span><span className="seat legend booked"></span> Booked</span>
      </div>

      <div className="card shadow-sm">
        <div className="card-body d-flex flex-wrap justify-content-between align-items-center gap-2">
          <div>
            <div>
              Seats: <strong>{selected.length ? selected.join(", ") : "none selected"}</strong>
            </div>
            <div>
              Total: <strong>₹{selected.length * show.price}</strong>
            </div>
          </div>
          <button className="btn btn-danger" disabled={!selected.length || busy} onClick={confirm}>
            {busy ? "Booking..." : "Confirm booking"}
          </button>
        </div>
      </div>
    </>
  );
}
