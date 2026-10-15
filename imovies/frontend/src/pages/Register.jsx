import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      await register(form.name, form.email, form.password);
      navigate("/", { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  return (
    <div className="row justify-content-center">
      <div className="col-12 col-md-6 col-lg-4">
        <div className="card shadow-sm">
          <div className="card-body">
            <h3 className="mb-3">Create account</h3>
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={submit}>
              <div className="mb-3">
                <label className="form-label">Name</label>
                <input className="form-control" required value={form.name} onChange={set("name")} />
              </div>
              <div className="mb-3">
                <label className="form-label">Email</label>
                <input type="email" className="form-control" required value={form.email} onChange={set("email")} />
              </div>
              <div className="mb-3">
                <label className="form-label">Password (min 6 chars)</label>
                <input
                  type="password"
                  className="form-control"
                  required
                  minLength={6}
                  value={form.password}
                  onChange={set("password")}
                />
              </div>
              <button className="btn btn-danger w-100" disabled={busy}>
                {busy ? "Creating..." : "Sign up"}
              </button>
            </form>
            <p className="mt-3 mb-0 small">
              Already have an account? <Link to="/login">Login</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
