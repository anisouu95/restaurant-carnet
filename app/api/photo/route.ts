import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const name = searchParams.get("name");
  const key = process.env.GOOGLE_PLACES_KEY!;

  if (!name) return NextResponse.json({ error: "No name" }, { status: 400 });

  const res = await fetch(
    `https://places.googleapis.com/v1/${name}/media?maxHeightPx=400&maxWidthPx=400&key=${key}`,
    { redirect: "follow", cache: "no-store" }
  );

  const buffer = await res.arrayBuffer();
  return new NextResponse(buffer, {
    headers: { "Content-Type": "image/jpeg" },
  });
}
