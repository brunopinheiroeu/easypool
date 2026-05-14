import PollClient from "./PollClient";
import sql from "@/lib/db";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const rows = await sql`SELECT title, description FROM polls WHERE slug = ${slug}`;
  const poll = rows[0];

  if (!poll) return { title: "Votação — EasyPool" };

  return {
    title: `${poll.title} — EasyPool`,
    description: poll.description || "Vote agora e veja os resultados em tempo real.",
    openGraph: {
      title: poll.title,
      description: poll.description || "Vote agora e veja os resultados em tempo real.",
      url: `https://easypool.brunix.studio/poll/${slug}`,
      siteName: "EasyPool",
      images: [
        {
          url: "https://easypool.brunix.studio/og-image.png",
          width: 1200,
          height: 630,
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: poll.title,
      description: poll.description || "Vote agora e veja os resultados em tempo real.",
    },
  };
}

export default async function PollPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <PollClient slug={slug} />;
}
