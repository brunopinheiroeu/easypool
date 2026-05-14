"use client";
import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";
import Image from "next/image";

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav
      style={{
        background: "rgba(253,248,244,0.85)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid var(--border)",
        position: "sticky",
        top: 0,
        zIndex: 50,
      }}
    >
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 1.5rem", display: "flex", alignItems: "center", justifyContent: "space-between", height: 60 }}>
        <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <Image src="/logo.svg" alt="EasyPoll" width={120} height={40} style={{ display: "block" }} priority />
        </Link>

        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          {session ? (
            <>
              <Link href="/create" className="btn-primary" style={{ padding: "0.45rem 1.2rem", fontSize: "0.9rem", textDecoration: "none" }}>
                + Nova votação
              </Link>
              <Link href="/dashboard" style={{ color: "var(--text-muted)", textDecoration: "none", fontSize: "0.9rem" }}>
                Minhas votações
              </Link>
              <button onClick={() => signOut()} className="btn-ghost" style={{ padding: "0.4rem 1rem", fontSize: "0.85rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                {session.user?.image && (
                  <Image src={session.user.image} alt="" width={22} height={22} style={{ borderRadius: "50%" }} />
                )}
                Sair
              </button>
            </>
          ) : (
            <button onClick={() => signIn("google")} className="btn-primary" style={{ padding: "0.45rem 1.2rem", fontSize: "0.9rem" }}>
              Entrar com Google
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
