import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api";

export default function Home() {
  const [movies, setMovies] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Re-fetch (debounced) whenever the search text changes
  useEffect(() => {
    const t = setTimeout(async () => {
      setLoading(true);
      setError("");
      try {
        const q = search ? `?search=${encodeURIComponent(search)}` : "";
        setMovies(await api(`/movies${q}`));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }, 300);
    return () => clearTimeout(t);
  }, [search]);

  return (
    <>
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-2">
        <h2 className="m-0">Now Showing</h2>
        <input
          className="form-control w-auto"
          style={{ minWidth: 240 }}
          placeholder="Search movies..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {error && <div className="alert alert-danger">{error}</div>}
      {loading ? (
        <div className="text-center mt-5">Loading movies...</div>
      ) : movies.length === 0 ? (
        <p className="text-muted">No movies found.</p>
      ) : (
        <div className="row g-4">
          {movies.map((m) => (
            <div className="col-12 col-sm-6 col-lg-4" key={m._id}>
              <div className="card h-100 shadow-sm movie-card">
                <div className="poster">{m.title.charAt(0)}</div>
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{m.title}</h5>
                  <div className="mb-2">
                    {m.genre.map((g) => (
                      <span key={g} className="badge bg-secondary me-1">
                        {g}
                      </span>
                    ))}
                  </div>
                  <p className="card-text text-muted small flex-grow-1">{m.description}</p>
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="small">
                      ⭐ {m.rating} · {m.durationMins} min · {m.language}
                    </span>
                    <Link to={`/movies/${m._id}`} className="btn btn-danger btn-sm">
                      Book
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
