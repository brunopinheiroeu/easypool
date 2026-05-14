"use client";
import { useSession, signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

const OPTION_COLORS = ["#f4a7b9", "#a8d8c8", "#c5b8e8", "#f9c89b", "#a8cce8", "#f7e0a0", "#e8c8a8", "#b8d8a8"];
const MAX_OPTIONS = 20;

export default function CreatePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [options, setOptions] = useState([""]);
  const [expiresAt, setExpiresAt] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (status === "loading") return <div style={{ textAlign: "center", padding: "4rem", color: "var(--text-muted)" }}>Carregando...</div>;
  if (!session) {
    return (
      <div style={{ textAlign: "center", padding: "4rem 1.5rem" }}>
        <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>🔒</div>
        <p style={{ color: "var(--text-muted)", marginBottom: "1.5rem" }}>Você precisa estar logado para criar votações.</p>
        <button onClick={() => signIn("google")} className="btn-primary">Entrar com Google</button>
      </div>
    );
  }

  const filledCount = options.filter(o => o.trim()).length;
  const atLimit = filledCount >= MAX_OPTIONS;

  const removeOption = (i: number) => setOptions(options.filter((_, idx) => idx !== i));

  const updateOption = (i: number, val: string) => {
    const next = [...options];
    next[i] = val;
    const filled = next.filter(o => o.trim()).length;
    if (i === next.length - 1 && val.trim() && filled < MAX_OPTIONS) {
      next.push("");
    }
    setOptions(next);
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>, i: number) => {
    const text = e.clipboardData.getData("text");
    const lines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
    if (lines.length < 2) return; // single line — paste normally
    e.preventDefault();
    const before = options.slice(0, i).filter(o => o.trim());
    const after = options.slice(i + 1).filter(o => o.trim());
    const merged = [...before, ...lines, ...after].slice(0, MAX_OPTIONS);
    if (merged.length < MAX_OPTIONS) merged.push("");
    setOptions(merged);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const validOptions = options.filter(o => o.trim());
    if (!title.trim()) return setError("Dê um título para a votação.");
    if (validOptions.length < 2) return setError("Adicione pelo menos 2 opções.");

    setLoading(true);
    try {
      const res = await fetch("/api/polls", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, options: validOptions, expiresAt: expiresAt || null }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      router.push(`/poll/${data.slug}`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erro ao criar votação.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: "2.5rem 1.5rem" }}>
      <div className="animate-in">
        <h1 style={{ fontSize: "1.8rem", fontWeight: 700, marginBottom: "0.25rem" }}>✨ Nova votação</h1>
        <p style={{ color: "var(--text-muted)", marginBottom: "2rem" }}>Preencha os detalhes e compartilhe o link com quem quiser.</p>

        <form onSubmit={handleSubmit}>
          <div className="card" style={{ padding: "2rem", display: "flex", flexDirection: "column", gap: "1.25rem" }}>

            <div>
              <label style={{ display: "block", fontWeight: 600, marginBottom: "0.4rem", fontSize: "0.9rem" }}>Título *</label>
              <input className="input" placeholder="Ex: Onde vamos jantar?" value={title} onChange={e => setTitle(e.target.value)} maxLength={120} />
            </div>

            <div>
              <label style={{ display: "block", fontWeight: 600, marginBottom: "0.4rem", fontSize: "0.9rem" }}>Descrição <span style={{ color: "var(--text-muted)", fontWeight: 400 }}>(opcional)</span></label>
              <textarea className="input" placeholder="Algum contexto extra..." value={description} onChange={e => setDescription(e.target.value)} maxLength={400} />
            </div>

            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "0.75rem" }}>
                <label style={{ fontWeight: 600, fontSize: "0.9rem" }}>Opções *</label>
                <span style={{ fontSize: "0.78rem", color: atLimit ? "#c0785a" : "var(--text-muted)" }}>
                  {filledCount}/{MAX_OPTIONS}
                  {atLimit && " — limite atingido"}
                </span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                {options.map((opt, i) => (
                  <div key={i} style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                    <div style={{ width: 12, height: 12, borderRadius: "50%", flexShrink: 0, background: OPTION_COLORS[i % OPTION_COLORS.length] }} />
                    <input
                      className="input"
                      placeholder={i === 0 ? "Cole uma lista aqui ou digite opção por opção" : `Opção ${i + 1}`}
                      value={opt}
                      onChange={e => updateOption(i, e.target.value)}
                      onPaste={e => handlePaste(e, i)}
                      maxLength={120}
                      style={{ flex: 1 }}
                    />
                    {options.length > 2 && (
                      <button type="button" onClick={() => removeOption(i)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", fontSize: "1.1rem", padding: "0.2rem 0.4rem", flexShrink: 0 }}>×</button>
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
              <label style={{ display: "block", fontWeight: 600, marginBottom: "0.4rem", fontSize: "0.9rem" }}>
                Data limite <span style={{ color: "var(--text-muted)", fontWeight: 400 }}>(opcional)</span>
              </label>
              <input
                type="datetime-local"
                className="input"
                value={expiresAt}
                onChange={e => setExpiresAt(e.target.value)}
                style={{ maxWidth: 280 }}
              />
            </div>

            {error && (
              <div style={{ background: "#f4a7b930", border: "1px solid #f4a7b9", borderRadius: "0.75rem", padding: "0.75rem 1rem", color: "var(--text)", fontSize: "0.9rem" }}>
                {error}
              </div>
            )}

            <button type="submit" className="btn-primary" disabled={loading} style={{ alignSelf: "flex-start", fontSize: "1rem", padding: "0.7rem 2rem" }}>
              {loading ? "Criando..." : "Criar votação →"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
