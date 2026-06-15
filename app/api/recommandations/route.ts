import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const lat = searchParams.get("lat") ?? "48.8566";
  const lng = searchParams.get("lng") ?? "2.3522";

  try {
    const res = await fetch(
      `https://api.foursquare.com/v3/places/search?ll=${lat},${lng}&query=restaurant&limit=12&fields=fsq_id,name,categories,location,rating,distance,photos`,
      {
        headers: {
          Authorization: process.env.FOURSQUARE_KEY!,
          Accept: "application/json",
        },
        cache: "no-store",
      }
    );

    const data = await res.json();
    console.log("Foursquare response:", JSON.stringify(data).slice(0, 300));
    return NextResponse.json(data);
  } catch (err) {
    console.error("Fetch error:", err);
    return NextResponse.json({ results: [] }, { status: 200 });
  }
}
