import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { api } from "../api";

export default function MyBookings() {
  const [bookings, setBookings] = useState(null);
  const [error, setError] = useState("");
  const location = useLocation();

  async function load() {
    try {
      setBookings(await api("/bookings/mine"));
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function cancel(id) {
    if (!window.confirm("Cancel this booking?")) return;
    try {
      await api(`/bookings/${id}/cancel`, { method: "PATCH" });
      load();
    } catch (err) {
      setError(err.message);
    }
  }

  if (!bookings) return error ? <div className="alert alert-danger">{error}</div> : <div className="text-center mt-5">Loading...</div>;

  return (
    <>
      <h2 className="mb-3">My Bookings</h2>
      {location.state?.justBooked && <div className="alert alert-success">Booking confirmed! 🎉</div>}
      {error && <div className="alert alert-danger">{error}</div>}
      {bookings.length === 0 && <p className="text-muted">You have no bookings yet.</p>}
      <div className="row g-3">
        {bookings.map((b) => (
          <div className="col-12 col-md-6" key={b._id}>
            <div className="card shadow-sm h-100">
              <div className="card-body">
                <div className="d-flex justify-content-between">
                  <h5>{b.show?.movie?.title || "Movie"}</h5>
                  <span className={`badge ${b.status === "confirmed" ? "bg-success" : "bg-secondary"}`}>
                    {b.status}
                  </span>
                </div>
                <p className="mb-1 text-muted">
                  {b.show?.theatre} · {b.show?.screen}
                </p>
                <p className="mb-1">{b.show && new Date(b.show.startTime).toLocaleString()}</p>
                <p className="mb-1">
                  Seats: <strong>{b.seats.join(", ")}</strong>
                </p>
                <p className="mb-2">
                  Paid: <strong>₹{b.totalAmount}</strong>
                </p>
                {b.status === "confirmed" && (
                  <button className="btn btn-outline-danger btn-sm" onClick={() => cancel(b._id)}>
                    Cancel booking
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
