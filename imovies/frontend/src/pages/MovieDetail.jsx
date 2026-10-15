import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api } from "../api";

const dayKey = (d) => new Date(d).toDateString();

export default function MovieDetail() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        setData(await api(`/movies/${id}`));
      } catch (err) {
        setError(err.message);
      }
    })();
  }, [id]);

  if (error) return <div className="alert alert-danger">{error}</div>;
  if (!data) return <div className="text-center mt-5">Loading...</div>;

  const { movie, shows } = data;

  // Group shows by day
  const byDay = shows.reduce((acc, s) => {
    (acc[dayKey(s.startTime)] ||= []).push(s);
    return acc;
  }, {});

  return (
    <>
      <Link to="/" className="text-decoration-none">
        ← Back to movies
      </Link>
      <div className="card shadow-sm my-3">
        <div className="card-body">
          <h2>{movie.title}</h2>
          <div className="mb-2">
            {movie.genre.map((g) => (
              <span key={g} className="badge bg-secondary me-1">
                {g}
              </span>
            ))}
          </div>
          <p>{movie.description}</p>
          <p className="text-muted mb-0">
            ⭐ {movie.rating} · {movie.durationMins} min · {movie.language}
          </p>
        </div>
      </div>

      <h4 className="mt-4">Select a showtime</h4>
      {shows.length === 0 && <p className="text-muted">No upcoming shows.</p>}
      {Object.entries(byDay).map(([day, list]) => (
        <div key={day} className="mb-3">
          <h6 className="text-muted">{day}</h6>
          <div className="d-flex flex-wrap gap-2">
            {list.map((s) => (
              <Link key={s._id} to={`/book/${s._id}`} className="btn btn-outline-danger text-start">
                <div className="fw-bold">
                  {new Date(s.startTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </div>
                <div className="small">
                  {s.theatre} · ₹{s.price}
                </div>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </>
  );
}
