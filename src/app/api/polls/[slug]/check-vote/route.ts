import { NextRequest, NextResponse } from "next/server";
import sql from "@/lib/db";
import { cookies } from "next/headers";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const polls = await sql`SELECT id FROM polls WHERE slug = ${slug}`;
  if (!polls[0]) return NextResponse.json({ voted: false });

  const cookieStore = await cookies();
  const voterToken = cookieStore.get("voter_token")?.value;
  if (!voterToken) return NextResponse.json({ voted: false });

  const existing = await sql`
    SELECT v.option_id FROM votes v WHERE v.poll_id = ${polls[0].id} AND v.voter_token = ${voterToken}
  `;

  return NextResponse.json({ voted: !!existing[0], optionId: existing[0]?.option_id || null });
}
