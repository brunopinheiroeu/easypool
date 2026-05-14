"use client";
import Link from "next/link";
import Image from "next/image";
import { useSession, signIn } from "next-auth/react";

const features = [
  {
    title: "Link único",
    desc: "Cada votação tem seu próprio link para compartilhar com quem quiser.",
    color: "#f4a7b9",
    svg: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <path d="M13 19c1.5 1.5 4 1.8 5.8 0l4-4a4.1 4.1 0 0 0-5.8-5.8l-2 2" stroke="#f4a7b9" strokeWidth="2.2" strokeLinecap="round"/>
        <path d="M19 13c-1.5-1.5-4-1.8-5.8 0l-4 4a4.1 4.1 0 0 0 5.8 5.8l2-2" stroke="#f4a7b9" strokeWidth="2.2" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    title: "Sem login para votar",
    desc: "Qualquer pessoa com o link vota direto, sem criar conta.",
    color: "#a8d8c8",
    svg: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <circle cx="16" cy="11" r="4.5" stroke="#a8d8c8" strokeWidth="2.2"/>
        <path d="M7 26c0-5 4-8 9-8s9 3 9 8" stroke="#a8d8c8" strokeWidth="2.2" strokeLinecap="round"/>
        <path d="M22 15l1.5 1.5L27 13" stroke="#a8d8c8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    title: "Resultados ao vivo",
    desc: "Veja os votos atualizando em tempo real na mesma página.",
    color: "#c5b8e8",
    svg: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <rect x="6" y="18" width="5" height="8" rx="1.5" fill="#c5b8e8" fillOpacity="0.5" stroke="#c5b8e8" strokeWidth="1.5"/>
        <rect x="13.5" y="12" width="5" height="14" rx="1.5" fill="#c5b8e8" fillOpacity="0.5" stroke="#c5b8e8" strokeWidth="1.5"/>
        <rect x="21" y="7" width="5" height="19" rx="1.5" fill="#c5b8e8" fillOpacity="0.5" stroke="#c5b8e8" strokeWidth="1.5"/>
      </svg>
    ),
  },
  {
    title: "Data limite opcional",
    desc: "Defina quando a votação encerra, ou deixe aberta para sempre.",
    color: "#f9c89b",
    svg: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <circle cx="16" cy="17" r="9" stroke="#f9c89b" strokeWidth="2.2"/>
        <path d="M16 11v6l3.5 3.5" stroke="#f9c89b" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M13 5h6" stroke="#f9c89b" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
  },
];

export default function Home() {
  const { data: session } = useSession();

  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: "4rem 1.5rem" }}>

      {/* Hero */}
      <div className="animate-in" style={{ textAlign: "center" }}>
        <div style={{ marginBottom: "1rem", display: "flex", justifyContent: "center" }}><Image src="/icon.svg" alt="" width={112} height={112} /></div>
        <h1 style={{ fontSize: "2.6rem", fontWeight: 700, color: "var(--text)", marginBottom: "1rem", lineHeight: 1.2 }}>
          Votações simples,<br />
          <span style={{ color: "#c5a0d0" }}>sem complicação</span>
        </h1>
        <p style={{ fontSize: "1.15rem", color: "var(--text-muted)", marginBottom: "2.5rem", lineHeight: 1.7, maxWidth: 480, margin: "0 auto 2.5rem" }}>
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

      {/* Features */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "1.25rem", marginTop: "5rem" }}>
        {features.map((f) => (
          <div key={f.title} className="animate-in" style={{ position: "relative", padding: "1.75rem 1.5rem", borderRadius: "1.5rem", overflow: "hidden", background: "rgba(255,255,255,0.72)", border: "1px solid var(--border)" }}>
            {/* Watercolour ink blob */}
            <div style={{
              position: "absolute", top: -30, right: -30,
              width: 120, height: 120,
              background: `radial-gradient(ellipse at 40% 40%, ${f.color}55 0%, transparent 70%)`,
              filter: "blur(8px)",
              pointerEvents: "none",
            }} />
            <div style={{ position: "relative" }}>
              <div style={{ marginBottom: "0.85rem" }}>{f.svg}</div>
              <div style={{ fontWeight: 700, fontSize: "1rem", marginBottom: "0.35rem" }}>{f.title}</div>
              <div style={{ color: "var(--text-muted)", fontSize: "0.85rem", lineHeight: 1.6 }}>{f.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
