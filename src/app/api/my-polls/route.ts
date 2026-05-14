import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import sql from "@/lib/db";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const polls = await sql`
    SELECT p.*, COUNT(DISTINCT v.id)::int AS total_votes
    FROM polls p
    LEFT JOIN votes v ON v.poll_id = p.id
    WHERE p.creator_id = ${session.user.id}
    GROUP BY p.id
    ORDER BY p.created_at DESC
  `;

  return NextResponse.json(polls);
}
