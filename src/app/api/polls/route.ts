import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import sql from "@/lib/db";
import { nanoid } from "nanoid";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { title, description, options, expiresAt } = await req.json();
  if (!title?.trim() || !options?.length || options.length < 2) {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }

  const pollId = nanoid();
  const slug = nanoid(10);

  await sql`
    INSERT INTO polls (id, slug, title, description, creator_id, expires_at)
    VALUES (${pollId}, ${slug}, ${title.trim()}, ${description?.trim() || null}, ${session.user.id}, ${expiresAt || null})
  `;

  for (let i = 0; i < options.length; i++) {
    const text = options[i]?.trim();
    if (text) {
      await sql`
        INSERT INTO poll_options (id, poll_id, text, display_order)
        VALUES (${nanoid()}, ${pollId}, ${text}, ${i})
      `;
    }
  }

  return NextResponse.json({ slug });
}
