import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const lat = searchParams.get("lat") ?? "48.8566";
  const lng = searchParams.get("lng") ?? "2.3522";
  const key = process.env.GOOGLE_PLACES_KEY!;

  try {
    const res = await fetch(
      `https://places.googleapis.com/v1/places:searchNearby`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": key,
          "X-Goog-FieldMask": "places.id,places.displayName,places.formattedAddress,places.rating,places.userRatingCount,places.priceLevel,places.photos,places.primaryTypeDisplayName",
        },
        body: JSON.stringify({
          includedTypes: ["restaurant"],
          maxResultCount: 12,
          locationRestriction: {
            circle: {
              center: { latitude: parseFloat(lat), longitude: parseFloat(lng) },
              radius: 1500,
            },
          },
        }),
        cache: "no-store",
      }
    );

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error("Google Places error:", err);
    return NextResponse.json({ places: [] }, { status: 200 });
  }
}
