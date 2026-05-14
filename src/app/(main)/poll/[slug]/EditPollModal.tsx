"use client";
import { useState } from "react";

interface Option { id: string; text: string; display_order: number; vote_count: number }
interface Poll { slug: string; title: string; description: string | null; expires_at: string | null; options: Option[] }

const MAX_OPTIONS = 20;

export default function EditPollModal({ poll, onClose, onSaved }: {
  poll: Poll;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [title, setTitle] = useState(poll.title);
  const [description, setDescription] = useState(poll.description || "");
  const [options, setOptions] = useState(poll.options.map(o => o.text));
  const [expiresAt, setExpiresAt] = useState(
    poll.expires_at ? new Date(poll.expires_at).toISOString().slice(0, 16) : ""
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const filledCount = options.filter(o => o.trim()).length;
  const atLimit = filledCount >= MAX_OPTIONS;

  const updateOption = (i: number, val: string) => {
    const n = [...options];
    n[i] = val;
    if (i === n.length - 1 && val.trim() && n.filter(o => o.trim()).length < MAX_OPTIONS) n.push("");
    setOptions(n);
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>, i: number) => {
    const text = e.clipboardData.getData("text");
    const lines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
    if (lines.length < 2) return;
    e.preventDefault();
    const before = options.slice(0, i).filter(o => o.trim());
    const after = options.slice(i + 1).filter(o => o.trim());
    const merged = [...before, ...lines, ...after].slice(0, MAX_OPTIONS);
    if (merged.length < MAX_OPTIONS) merged.push("");
    setOptions(merged);
  };

  const handleSave = async () => {
    setError("");
    const valid = options.filter(o => o.trim());
    if (!title.trim()) return setError("Título obrigatório.");
    if (valid.length < 2) return setError("Mínimo 2 opções.");
    setSaving(true);
    try {
      const res = await fetch(`/api/polls/${poll.slug}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, options: valid, expiresAt: expiresAt || null }),
      });
      if (!res.ok) throw new Error("Erro ao salvar.");
      onSaved();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Erro.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(92,74,58,0.2)", backdropFilter: "blur(4px)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}>
      <div className="card animate-in" style={{ width: "100%", maxWidth: 520, padding: "2rem", maxHeight: "90vh", overflowY: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
          <h2 style={{ margin: 0, fontSize: "1.3rem", fontWeight: 700 }}>✏️ Editar votação</h2>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "1.4rem", color: "var(--text-muted)", padding: "0.2rem" }}>×</button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "1.1rem" }}>
          <div>
            <label style={{ display: "block", fontWeight: 600, fontSize: "0.9rem", marginBottom: "0.4rem" }}>Título</label>
            <input className="input" value={title} onChange={e => setTitle(e.target.value)} maxLength={120} />
          </div>
          <div>
            <label style={{ display: "block", fontWeight: 600, fontSize: "0.9rem", marginBottom: "0.4rem" }}>Descrição</label>
            <textarea className="input" value={description} onChange={e => setDescription(e.target.value)} maxLength={400} />
          </div>
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "0.6rem" }}>
              <label style={{ fontWeight: 600, fontSize: "0.9rem" }}>Opções</label>
              <span style={{ fontSize: "0.78rem", color: atLimit ? "#c0785a" : "var(--text-muted)" }}>
                {filledCount}/{MAX_OPTIONS}{atLimit && " — limite atingido"}
              </span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {options.map((opt, i) => (
                <div key={i} style={{ display: "flex", gap: "0.5rem" }}>
                  <input
                    className="input"
                    value={opt}
                    onChange={e => updateOption(i, e.target.value)}
                    onPaste={e => handlePaste(e, i)}
                    maxLength={120}
                    style={{ flex: 1 }}
                  />
                  {options.length > 2 && (
                    <button onClick={() => setOptions(options.filter((_, idx) => idx !== i))} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", fontSize: "1.2rem" }}>×</button>
                  )}
                </div>
              ))}
            </div>
            {atLimit && (
              <p style={{ fontSize: "0.78rem", color: "#c0785a", marginTop: "0.5rem" }}>
                Máximo de {MAX_OPTIONS} opções atingido.
              </p>
            )}
          </div>
          <div>
            <label style={{ display: "block", fontWeight: 600, fontSize: "0.9rem", marginBottom: "0.4rem" }}>Data limite</label>
            <input type="datetime-local" className="input" value={expiresAt} onChange={e => setExpiresAt(e.target.value)} style={{ maxWidth: 260 }} />
          </div>

          {error && <div style={{ background: "#f4a7b930", border: "1px solid #f4a7b9", borderRadius: "0.75rem", padding: "0.6rem 1rem", fontSize: "0.85rem" }}>{error}</div>}

          <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end", paddingTop: "0.25rem" }}>
            <button onClick={onClose} className="btn-ghost">Cancelar</button>
            <button onClick={handleSave} className="btn-primary" disabled={saving}>
              {saving ? "Salvando..." : "Salvar alterações"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
