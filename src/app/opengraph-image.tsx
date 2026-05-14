import { ImageResponse } from "next/og";
import fs from "fs";
import path from "path";

export const alt = "EasyPoll — votações simples";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  const logoBase64 = `data:image/svg+xml;base64,${fs.readFileSync(path.join(process.cwd(), "src/app/logo.svg")).toString("base64")}`;

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
          position: "relative",
        }}
      >
        <div style={{ position: "absolute", top: -80, right: -80, width: 500, height: 500, borderRadius: "50%", background: "rgba(244,167,185,0.2)", display: "flex" }} />
        <div style={{ position: "absolute", bottom: -80, left: -80, width: 400, height: 400, borderRadius: "50%", background: "rgba(168,216,200,0.2)", display: "flex" }} />
        <img src={logoBase64} width={480} height={162} />
        <div style={{ marginTop: 32, fontSize: 28, color: "#9b8a7a", display: "flex" }}>
          Crie votações rápidas e compartilhe com qualquer pessoa.
        </div>
      </div>
    ),
    { ...size }
  );
}
