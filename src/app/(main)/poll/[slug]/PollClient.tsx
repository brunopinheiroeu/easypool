"use client";
import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import EditPollModal from "./EditPollModal";

const OPTION_COLORS = ["#f4a7b9", "#a8d8c8", "#c5b8e8", "#f9c89b", "#a8cce8", "#f7e0a0", "#e8c8a8", "#b8d8a8"];

interface Option { id: string; text: string; vote_count: number; display_order: number }
interface Poll {
  id: string; slug: string; title: string; description: string | null;
  creator_id: string; expires_at: string | null; created_at: string;
  options: Option[]; totalVotes: number;
}

export default function PollClient({ slug }: { slug: string }) {
  const { data: session } = useSession();
  const [poll, setPoll] = useState<Poll | null>(null);
  const [loading, setLoading] = useState(true);
  const [votedOptionId, setVotedOptionId] = useState<string | null>(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [voting, setVoting] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [voteError, setVoteError] = useState("");

  const fetchPoll = useCallback(async () => {
    const res = await fetch(`/api/polls/${slug}`);
    if (!res.ok) return;
    const data = await res.json();
    setPoll(data);
  }, [slug]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      await fetchPoll();
      const checkRes = await fetch(`/api/polls/${slug}/check-vote`);
      const checkData = await checkRes.json();
      setHasVoted(checkData.voted);
      setVotedOptionId(checkData.optionId);
      setLoading(false);
    })();
  }, [slug, fetchPoll]);

  // Refresh results every 10s after voting
  useEffect(() => {
    if (!hasVoted) return;
    const interval = setInterval(fetchPoll, 10000);
    return () => clearInterval(interval);
  }, [hasVoted, fetchPoll]);

  const handleVote = async () => {
    if (!selectedOption) return;
    setVoting(true);
    setVoteError("");
    try {
      const res = await fetch(`/api/polls/${slug}/vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ optionId: selectedOption }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setHasVoted(true);
      setVotedOptionId(selectedOption);
      await fetchPoll();
    } catch (err: unknown) {
      setVoteError(err instanceof Error ? err.message : "Erro ao votar.");
    } finally {
      setVoting(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Apagar esta votação? Não dá para desfazer.")) return;
    setDeleting(true);
    await fetch(`/api/polls/${slug}`, { method: "DELETE" });
    window.location.href = "/dashboard";
  };

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "4rem", color: "var(--text-muted)" }}>
        <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>🌸</div>
        Carregando votação...
      </div>
    );
  }

  if (!poll) {
    return (
      <div style={{ textAlign: "center", padding: "4rem 1.5rem" }}>
        <div style={{ fontSize: "2rem", marginBottom: "0.75rem" }}>🌧️</div>
        <p style={{ color: "var(--text-muted)", marginBottom: "1.5rem" }}>Votação não encontrada.</p>
        <Link href="/" className="btn-ghost" style={{ textDecoration: "none" }}>← Voltar ao início</Link>
      </div>
    );
  }

  const isExpired = poll.expires_at ? new Date(poll.expires_at) < new Date() : false;
  const isOwner = session?.user?.id === poll.creator_id;
  const canVote = !hasVoted && !isExpired;

  return (
    <div style={{ maxWidth: 640, margin: "0 auto", padding: "2.5rem 1.5rem" }} className="animate-in">
      {/* Header */}
      <div className="card" style={{ padding: "2rem", marginBottom: "1.25rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "1rem", flexWrap: "wrap", marginBottom: "0.75rem" }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", marginBottom: "0.5rem", flexWrap: "wrap" }}>
              <span className={`badge ${isExpired ? "badge-expired" : "badge-open"}`}>
                {isExpired ? "⏱ Encerrada" : "🟢 Aberta"}
              </span>
              {poll.expires_at && (
                <span className="badge" style={{ background: "#f7e0a040", color: "#7a6020" }}>
                  ⏰ até {new Date(poll.expires_at).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                </span>
              )}
            </div>
            <h1 style={{ fontSize: "1.6rem", fontWeight: 700, margin: 0, lineHeight: 1.3 }}>{poll.title}</h1>
            {poll.description && <p style={{ color: "var(--text-muted)", marginTop: "0.5rem", lineHeight: 1.6 }}>{poll.description}</p>}
          </div>
        </div>

        <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap", marginTop: "0.5rem" }}>
          <button onClick={copyLink} className="btn-ghost" style={{ fontSize: "0.85rem", padding: "0.4rem 1rem" }}>
            {copied ? "✓ Copiado!" : "🔗 Copiar link"}
          </button>
          {isOwner && (
            <>
              <button onClick={() => setShowEdit(true)} className="btn-ghost" style={{ fontSize: "0.85rem", padding: "0.4rem 1rem" }}>
                ✏️ Editar
              </button>
              <button onClick={handleDelete} className="btn-danger" disabled={deleting}>
                {deleting ? "Apagando..." : "🗑 Apagar"}
              </button>
            </>
          )}
        </div>
      </div>

      {/* Options */}
      <div className="card" style={{ padding: "1.75rem" }}>
        <div style={{ marginBottom: "1rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontWeight: 600 }}>{canVote ? "Escolha uma opção:" : "Resultados"}</span>
          <span style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>{poll.totalVotes} {poll.totalVotes === 1 ? "voto" : "votos"}</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {poll.options.map((opt, i) => {
            const pct = poll.totalVotes > 0 ? Math.round((opt.vote_count / poll.totalVotes) * 100) : 0;
            const isSelected = selectedOption === opt.id;
            const isMyVote = votedOptionId === opt.id;
            const color = OPTION_COLORS[i % OPTION_COLORS.length];

            return (
              <div
                key={opt.id}
                onClick={() => canVote && setSelectedOption(opt.id)}
                style={{
                  borderRadius: "1rem",
                  padding: "1rem 1.1rem",
                  border: `2px solid ${isSelected || isMyVote ? color : "var(--border)"}`,
                  background: isMyVote ? `${color}25` : isSelected ? `${color}15` : "rgba(255,255,255,0.5)",
                  cursor: canVote ? "pointer" : "default",
                  transition: "all 0.15s",
                  position: "relative",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: hasVoted ? "0.5rem" : 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                    <div style={{ width: 12, height: 12, borderRadius: "50%", background: color, flexShrink: 0 }} />
                    <span style={{ fontWeight: isMyVote ? 600 : 400 }}>{opt.text}</span>
                    {isMyVote && (
                      <div style={{
                        position: "absolute", top: -12, right: -12,
                        width: 30, height: 30, borderRadius: "50%",
                        background: "#a8d8c8", display: "flex", alignItems: "center", justifyContent: "center",
                        boxShadow: "0 1px 4px rgba(0,0,0,0.12)",
                      }}>
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                          <path d="M2.5 7l3.5 3.5 5.5-6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                    )}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                    {hasVoted && <span style={{ fontWeight: 600, fontSize: "0.9rem", color: "var(--text-muted)" }}>{pct}%</span>}
                    {isSelected && canVote && (
                      <button
                        onClick={e => { e.stopPropagation(); handleVote(); }}
                        disabled={voting}
                        style={{
                          background: color,
                          border: "none",
                          borderRadius: 999,
                          padding: "0.25rem 0.85rem",
                          fontSize: "0.8rem",
                          fontWeight: 600,
                          color: "var(--text)",
                          cursor: "pointer",
                          fontFamily: "inherit",
                          opacity: voting ? 0.6 : 1,
                          whiteSpace: "nowrap",
                        }}
                      >
                        {voting ? "..." : "✓ confirmar"}
                      </button>
                    )}
                  </div>
                </div>
                {hasVoted && (
                  <div className="vote-bar-bg">
                    <div className="vote-bar-fill" style={{ width: `${pct}%`, background: color }} />
                  </div>
                )}
                {hasVoted && (
                  <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginTop: "0.3rem" }}>
                    {opt.vote_count} {opt.vote_count === 1 ? "voto" : "votos"}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {voteError && (
          <div style={{ background: "#f4a7b930", border: "1px solid #f4a7b9", borderRadius: "0.75rem", padding: "0.6rem 1rem", fontSize: "0.85rem", marginTop: "1rem" }}>
            {voteError}
          </div>
        )}


        {hasVoted && !isExpired && (
          <p style={{ textAlign: "center", color: "var(--text-muted)", fontSize: "0.82rem", marginTop: "1rem" }}>
            Resultados atualizam automaticamente a cada 10 segundos.
          </p>
        )}

        {isExpired && (
          <p style={{ textAlign: "center", color: "var(--text-muted)", fontSize: "0.85rem", marginTop: "1rem", fontStyle: "italic" }}>
            Esta votação foi encerrada.
          </p>
        )}
      </div>

      {showEdit && (
        <EditPollModal
          poll={poll}
          onClose={() => setShowEdit(false)}
          onSaved={async () => { setShowEdit(false); await fetchPoll(); }}
        />
      )}
    </div>
  );
}
