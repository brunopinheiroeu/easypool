import { ImageResponse } from "next/og";
import sql from "@/lib/db";

export const alt = "EasyPoll — votação";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const ICON_SRC = "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyBpZD0iTGF5ZXJfMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZlcnNpb249IjEuMSIgdmlld0JveD0iMCAwIDMyIDMyIj4KICA8ZGVmcz4KICAgIDxzdHlsZT4KICAgICAgLnN0MCB7CiAgICAgICAgZmlsbDogI2I5YThlNjsKICAgICAgfQoKICAgICAgLnN0MSB7CiAgICAgICAgZmlsbDogIzkyY2ViYjsKICAgICAgfQoKICAgICAgLnN0MiB7CiAgICAgICAgZmlsbDogI2ZkZmRmZDsKICAgICAgfQogICAgPC9zdHlsZT4KICA8L2RlZnM+CiAgPHBhdGggY2xhc3M9InN0MCIgZD0iTTI4LjI0LDkuMjc3bC45OTUuNDk0Yy41MTcuMjU3Ljc2Ni44MDUuNzA4LDEuMzU4LS4wMjUuMjM1LjAzOS40NDUsMCwuNjc4LS4wNDQuMjYtLjE4OS41NDYtLjQzLjY3NGwtLjkxOS40ODQtNC4zNTgsMi4zNTMtMy42MDEsMS45NzEtMi44MzcsMS41NTVjLS4zNTcuMTk2LS42ODcuMzg5LTEuMDU4LjU1My0uMzE1LjEzOS0uNzA4LjA2NC0uOTk5LS4wODVsLTEtLjUxMS0yLjAzMy0xLjExMS02Ljg4Mi0zLjcyMi0yLjg3NS0xLjU1Yy0uNDczLS4yNTUtLjM3Ny0xLjE2LS4zNDctMS42MDguMDMtLjQ0NS4yOTktLjgzMy43MDItMS4wMjZsMS4zMzQtLjYzOSw0LjY5NC0yLjMzNywyLjI4Mi0xLjE0NWMuMjY0LS4xMzIuNDk4LS4yOC44MDktLjM3NS4wMjcuMTQ4LS4wMjYuMjc4LS4wNjEuNDE1bC0uMjgzLDEuMTAxLS40NDYsMS44NDgtMS41NjkuODU0Yy0uMTcuMDkzLS4yNjQuMjktLjI2Mi40NjguMDAyLjE2My4xMjcuMzcxLjMxMy40NTJsMy4wMzEsMS4zMTUsMi40NTgsMS4wOCwzLjE0LDEuMzY1Yy40NzQuMjA2Ljk0Ny4zMjYsMS40NTcuMTU2LjI3NC0uMDkxLjUxOS0uMjU0Ljc3OS0uMzg4bDEuMTc4LS42MDljLjE4NS0uMDk2LjI1NC0uMjg1LjI0My0uNDc1LS4wMS0uMTc4LS4xMTItLjM0MS0uMjg4LS40MzYtLjQ5NC0uMjY4LS44MTctLjM0My0xLjM1NC0uNjA5bC40NjMtMS42OTUuOTg3LTMuNTczYy4wMTQtLjA1MS4wMjYtLjEuMDUxLS4xMjIuMDQyLS4wMzcuMDk3LS4wMi4xNjEuMDExbDUuODE3LDIuODM0WiIvPgogIDxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik0xMC40NjMsMjkuMjhsLTIuNDQ5LTEuMzI1LTIuMDE0LTEuMDk1LTEuOTIzLTEuMDQxLS45MTktLjQ4NGMtLjEyMS0uMDY0LS4yMzMtLjIwOC0uMzIxLS4zMTktLjE3LS4yMTMtLjI0Mi0uNTAzLS4yNDMtLjc3NWwtLjAwOS0xLjQzMS0uMDAzLTEuMTc4LjAwMi0xLjIxMy0uMDAyLTEuNjIzdi0xLjY4MXMuMDExLTMuMzc0LjAxMS0zLjM3NGMwLS4xNC4wMjctLjIzNS4xMjktLjMwNS4wOTktLjA2Ny4yMTEtLjA3OS4zNC0uMDA4bDIuMjY4LDEuMjMzLDIuMDg0LDEuMTMuODQyLjQ0OC45ODYuNTQ3LDEuNjQ4Ljg5MSwzLjM0LDEuODAxLDEuMzc2Ljc0NWMuMTY0LjA4OS4zMDYuMzQ0LjMwNi41NTh2MTAuNzAxYzAsLjE2MS0uMTg2LjMwOS0uMjk3LjM1NS0uMjIuMDkxLS40MTUuMDE5LS42MTEtLjA4OGwtNC41NDItMi40N1oiLz4KICA8cGF0aCBjbGFzcz0ic3QwIiBkPSJNMjkuMjYxLDI1LjM5N2wtNC4wNDIsMi4xOTQtNS43NDcsMy4xNC0xLjk1OSwxLjA4M2MtLjE2Mi4wOS0uMzM3LjEwMS0uNDg5LjAxNS0uMTU5LS4wODktLjIzMi0uMjQtLjIzMi0uNDUzbC4wMDgtMTAuNjYzYzAtLjMwMy4yNi0uNTAyLjQ5Ny0uNjMybDUuOTctMy4yNzUsNi4yMjYtMy4zNzZjLjExMy0uMDYxLjIxOS0uMDcyLjI5OC0uMDIyLjA5OS4wNjMuMTUzLjE2Mi4xNTMuMjk0djIuMzA4cy0uMDAxLDEuNTg3LS4wMDEsMS41ODdsLS4wMDIuOTY3LS4wMDQsNS4wMjljMCwuMjc1LjA0NS41MTcuMDAyLjc4NC0uMDY0LjQwOS0uMjkuODA3LS42NzksMS4wMThaIi8+CiAgPHBhdGggY2xhc3M9InN0MSIgZD0iTTE5LjA4NSwxMy4zNjFsLTIuMDE3LS44ODUtMS41OTMtLjY5NS0zLjQ1Ny0xLjUwNWMtLjExNi0uMDUtLjE4OC0uMTYxLS4xNTgtLjI5MWwuNTQzLTIuMzhjLjA4MS0uMzU1LjE5MS0uNjg1LjI0OC0xLjA0My4wMzktLjI0Mi4xMjUtLjQ0NC4xODQtLjY4M2wxLjI3Mi01LjE0M2MuMDk2LS4zODkuMzc4LS43NDcuODI1LS41ODNsMy4yNTEsMS4xOTcsMy44NywxLjM4OGMuMzY4LjEzMi41MjkuNTM1LjQzMi44OTNsLS41MzgsMi4wMDMtMS4yMTgsNC40MjMtLjg1LDMuMTQzYy0uMDQ4LjE3Ny0uMTQyLjI1Ny0uMzI5LjI2Ni0uMTcxLjAwOC0uMjk3LS4wMy0uNDY2LS4xMDRaTTE0Ljc3Myw2LjMxNGMtLjExMi4xNTgtLjA1Ni4zNjkuMDI2LjUyN2wuODE5LDEuNTcxYy4wNzcuMTQ4LjE3Mi4yNjIuMzA0LjMwNy4zNjYuMTI0LjU5OS0uMTgxLjg0MS0uMzdsMS43MjQtMS4zNDUsMS4yNC0uOTc5Yy4yMjItLjE3NS4yNjctLjQ3OS4wNzgtLjY5NC0uMTczLS4xOTctLjQ3OS0uMjE5LS42ODctLjAyNS0uMjYxLjI0Mi0uNTMzLjQzNS0uODE1LjY1M2wtMS45NjgsMS41MjZjLS4wMzYuMDI4LS4xMjguMDY4LS4xNTkuMDIxLS4xOC0uMjc1LS4zMTUtLjU2MS0uNDYyLS44NTUtLjEyNy0uMjU0LS4zMDYtLjYyLS42MzUtLjU0OS0uMS4wMjItLjIyMi4wOTMtLjMwOC4yMTNaIi8+CiAgPHBhdGggY2xhc3M9InN0MiIgZD0iTTE0Ljc3Myw2LjMxNGMuMDg2LS4xMi4yMDgtLjE5MS4zMDgtLjIxMy4zMjktLjA3MS41MDguMjk1LjYzNS41NDkuMTQ3LjI5NC4yODEuNTgxLjQ2Mi44NTUuMDMxLjA0Ni4xMjMuMDA2LjE1OS0uMDIxbDEuOTY4LTEuNTI2Yy4yODItLjIxOS41NTQtLjQxMS44MTUtLjY1My4yMDgtLjE5NC41MTQtLjE3Mi42ODcuMDI1LjE4OS4yMTUuMTQ0LjUxOS0uMDc4LjY5NGwtMS4yNC45NzktMS43MjQsMS4zNDVjLS4yNDIuMTg5LS40NzUuNDk0LS44NDEuMzctLjEzMS0uMDQ0LS4yMjYtLjE1OS0uMzA0LS4zMDdsLS44MTktMS41NzFjLS4wODItLjE1OC0uMTM5LS4zNjktLjAyNi0uNTI3WiIvPgo8L3N2Zz4=";

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

        <img src={ICON_SRC} width={80} height={80} style={{ marginBottom: 32 }} />

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
          EasyPoll · easypoll.brunix.studio
        </div>
      </div>
    ),
    { ...size }
  );
}
