import { ImageResponse } from "next/og";
import sql from "@/lib/db";

export const alt = "EasyPoll — votação";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const rows = await sql`SELECT title, description FROM polls WHERE slug = ${slug}`;
  const poll = rows[0];
  const title = poll?.title || "Votação";
  const description = poll?.description || "Vote agora e veja os resultados em tempo real.";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#fdf8f4",
          padding: "80px",
          position: "relative",
        }}
      >
        <div style={{ position: "absolute", top: -60, right: -60, width: 400, height: 400, borderRadius: "50%", background: "rgba(244,167,185,0.25)", display: "flex" }} />
        <div style={{ position: "absolute", bottom: -60, left: -60, width: 320, height: 320, borderRadius: "50%", background: "rgba(168,216,200,0.25)", display: "flex" }} />

        <div style={{ fontSize: 72, marginBottom: 32, display: "flex" }}>🗳️</div>

        <div style={{
          fontSize: title.length > 40 ? 52 : 64,
          fontWeight: 700,
          color: "#5c4a3a",
          textAlign: "center",
          lineHeight: 1.2,
          marginBottom: 24,
          maxWidth: 900,
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
        }}>
          {title}
        </div>

        {description && (
          <div style={{
            fontSize: 30,
            color: "#9b8a7a",
            textAlign: "center",
            maxWidth: 800,
            lineHeight: 1.5,
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
          }}>
            {description.slice(0, 120)}{description.length > 120 ? "…" : ""}
          </div>
        )}

        <div style={{
          position: "absolute",
          bottom: 40,
          display: "flex",
          alignItems: "center",
          gap: 10,
          color: "#c5b8e8",
          fontSize: 24,
        }}>
          EasyPoll · easypool.brunix.studio
        </div>
      </div>
    ),
    { ...size }
  );
}
