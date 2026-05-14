import PollClient from "./PollClient";

export default async function PollPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <PollClient slug={slug} />;
}
