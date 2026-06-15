import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const ref = searchParams.get("ref");
  const key = process.env.GOOGLE_PLACES_KEY!;

  if (!ref) return NextResponse.json({ error: "No ref" }, { status: 400 });

  const url = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${ref}&key=${key}`;
  const res = await fetch(url, { redirect: "follow" });
  const buffer = await res.arrayBuffer();

  return new NextResponse(buffer, {
    headers: { "Content-Type": "image/jpeg" },
  });
}
