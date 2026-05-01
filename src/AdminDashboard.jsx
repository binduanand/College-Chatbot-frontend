import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE = "http://localhost:5000/api";

const EMPTY_FORM = {
  question: "",
  answer: "",
  category: "",
};

export default function AdminDashboard() {
  const navigate = useNavigate();
  const modalRef = useRef(null);

  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState("");
  const [toast, setToast] = useState(null);

  const [modal, setModal] = useState(null);
  const [activeId, setActiveId] = useState(null);

  const [form, setForm] = useState(EMPTY_FORM);
  const [search, setSearch] = useState("");

  const token = localStorage.getItem("token");

  // Logout
  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  // Auth Guard
  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  // Toast
  const showToast = (msg, type = "success") => {
    setToast({ msg, type });

    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  // Fetch FAQs
  const fetchFAQs = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API_BASE}/admin/faqs`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 401) {
        logout();
        return;
      }

      const data = await res.json();
      setFaqs(Array.isArray(data) ? data : []);
    } catch {
      setError("Failed to load FAQs.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchFAQs();
    }
  }, [token]);

  // Search Filter
  const filtered = faqs.filter((faq) => {
    const q = search.toLowerCase();

    return (
      !q ||
      faq.question.toLowerCase().includes(q) ||
      faq.answer.toLowerCase().includes(q)
    );
  });

  // Modal Helpers
  const openAdd = () => {
    setForm(EMPTY_FORM);
    setActiveId(null);
    setModal("add");
  };

  const openEdit = (faq) => {
    setForm({
      question: faq.question,
      answer: faq.answer,
      category: faq.category || "",
    });

    setActiveId(faq._id);
    setModal("edit");
  };

  const openDelete = (faq) => {
    setActiveId(faq._id);
    setModal("delete");
  };

  const closeModal = () => {
    setModal(null);
    setForm(EMPTY_FORM);
    setActiveId(null);
  };

  const handleBackdrop = (e) => {
    if (e.target === modalRef.current) {
      closeModal();
    }
  };

  // Save FAQ
  const handleSave = async () => {
    if (!form.question.trim() || !form.answer.trim()) {
      showToast("Question and answer required.", "error");
      return;
    }

    setSaving(true);

    try {
      const isEdit = modal === "edit";

      const url = isEdit
        ? `${API_BASE}/admin/faqs/${activeId}`
        : `${API_BASE}/admin/faqs`;

      const res = await fetch(url, {
        method: isEdit ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error();

      showToast(isEdit ? "FAQ updated." : "FAQ added.");
      closeModal();
      fetchFAQs();
    } catch {
      showToast("Could not save FAQ.", "error");
    } finally {
      setSaving(false);
    }
  };

  // Delete FAQ
  const handleDelete = async () => {
    setDeletingId(activeId);

    try {
      const res = await fetch(
        `${API_BASE}/admin/faqs/${activeId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) throw new Error();

      showToast("FAQ deleted.");
      closeModal();
      fetchFAQs();
    } catch {
      showToast("Delete failed.", "error");
    } finally {
      setDeletingId(null);
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

        /* ── LAYOUT ── */
        .ad-wrap { display: flex; flex-direction: column; min-height: 100vh; }

        /* ── HEADER ── */
        .ad-header {
          background: #fff;
          border-bottom: 1px solid #e8e6e0;
          height: 58px;
          padding: 0 2rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-shrink: 0;
          position: sticky;
          top: 0;
          z-index: 20;
        }

        .ad-logo {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .ad-logo-icon {
          width: 34px; height: 34px;
          background: #1a3a5c;
          border-radius: 9px;
          display: flex; align-items: center; justify-content: center;
        }

        .ad-logo-text {
          font-family: 'DM Serif Display', serif;
          font-size: 18px;
          color: #1a1a1a;
          letter-spacing: -0.3px;
        }

        .ad-logo-text em { font-style: italic; color: #e85d2f; }

        .ad-header-right {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .ad-badge {
          background: #f5f4f0;
          border: 1px solid #e2e0d8;
          border-radius: 20px;
          padding: 4px 12px;
          font-size: 12px;
          color: #666;
        }

        .ad-logout {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 7px 14px;
          background: none;
          border: 1.5px solid #e2e0d8;
          border-radius: 8px;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          color: #555;
          cursor: pointer;
          transition: all 0.15s;
        }

        .ad-logout:hover {
          border-color: #e85d2f;
          color: #e85d2f;
          background: #fef6f3;
        }

        /* ── MAIN ── */
        .ad-main {
          flex: 1;
          padding: 2rem;
          max-width: 1000px;
          width: 100%;
          margin: 0 auto;
        }

        /* ── PAGE TITLE ── */
        .ad-page-title {
          margin-bottom: 1.75rem;
        }

        .ad-page-title h1 {
          font-family: 'DM Serif Display', serif;
          font-size: 28px;
          font-weight: 400;
          color: #1a1a1a;
          letter-spacing: -0.5px;
          line-height: 1.2;
        }

        .ad-page-title h1 em { font-style: italic; color: #e85d2f; }

        .ad-page-title p {
          font-size: 13.5px;
          color: #888;
          margin-top: 5px;
        }

        /* ── TOOLBAR ── */
        .ad-toolbar {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 1.25rem;
          flex-wrap: wrap;
        }

        .ad-search-wrap {
          position: relative;
          flex: 1;
          min-width: 200px;
        }

        .ad-search-icon {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: #aaa;
          pointer-events: none;
        }

        .ad-search {
          width: 100%;
          padding: 9px 14px 9px 14px;
          background: #fff;
          border: 1.5px solid #e2e0d8;
          border-radius: 10px;
          font-family: 'DM Sans', sans-serif;
          font-size: 13.5px;
          color: #1a1a1a;
          outline: none;
          transition: border-color 0.15s, box-shadow 0.15s;
          flex: 1;
        }

        .ad-search:focus {
          border-color: #1a3a5c;
          box-shadow: 0 0 0 3px rgba(26,58,92,0.08);
        }

        .ad-search::placeholder { color: #bbb; }

        .ad-add-btn {
          display: flex;
          align-items: center;
          gap: 7px;
          padding: 9px 18px;
          background: #e85d2f;
          color: #fff;
          border: none;
          border-radius: 10px;
          font-family: 'DM Sans', sans-serif;
          font-size: 13.5px;
          font-weight: 500;
          cursor: pointer;
          white-space: nowrap;
          transition: background 0.15s, transform 0.1s;
        }

        .ad-add-btn:hover { background: #d04e22; }
        .ad-add-btn:active { transform: scale(0.97); }

        /* ── STATS ROW ── */
        .ad-stats {
          display: flex;
          gap: 10px;
          margin-bottom: 1.25rem;
        }

        .ad-stat {
          background: #fff;
          border: 1px solid #e8e6e0;
          border-radius: 10px;
          padding: 12px 18px;
          flex: 1;
          min-width: 100px;
        }

        .ad-stat-num {
          font-family: 'DM Serif Display', serif;
          font-size: 26px;
          color: #1a3a5c;
          line-height: 1;
          margin-bottom: 3px;
        }

        .ad-stat-label {
          font-size: 11.5px;
          color: #999;
          text-transform: uppercase;
          letter-spacing: 0.4px;
        }

        /* ── FAQ LIST ── */
        .ad-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .ad-faq-card {
          background: #fff;
          border: 1px solid #e8e6e0;
          border-radius: 12px;
          padding: 16px 18px;
          display: flex;
          align-items: flex-start;
          gap: 14px;
          animation: ad-fadeup 0.2s ease;
          transition: box-shadow 0.15s;
        }

        .ad-faq-card:hover {
          box-shadow: 0 2px 12px rgba(0,0,0,0.06);
        }

        @keyframes ad-fadeup {
          from { opacity: 0; transform: translateY(5px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .ad-faq-body { flex: 1; min-width: 0; }

        .ad-faq-meta {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 6px;
        }

        .ad-cat-tag {
          font-size: 10.5px;
          font-weight: 500;
          padding: 2px 9px;
          border-radius: 10px;
          background: #e8f0f8;
          color: #1a3a5c;
          letter-spacing: 0.2px;
        }

        .ad-faq-q {
          font-size: 14px;
          font-weight: 500;
          color: #1a1a1a;
          margin-bottom: 5px;
          line-height: 1.45;
        }

        .ad-faq-a {
          font-size: 13px;
          color: #777;
          line-height: 1.6;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        /* ── ACTION BUTTONS (Edit / Delete) ── */
        .ad-faq-actions {
          display: flex;
          gap: 7px;
          flex-shrink: 0;
          align-items: center;
        }

        .ad-btn-edit {
          display: flex;
          align-items: center;
          gap: 5px;
          padding: 6px 13px;
          background: #eef3f9;
          border: 1.5px solid #c5d6e8;
          border-radius: 8px;
          font-family: 'DM Sans', sans-serif;
          font-size: 12.5px;
          font-weight: 500;
          color: #1a3a5c;
          cursor: pointer;
          transition: all 0.15s;
          white-space: nowrap;
        }

        .ad-btn-edit:hover {
          background: #1a3a5c;
          border-color: #1a3a5c;
          color: #fff;
          transform: translateY(-1px);
          box-shadow: 0 3px 10px rgba(26,58,92,0.2);
        }

        .ad-btn-edit:active { transform: translateY(0); box-shadow: none; }

        .ad-btn-del {
          display: flex;
          align-items: center;
          gap: 5px;
          padding: 6px 13px;
          background: #fef6f3;
          border: 1.5px solid #f5c4b2;
          border-radius: 8px;
          font-family: 'DM Sans', sans-serif;
          font-size: 12.5px;
          font-weight: 500;
          color: #c0420f;
          cursor: pointer;
          transition: all 0.15s;
          white-space: nowrap;
        }

        .ad-btn-del:hover {
          background: #e85d2f;
          border-color: #e85d2f;
          color: #fff;
          transform: translateY(-1px);
          box-shadow: 0 3px 10px rgba(232,93,47,0.25);
        }

        .ad-btn-del:active { transform: translateY(0); box-shadow: none; }

        /* ── EMPTY / ERROR / LOADING ── */
        .ad-empty {
          text-align: center;
          padding: 4rem 2rem;
          background: #fff;
          border: 1px dashed #dcdad2;
          border-radius: 12px;
          color: #aaa;
        }

        .ad-empty p { font-size: 14px; }
        .ad-empty span { font-size: 12px; color: #bbb; }

        .ad-error-bar {
          background: #fef2f2;
          border: 1px solid #fecaca;
          color: #b91c1c;
          font-size: 13px;
          padding: 10px 16px;
          border-radius: 10px;
          margin-bottom: 1rem;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        /* ── MODAL BACKDROP ── */
        .ad-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(10,20,35,0.45);
          backdrop-filter: blur(4px);
          z-index: 100;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1.5rem;
          animation: ad-fadein 0.18s ease;
        }

        @keyframes ad-fadein {
          from { opacity: 0; }
          to   { opacity: 1; }
        }

        /* ── MODAL BOX ── */
        .ad-modal {
          background: #fff;
          border-radius: 18px;
          width: 100%;
          max-width: 520px;
          overflow: hidden;
          animation: ad-slideup 0.22s cubic-bezier(0.34,1.2,0.64,1);
          box-shadow: 0 24px 64px rgba(0,0,0,0.18), 0 2px 8px rgba(0,0,0,0.06);
        }

        @keyframes ad-slideup {
          from { opacity: 0; transform: translateY(20px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }

        /* ── MODAL HEADER ── */
        .ad-modal-header {
          padding: 22px 24px 18px;
          border-bottom: 1px solid #f0eeea;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .ad-modal-header-left {
          display: flex;
          align-items: center;
          gap: 11px;
        }

        .ad-modal-icon {
          width: 38px; height: 38px;
          border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }

        .ad-modal-icon.edit-icon {
          background: #eef3f9;
          color: #1a3a5c;
        }

        .ad-modal-icon.delete-icon {
          background: #fef3f0;
          color: #e85d2f;
        }

        .ad-modal-title-wrap {}

        .ad-modal-title {
          font-family: 'DM Serif Display', serif;
          font-size: 19px;
          font-weight: 400;
          color: #1a1a1a;
          letter-spacing: -0.3px;
          line-height: 1.2;
        }

        .ad-modal-subtitle {
          font-size: 12px;
          color: #aaa;
          margin-top: 2px;
        }

        .ad-modal-close {
          width: 32px; height: 32px;
          border-radius: 8px;
          border: 1.5px solid #e2e0d8;
          background: #fff;
          cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          color: #aaa;
          font-size: 16px;
          transition: all 0.15s;
          flex-shrink: 0;
        }

        .ad-modal-close:hover {
          border-color: #bbb;
          color: #555;
          background: #f5f4f0;
        }

        /* ── MODAL BODY ── */
        .ad-modal-body {
          padding: 20px 24px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .ad-mfield { display: flex; flex-direction: column; gap: 7px; }

        .ad-mlabel {
          font-size: 11.5px;
          font-weight: 500;
          color: #666;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .ad-mlabel-required {
          color: #e85d2f;
          font-size: 13px;
          line-height: 1;
        }

        .ad-minput, .ad-mtextarea, .ad-mselect {
          width: 100%;
          padding: 10px 14px;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          color: #1a1a1a;
          background: #f9f8f6;
          border: 1.5px solid #e2e0d8;
          border-radius: 10px;
          outline: none;
          transition: border-color 0.15s, box-shadow 0.15s, background 0.15s;
        }

        .ad-minput:focus, .ad-mtextarea:focus, .ad-mselect:focus {
          border-color: #1a3a5c;
          box-shadow: 0 0 0 3px rgba(26,58,92,0.09);
          background: #fff;
        }

        .ad-mtextarea {
          resize: vertical;
          min-height: 100px;
          line-height: 1.65;
        }

        /* ── DELETE MODAL BODY ── */
        .ad-delete-warning {
          background: #fef6f3;
          border: 1.5px solid #fcd9cc;
          border-radius: 12px;
          padding: 16px 18px;
          font-size: 13.5px;
          color: #7a3018;
          line-height: 1.65;
        }

        .ad-delete-warning strong {
          color: #c0420f;
          font-weight: 600;
        }

        .ad-delete-faq-preview {
          margin-top: 12px;
          padding: 12px 14px;
          background: #fff;
          border: 1px solid #e8e6e0;
          border-radius: 9px;
          font-size: 13px;
          color: #555;
          line-height: 1.5;
          font-style: italic;
        }

        /* ── MODAL FOOTER ── */
        .ad-modal-footer {
          padding: 16px 24px 20px;
          border-top: 1px solid #f0eeea;
          display: flex;
          justify-content: flex-end;
          gap: 10px;
        }

        .ad-btn-secondary {
          padding: 9px 18px;
          background: #fff;
          border: 1.5px solid #e2e0d8;
          border-radius: 9px;
          font-family: 'DM Sans', sans-serif;
          font-size: 13.5px;
          color: #555;
          cursor: pointer;
          transition: all 0.15s;
        }

        .ad-btn-secondary:hover { border-color: #bbb; color: #333; background: #f9f8f6; }

        .ad-btn-primary {
          padding: 9px 22px;
          background: #1a3a5c;
          color: #fff;
          border: none;
          border-radius: 9px;
          font-family: 'DM Sans', sans-serif;
          font-size: 13.5px;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.15s, transform 0.1s;
          display: flex; align-items: center; gap: 7px;
          min-width: 90px; justify-content: center;
        }

        .ad-btn-primary:hover:not(:disabled) { background: #253f5e; }
        .ad-btn-primary:active:not(:disabled) { transform: scale(0.97); }
        .ad-btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }

        .ad-btn-danger {
          padding: 9px 22px;
          background: #e85d2f;
          color: #fff;
          border: none;
          border-radius: 9px;
          font-family: 'DM Sans', sans-serif;
          font-size: 13.5px;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.15s, transform 0.1s;
          display: flex; align-items: center; gap: 7px;
          min-width: 110px; justify-content: center;
        }

        .ad-btn-danger:hover:not(:disabled) { background: #c94e24; }
        .ad-btn-danger:active:not(:disabled) { transform: scale(0.97); }
        .ad-btn-danger:disabled { opacity: 0.6; cursor: not-allowed; }

        /* ── SPINNER ── */
        .ad-mini-spinner {
          width: 14px; height: 14px;
          border: 2px solid rgba(255,255,255,0.35);
          border-top-color: #fff;
          border-radius: 50%;
          animation: ad-spin 0.7s linear infinite;
        }

        @keyframes ad-spin { to { transform: rotate(360deg); } }

        /* ── TOAST ── */
        .ad-toast {
          position: fixed;
          bottom: 24px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 200;
          padding: 11px 20px;
          border-radius: 10px;
          font-size: 13.5px;
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 8px;
          box-shadow: 0 6px 24px rgba(0,0,0,0.13);
          animation: ad-toastin 0.2s ease;
          white-space: nowrap;
        }

        .ad-toast.success { background: #1a3a5c; color: #fff; }
        .ad-toast.error   { background: #e85d2f; color: #fff; }

        @keyframes ad-toastin {
          from { opacity: 0; transform: translateX(-50%) translateY(10px); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0); }
        }

        @media (max-width: 600px) {
          .ad-main { padding: 1.25rem; }
          .ad-stats { display: none; }
          .ad-toolbar { flex-direction: column; align-items: stretch; }
          .ad-add-btn { justify-content: center; }
          .ad-btn-edit span, .ad-btn-del span { display: none; }
          .ad-btn-edit, .ad-btn-del { padding: 6px 10px; }
        }
      `}</style>

      <div className="ad-wrap">
        <header className="ad-header">
          <div className="ad-logo">
            <span className="ad-logo-text">
              College <em>Chatbot</em>
            </span>
          </div>

          <div className="ad-header-right">
            <span className="ad-badge">Admin Panel</span>

            <button
              className="ad-logout"
              onClick={logout}
            >
              Logout
            </button>
          </div>
        </header>

        <main className="ad-main">
          <div className="ad-page-title">
            <h1>
              FAQ <em>Manager</em>
            </h1>

            <p>
              Add, edit, or remove questions from chatbot knowledge base.
            </p>
          </div>

          {!loading && !error && (
            <div className="ad-stats">
              <div className="ad-stat">
                <div className="ad-stat-num">
                  {faqs.length}
                </div>

                <div className="ad-stat-label">
                  Total FAQs
                </div>
              </div>

              <div className="ad-stat">
                <div className="ad-stat-num">
                  {filtered.length}
                </div>

                <div className="ad-stat-label">
                  Showing
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="ad-error-bar">
              {error}

              <button onClick={fetchFAQs}>
                Retry
              </button>
            </div>
          )}

          <div className="ad-toolbar">
            <input
              className="ad-search"
              placeholder="Search FAQs..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />

            <button
              className="ad-add-btn"
              onClick={openAdd}
            >
              + Add FAQ
            </button>
          </div>

          {loading ? (
            <div>Loading...</div>
          ) : filtered.length === 0 ? (
            <div className="ad-empty">
              No FAQs found.
            </div>
          ) : (
            <div className="ad-list">
              {filtered.map((faq) => (
                <div
                  className="ad-faq-card"
                  key={faq._id}
                >
                  <div className="ad-faq-body">
                    <div className="ad-faq-q">
                      {faq.question}
                    </div>

                    <div className="ad-faq-a">
                      {faq.answer}
                    </div>
                  </div>

                  <div className="ad-faq-actions">
                    <button
                      className="ad-btn-edit"
                      onClick={() =>
                        openEdit(faq)
                      }
                    >
                      Edit
                    </button>

                    <button
                      className="ad-btn-del"
                      onClick={() =>
                        openDelete(faq)
                      }
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* MODAL */}
      {modal && (
        <div
          className="ad-backdrop"
          ref={modalRef}
          onClick={handleBackdrop}
        >
          <div className="ad-modal">
            {modal !== "delete" ? (
              <>
                <h2>
                  {modal === "edit"
                    ? "Edit FAQ"
                    : "Add FAQ"}
                </h2>

                <input
                  className="ad-minput"
                  placeholder="Question"
                  value={form.question}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      question:
                        e.target.value,
                    })
                  }
                />

                <textarea
                  className="ad-mtextarea"
                  placeholder="Answer"
                  value={form.answer}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      answer:
                        e.target.value,
                    })
                  }
                />

                <input
                  className="ad-minput"
                  placeholder="Category"
                  value={form.category}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      category:
                        e.target.value,
                    })
                  }
                />

                <div className="ad-modal-footer">
                  <button
                    className="ad-btn-secondary"
                    onClick={closeModal}
                  >
                    Cancel
                  </button>

                  <button
                    className="ad-btn-primary"
                    onClick={handleSave}
                    disabled={saving}
                  >
                    {saving
                      ? "Saving..."
                      : "Save"}
                  </button>
                </div>
              </>
            ) : (
              <>
                <h2>Delete FAQ?</h2>

                <p>
                  This action cannot be undone.
                </p>

                <div className="ad-modal-footer">
                  <button
                    className="ad-btn-secondary"
                    onClick={closeModal}
                  >
                    Cancel
                  </button>

                  <button
                    className="ad-btn-danger"
                    onClick={handleDelete}
                    disabled={
                      !!deletingId
                    }
                  >
                    {deletingId
                      ? "Deleting..."
                      : "Delete"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {toast && (
        <div
          className={`ad-toast ${toast.type}`}
        >
          {toast.msg}
        </div>
      )}
    </>
  );
}
