import { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE = "http://localhost:5000/api";

export default function LoginPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPass, setShowPass] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.email.trim() || !form.password.trim()) {
      setError("Please fill in all fields.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/admin/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.msg || "Login failed.");
      } else {
        localStorage.setItem("token", data.token);

        
        navigate("/admin");
      }
    } catch (error) {
      setError("Could not reach the server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        body {
          font-family: 'DM Sans', sans-serif;
          background: #f5f4f0;
          min-height: 100vh;
        }

        .al-page {
          min-height: 100vh;
          display: grid;
          grid-template-columns: 1fr 1fr;
        }

        /* ── LEFT PANEL ── */
        .al-left {
          background: #1a3a5c;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 2.5rem;
          position: relative;
          overflow: hidden;
        }

        .al-left::before {
          content: '';
          position: absolute;
          inset: 0;
          background:
            radial-gradient(circle at 20% 80%, rgba(232,93,47,0.18) 0%, transparent 55%),
            radial-gradient(circle at 80% 20%, rgba(255,255,255,0.06) 0%, transparent 50%);
          pointer-events: none;
        }

        .al-brand {
          display: flex;
          align-items: center;
          gap: 10px;
          position: relative;
          z-index: 1;
        }

        .al-brand-icon {
          width: 36px;
          height: 36px;
          background: rgba(255,255,255,0.15);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(255,255,255,0.2);
        }

        .al-brand-text {
          font-family: 'DM Serif Display', serif;
          font-size: 18px;
          color: #fff;
          letter-spacing: -0.3px;
        }

        .al-brand-text em { font-style: italic; color: #e85d2f; }

        .al-copy {
          position: relative;
          z-index: 1;
        }

        .al-copy h2 {
          font-family: 'DM Serif Display', serif;
          font-size: 36px;
          font-weight: 400;
          color: #fff;
          line-height: 1.2;
          margin-bottom: 1rem;
          letter-spacing: -0.8px;
        }

        .al-copy h2 em { font-style: italic; color: #e85d2f; }

        .al-copy p {
          font-size: 14px;
          color: rgba(255,255,255,0.6);
          line-height: 1.7;
          max-width: 320px;
        }

        .al-features {
          position: relative;
          z-index: 1;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .al-feat {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 13px;
          color: rgba(255,255,255,0.7);
        }

        .al-feat-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #e85d2f;
          flex-shrink: 0;
        }

        /* ── RIGHT PANEL ── */
        .al-right {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
        }

        .al-card {
          width: 100%;
          max-width: 380px;
        }

        .al-card-header {
          margin-bottom: 2rem;
        }

        .al-card-header h1 {
          font-family: 'DM Serif Display', serif;
          font-size: 28px;
          font-weight: 400;
          color: #1a1a1a;
          letter-spacing: -0.5px;
          margin-bottom: 6px;
        }

        .al-card-header p {
          font-size: 13.5px;
          color: #888;
        }

        .al-form { display: flex; flex-direction: column; gap: 1rem; }

        .al-field { display: flex; flex-direction: column; gap: 6px; }

        .al-label {
          font-size: 12px;
          font-weight: 500;
          color: #555;
          letter-spacing: 0.3px;
          text-transform: uppercase;
        }

        .al-input-wrap {
          position: relative;
        }

        .al-input {
          width: 100%;
          padding: 11px 14px;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          color: #1a1a1a;
          background: #fff;
          border: 1.5px solid #e2e0d8;
          border-radius: 10px;
          outline: none;
          transition: border-color 0.15s, box-shadow 0.15s;
        }

        .al-input:focus {
          border-color: #1a3a5c;
          box-shadow: 0 0 0 3px rgba(26,58,92,0.09);
        }

        .al-input.has-toggle { padding-right: 42px; }

        .al-toggle {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          cursor: pointer;
          color: #aaa;
          padding: 2px;
          display: flex;
          align-items: center;
          transition: color 0.15s;
        }

        .al-toggle:hover { color: #1a3a5c; }

        .al-error {
          background: #fef2f2;
          border: 1px solid #fecaca;
          color: #b91c1c;
          font-size: 13px;
          padding: 10px 14px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          gap: 7px;
        }

        .al-btn {
          width: 100%;
          padding: 12px;
          background: #1a3a5c;
          color: #fff;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          font-weight: 500;
          border: none;
          border-radius: 10px;
          cursor: pointer;
          transition: background 0.15s, transform 0.1s;
          margin-top: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          min-height: 44px;
        }

        .al-btn:hover:not(:disabled) { background: #253f5e; }
        .al-btn:active:not(:disabled) { transform: scale(0.98); }
        .al-btn:disabled { opacity: 0.6; cursor: not-allowed; }

        .al-spinner {
          width: 16px; height: 16px;
          border: 2px solid rgba(255,255,255,0.35);
          border-top-color: #fff;
          border-radius: 50%;
          animation: al-spin 0.7s linear infinite;
        }

        @keyframes al-spin { to { transform: rotate(360deg); } }

        .al-divider {
          display: flex;
          align-items: center;
          gap: 10px;
          margin: 0.25rem 0;
          color: #ccc;
          font-size: 12px;
        }

        .al-divider::before, .al-divider::after {
          content: '';
          flex: 1;
          height: 1px;
          background: #e8e6e0;
        }

        .al-footer {
          text-align: center;
          font-size: 13px;
          color: #888;
          margin-top: 1.25rem;
        }

        .al-link {
          color: #e85d2f;
          font-weight: 500;
          text-decoration: none;
          background: none;
          border: none;
          cursor: pointer;
          font-family: inherit;
          font-size: inherit;
          padding: 0;
        }

        .al-link:hover { text-decoration: underline; }

        @media (max-width: 700px) {
          .al-page { grid-template-columns: 1fr; }
          .al-left { display: none; }
          .al-right { padding: 2rem 1.25rem; align-items: flex-start; padding-top: 3rem; }
        }
      `}</style>

      <div className="al-page">
        {/* LEFT */}
        <div className="al-left">
          <div className="al-brand">
            <div className="al-brand-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
              </svg>
            </div>

            <span className="al-brand-text">
              College <em>Chatbot</em>
            </span>
          </div>

          <div className="al-copy">
            <h2>
              Manage your
              <br />
              <em>knowledge base</em>
            </h2>

            <p>
              Update FAQs, review conversations, and keep your admissions chatbot
              accurate and helpful.
            </p>
          </div>

          <div className="al-features">
            {[
              "Add & edit FAQ entries",
              "Monitor chat activity",
              "Keep info up to date",
            ].map((f) => (
              <div className="al-feat" key={f}>
                <div className="al-feat-dot" />
                {f}
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT */}
        <div className="al-right">
          <div className="al-card">
            <div className="al-card-header">
              <h1>Admin Login</h1>
              <p>Sign in to manage the chatbot.</p>
            </div>

            <form className="al-form" onSubmit={handleSubmit} noValidate>
              {error && (
                <div className="al-error">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                  </svg>
                  {error}
                </div>
              )}

              <div className="al-field">
                <label className="al-label" htmlFor="email">Email</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  className="al-input"
                  placeholder="admin@college.edu"
                  value={form.email}
                  onChange={handleChange}
                  disabled={loading}
                  autoComplete="email"
                />
              </div>

              <div className="al-field">
                <label className="al-label" htmlFor="password">Password</label>

                <div className="al-input-wrap">
                  <input
                    id="password"
                    name="password"
                    type={showPass ? "text" : "password"}
                    className="al-input has-toggle"
                    placeholder="••••••••"
                    value={form.password}
                    onChange={handleChange}
                    disabled={loading}
                    autoComplete="current-password"
                  />

                  <button
                    type="button"
                    className="al-toggle"
                    onClick={() => setShowPass((v) => !v)}
                    tabIndex={-1}
                  >
                    {showPass ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              <button className="al-btn" type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <div className="al-spinner" />
                    Signing in…
                  </>
                ) : (
                  "Sign In"
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}