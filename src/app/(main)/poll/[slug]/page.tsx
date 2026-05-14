import PollClient from "./PollClient";
import sql from "@/lib/db";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const rows = await sql`SELECT title, description FROM polls WHERE slug = ${slug}`;
  const poll = rows[0];

  if (!poll) return { title: "Votação — EasyPool" };

  const description = poll.description || "Vote agora e veja os resultados em tempo real.";

  return {
    title: `${poll.title} — EasyPool`,
    description,
    openGraph: {
      title: poll.title,
      description,
      url: `https://easypool.brunix.studio/poll/${slug}`,
      siteName: "EasyPool",
      type: "website",
      // imagem gerada automaticamente pelo opengraph-image.tsx
    },
    twitter: {
      card: "summary_large_image",
      title: poll.title,
      description,
    },
  };
}

export default async function PollPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <PollClient slug={slug} />;
}
