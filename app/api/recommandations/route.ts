import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const lat = searchParams.get("lat") ?? "48.8566";
  const lng = searchParams.get("lng") ?? "2.3522";
  const key = process.env.GOOGLE_PLACES_KEY!;

  try {
    const res = await fetch(
      `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=1500&type=restaurant&key=${key}&language=fr`,
      { cache: "no-store" }
    );

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error("Google Places error:", err);
    return NextResponse.json({ results: [] }, { status: 200 });
  }
}
