"use client";
import { useSession, signIn } from "next-auth/react";
import { useEffect, useState } from "react";
import Link from "next/link";

interface Poll {
  id: string; slug: string; title: string; description: string | null;
  expires_at: string | null; created_at: string; total_votes: number;
}

export default function Dashboard() {
  const { data: session, status } = useSession();
  const [polls, setPolls] = useState<Poll[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session) return;
    fetch("/api/my-polls")
      .then(r => r.json())
      .then(data => { setPolls(Array.isArray(data) ? data : []); setLoading(false); });
  }, [session]);

  if (status === "loading") return <div style={{ textAlign: "center", padding: "4rem", color: "var(--text-muted)" }}>Carregando...</div>;
  if (!session) {
    return (
      <div style={{ textAlign: "center", padding: "4rem 1.5rem" }}>
        <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>🔒</div>
        <p style={{ color: "var(--text-muted)", marginBottom: "1.5rem" }}>Você precisa estar logado para ver suas votações.</p>
        <button onClick={() => signIn("google")} className="btn-primary">Entrar com Google</button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 760, margin: "0 auto", padding: "2.5rem 1.5rem" }} className="animate-in">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h1 style={{ fontSize: "1.8rem", fontWeight: 700, margin: 0 }}>Minhas votações</h1>
          <p style={{ color: "var(--text-muted)", marginTop: "0.25rem" }}>
            {session.user?.name ? `Olá, ${session.user.name.split(" ")[0]}! ` : ""}
            {polls.length} {polls.length === 1 ? "votação criada" : "votações criadas"}
          </p>
        </div>
        <Link href="/create" className="btn-primary" style={{ textDecoration: "none" }}>
          ✨ Nova votação
        </Link>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: "3rem", color: "var(--text-muted)" }}>Carregando...</div>
      ) : polls.length === 0 ? (
        <div className="card" style={{ padding: "3rem", textAlign: "center" }}>
          <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>🌱</div>
          <p style={{ color: "var(--text-muted)", marginBottom: "1.5rem" }}>Você ainda não criou nenhuma votação.</p>
          <Link href="/create" className="btn-primary" style={{ textDecoration: "none" }}>Criar primeira votação</Link>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {polls.map(poll => {
            const isExpired = poll.expires_at ? new Date(poll.expires_at) < new Date() : false;
            return (
              <Link key={poll.id} href={`/poll/${poll.slug}`} style={{ textDecoration: "none" }}>
                <div className="card" style={{ padding: "1.4rem 1.6rem", transition: "transform 0.15s, box-shadow 0.15s", cursor: "pointer" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(-2px)"; (e.currentTarget as HTMLDivElement).style.boxShadow = "0 6px 24px rgba(92,74,58,0.1)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = "none"; (e.currentTarget as HTMLDivElement).style.boxShadow = "0 2px 20px rgba(92,74,58,0.06)"; }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "1rem" }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "0.4rem", flexWrap: "wrap" }}>
                        <span className={`badge ${isExpired ? "badge-expired" : "badge-open"}`}>
                          {isExpired ? "⏱ Encerrada" : "🟢 Aberta"}
                        </span>
                      </div>
                      <div style={{ fontWeight: 600, fontSize: "1.05rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {poll.title}
                      </div>
                      {poll.description && (
                        <div style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginTop: "0.2rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {poll.description}
                        </div>
                      )}
                    </div>
                    <div style={{ textAlign: "right", flexShrink: 0 }}>
                      <div style={{ fontWeight: 700, fontSize: "1.3rem", color: "var(--text)" }}>{poll.total_votes}</div>
                      <div style={{ color: "var(--text-muted)", fontSize: "0.75rem" }}>votos</div>
                    </div>
                  </div>
                  <div style={{ marginTop: "0.75rem", fontSize: "0.78rem", color: "var(--text-muted)", display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                    <span>Criada em {new Date(poll.created_at).toLocaleDateString("pt-BR")}</span>
                    {poll.expires_at && <span>Encerra {new Date(poll.expires_at).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })}</span>}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
