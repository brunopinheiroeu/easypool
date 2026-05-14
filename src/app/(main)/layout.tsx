import Navbar from "@/components/Navbar";
import SessionProvider from "@/components/SessionProvider";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", position: "relative", overflow: "hidden" }}>
        {/* Watercolour background blobs */}
        <div className="blob-rose" style={{ position: "fixed", width: 500, height: 500, top: -100, right: -100, pointerEvents: "none", zIndex: 0 }} />
        <div className="blob-mint" style={{ position: "fixed", width: 400, height: 400, bottom: -80, left: -80, pointerEvents: "none", zIndex: 0 }} />
        <div className="blob-lavender" style={{ position: "fixed", width: 300, height: 300, top: "40%", left: "30%", pointerEvents: "none", zIndex: 0 }} />

        <Navbar />
        <main style={{ flex: 1, position: "relative", zIndex: 1 }}>{children}</main>

        <footer style={{ textAlign: "center", padding: "1.5rem", color: "var(--text-muted)", fontSize: "0.8rem", position: "relative", zIndex: 1 }}>
          EasyPool · votações sem complicação
        </footer>
      </div>
    </SessionProvider>
  );
}
