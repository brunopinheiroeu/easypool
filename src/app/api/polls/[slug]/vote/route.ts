import { NextRequest, NextResponse } from "next/server";
import sql from "@/lib/db";
import { nanoid } from "nanoid";
import { cookies } from "next/headers";

export async function POST(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const polls = await sql`SELECT * FROM polls WHERE slug = ${slug}`;
  if (!polls[0]) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const poll = polls[0];

  if (poll.expires_at && new Date(poll.expires_at) < new Date()) {
    return NextResponse.json({ error: "Poll has expired" }, { status: 400 });
  }

  const cookieStore = await cookies();
  let voterToken = cookieStore.get("voter_token")?.value;
  if (!voterToken) voterToken = nanoid(32);

  const { optionId } = await req.json();

  const optionCheck = await sql`SELECT id FROM poll_options WHERE id = ${optionId} AND poll_id = ${poll.id}`;
  if (!optionCheck[0]) return NextResponse.json({ error: "Invalid option" }, { status: 400 });

  const existing = await sql`SELECT id FROM votes WHERE poll_id = ${poll.id} AND voter_token = ${voterToken}`;
  if (existing[0]) return NextResponse.json({ error: "Already voted" }, { status: 400 });

  await sql`INSERT INTO votes (id, poll_id, option_id, voter_token) VALUES (${nanoid()}, ${poll.id}, ${optionId}, ${voterToken})`;

  const response = NextResponse.json({ success: true, voterToken });
  response.cookies.set("voter_token", voterToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 365,
    path: "/",
  });
  return response;
}
