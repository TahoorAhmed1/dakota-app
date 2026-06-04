import { NextResponse } from "next/server";
import { env } from "@/lib/server/env";

const fallbackReviews = [
  {
    author_name: "Chris Hitzeman",
    rating: 5,
    text: "UGUIDE provided an outstanding pheasant hunting experience from start to finish.",
    relative_time_description: "a few months ago",
  },
  {
    author_name: "John Doe",
    rating: 5,
    text: "The guides were professional and the birds were plentiful. Highly recommend UGUIDE!",
    relative_time_description: "last month",
  },
  {
    author_name: "Sarah Williams",
    rating: 5,
    text: "The camp was comfortable, the hunting was excellent, and the team made everything easy.",
    relative_time_description: "2 weeks ago",
  },
];

export async function GET() {
  if (!env.GOOGLE_PLACE_ID || !env.GOOGLE_PLACES_API_KEY) {
    console.warn("Google reviews proxy: missing GOOGLE_PLACE_ID or GOOGLE_PLACES_API_KEY");
    return NextResponse.json({ reviews: fallbackReviews });
  }

  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/details/json?place_id=${env.GOOGLE_PLACE_ID}&fields=reviews&key=${env.GOOGLE_PLACES_API_KEY}`,
      {
        next: { revalidate: 3600 },
      }
    );

    const data = await response.json();
    if (data.result?.reviews?.length) {
      return NextResponse.json({ reviews: data.result.reviews });
    }

    console.warn("Google reviews proxy: no reviews returned", data);
    return NextResponse.json({ reviews: fallbackReviews });
  } catch (error) {
    console.error("Google reviews proxy fetch error", error);
    return NextResponse.json({ reviews: fallbackReviews });
  }
}
