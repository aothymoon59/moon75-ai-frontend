import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./AdminPanel.css";

const API_BASE = "http://localhost:3001/api/admin/qna";

export default function AdminPanel() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [keywords, setKeywords] = useState("");
  const [answer, setAnswer] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const fetchItems = async () => {
    try {
      const res = await fetch(API_BASE);
      const data = await res.json();
      setItems(data);
    } catch (err) {
      console.error("Failed to fetch Q&A items:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const openAddModal = () => {
    setEditing(null);
    setKeywords("");
    setAnswer("");
    setModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditing(item);
    setKeywords(item.keywords.join(", "));
    setAnswer(item.answer);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditing(null);
    setKeywords("");
    setAnswer("");
  };

  const handleSave = async () => {
    const keywordList = keywords
      .split(",")
      .map((k) => k.trim().toLowerCase())
      .filter(Boolean);

    if (keywordList.length === 0 || !answer.trim()) return;

    setSaving(true);
    try {
      const method = editing ? "PUT" : "POST";
      const url = editing ? `${API_BASE}/${editing.id}` : API_BASE;
      await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keywords: keywordList, answer: answer.trim() }),
      });
      closeModal();
      await fetchItems();
    } catch (err) {
      console.error("Failed to save:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`${API_BASE}/${id}`, { method: "DELETE" });
      setDeleteConfirm(null);
      await fetchItems();
    } catch (err) {
      console.error("Failed to delete:", err);
    }
  };

  return (
    <div className="admin">
      {/* Header */}
      <header className="admin-header">
        <div className="admin-header-inner">
          <div className="admin-title-group">
            <Link to="/" className="admin-back">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </Link>
            <div className="admin-logo">
              <span className="admin-logo-icon">⚙</span>
              <span className="admin-logo-text">Custom Q&A Manager</span>
            </div>
          </div>
          <button className="admin-add-btn" onClick={openAddModal}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Add Q&A
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="admin-content">
        {loading ? (
          <div className="admin-loader">
            <div className="admin-spinner" />
            <p>Loading questions...</p>
          </div>
        ) : items.length === 0 ? (
          <div className="admin-empty">
            <div className="admin-empty-icon">📋</div>
            <h2>No Custom Q&A Yet</h2>
            <p>Add your first custom question and answer pair.</p>
            <button className="admin-add-btn large" onClick={openAddModal}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Add First Q&A
            </button>
          </div>
        ) : (
          <div className="admin-grid">
            {items.map((item) => (
              <div key={item.id} className="admin-card">
                <div className="card-header">
                  <div className="card-keywords">
                    {item.keywords.map((kw, i) => (
                      <span key={i} className="keyword-tag">{kw}</span>
                    ))}
                  </div>
                  <div className="card-actions">
                    <button
                      className="card-action-btn edit"
                      onClick={() => openEditModal(item)}
                      title="Edit"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                      </svg>
                    </button>
                    <button
                      className="card-action-btn delete"
                      onClick={() => setDeleteConfirm(item.id)}
                      title="Delete"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                      </svg>
                    </button>
                  </div>
                </div>
                <div className="card-answer">
                  <p>{item.answer}</p>
                </div>

                {/* Delete Confirmation */}
                {deleteConfirm === item.id && (
                  <div className="delete-overlay">
                    <p>Delete this Q&A?</p>
                    <div className="delete-actions">
                      <button className="delete-cancel" onClick={() => setDeleteConfirm(null)}>
                        Cancel
                      </button>
                      <button className="delete-confirm" onClick={() => handleDelete(item.id)}>
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Modal */}
      {modalOpen && (
        <div className="modal-backdrop" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editing ? "Edit Q&A" : "Add New Q&A"}</h2>
              <button className="modal-close" onClick={closeModal}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            <div className="modal-body">
              <label className="form-label">
                Keywords
                <span className="form-hint">Comma-separated trigger words</span>
              </label>
              <input
                type="text"
                className="form-input"
                placeholder='e.g. hello, hi, hey'
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
              />

              <label className="form-label">
                Answer
                <span className="form-hint">Supports markdown formatting</span>
              </label>
              <textarea
                className="form-textarea"
                placeholder="Type the response here..."
                rows={5}
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
              />
            </div>
            <div className="modal-footer">
              <button className="modal-cancel-btn" onClick={closeModal}>
                Cancel
              </button>
              <button
                className="modal-save-btn"
                onClick={handleSave}
                disabled={saving || !keywords.trim() || !answer.trim()}
              >
                {saving ? (
                  <span className="btn-spinner" />
                ) : editing ? (
                  "Update"
                ) : (
                  "Create"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
