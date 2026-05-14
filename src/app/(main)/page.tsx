"use client";
import Link from "next/link";
import { useSession, signIn } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();

  return (
    <div style={{ maxWidth: 700, margin: "0 auto", padding: "4rem 1.5rem", textAlign: "center" }}>
      <div className="animate-in">
        <div style={{ fontSize: "3.5rem", marginBottom: "1rem" }}>🗳️</div>
        <h1 style={{ fontSize: "2.6rem", fontWeight: 700, color: "var(--text)", marginBottom: "1rem", lineHeight: 1.2 }}>
          Votações simples,<br />
          <span style={{ color: "#c5a0d0" }}>sem complicação</span>
        </h1>
        <p style={{ fontSize: "1.15rem", color: "var(--text-muted)", marginBottom: "2.5rem", lineHeight: 1.7 }}>
          Crie uma votação em segundos, compartilhe o link e veja os resultados em tempo real. Sem cadastro para votar.
        </p>

        {session ? (
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/create" className="btn-primary" style={{ textDecoration: "none", fontSize: "1.05rem", padding: "0.75rem 2rem" }}>
              ✨ Criar votação
            </Link>
            <Link href="/dashboard" className="btn-ghost" style={{ textDecoration: "none", fontSize: "1.05rem", padding: "0.75rem 2rem" }}>
              Minhas votações
            </Link>
          </div>
        ) : (
          <button onClick={() => signIn("google")} className="btn-primary" style={{ fontSize: "1.05rem", padding: "0.75rem 2rem" }}>
            Entrar com Google para começar
          </button>
        )}
      </div>

      {/* Feature cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "1rem", marginTop: "4rem" }}>
        {[
          { emoji: "🔗", title: "Link único", desc: "Cada votação tem seu próprio link para compartilhar" },
          { emoji: "🍪", title: "Sem login para votar", desc: "Qualquer pessoa com o link pode votar" },
          { emoji: "📊", title: "Resultados ao vivo", desc: "Veja os resultados atualizados na mesma página" },
          { emoji: "⏰", title: "Data limite", desc: "Defina quando a votação encerra, ou deixe aberta" },
        ].map((f) => (
          <div key={f.title} className="card animate-in" style={{ padding: "1.5rem 1rem", textAlign: "center" }}>
            <div style={{ fontSize: "1.8rem", marginBottom: "0.5rem" }}>{f.emoji}</div>
            <div style={{ fontWeight: 600, marginBottom: "0.3rem", fontSize: "0.95rem" }}>{f.title}</div>
            <div style={{ color: "var(--text-muted)", fontSize: "0.82rem", lineHeight: 1.5 }}>{f.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
