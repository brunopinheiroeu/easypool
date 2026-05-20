import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import sql from "@/lib/db";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const polls = await sql`SELECT * FROM polls WHERE slug = ${slug}`;
  if (!polls[0]) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const poll = polls[0];

  const options = await sql`
    SELECT po.id, po.text, po.display_order, COUNT(v.id)::int AS vote_count
    FROM poll_options po
    LEFT JOIN votes v ON v.option_id = po.id
    WHERE po.poll_id = ${poll.id}
    GROUP BY po.id, po.text, po.display_order
    ORDER BY po.display_order
  `;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const totalVotes = (options as any[]).reduce((sum: number, o: { vote_count: number }) => sum + o.vote_count, 0);

  return NextResponse.json({ ...poll, options, totalVotes });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { slug } = await params;
  const polls = await sql`SELECT * FROM polls WHERE slug = ${slug}`;
  if (!polls[0]) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (polls[0].creator_id !== session.user.id) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { title, description, expiresAt, options } = await req.json();
  const poll = polls[0];

  await sql`
    UPDATE polls SET title = ${title}, description = ${description || null}, expires_at = ${expiresAt || null}, updated_at = now()
    WHERE id = ${poll.id}
  `;

  if (options) {
    const { nanoid } = await import("nanoid");
    type EditOption = { id?: string; text: string };
    const incoming = (options as EditOption[]).filter(o => o.text?.trim());
    const incomingIds = new Set(incoming.map(o => o.id).filter(Boolean));

    // Delete options that were removed (and their votes via cascade)
    const existing = await sql`SELECT id FROM poll_options WHERE poll_id = ${poll.id}`;
    for (const o of existing as { id: string }[]) {
      if (!incomingIds.has(o.id)) {
        await sql`DELETE FROM poll_options WHERE id = ${o.id}`;
      }
    }

    // Update existing options or insert new ones
    for (let i = 0; i < incoming.length; i++) {
      const { id, text } = incoming[i];
      if (id) {
        await sql`UPDATE poll_options SET text = ${text.trim()}, display_order = ${i} WHERE id = ${id} AND poll_id = ${poll.id}`;
      } else {
        await sql`INSERT INTO poll_options (id, poll_id, text, display_order) VALUES (${nanoid()}, ${poll.id}, ${text.trim()}, ${i})`;
      }
    }
  }

  return NextResponse.json({ success: true });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { slug } = await params;
  const polls = await sql`SELECT * FROM polls WHERE slug = ${slug}`;
  if (!polls[0]) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (polls[0].creator_id !== session.user.id) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  await sql`DELETE FROM polls WHERE id = ${polls[0].id}`;
  return NextResponse.json({ success: true });
}
