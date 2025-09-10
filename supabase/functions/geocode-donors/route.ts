export const runtime = "nodejs";

import { createClient } from "@supabase/supabase-js";

type DonorRow = {
  user_id: string;
  city: string | null;
  state: string | null;
  latitude: number | null;
  longitude: number | null;
};

type OpenCageResponse = {
  results: {
    geometry?: {
      lat: number;
      lng: number;
    };
  }[];
};

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const OPENCAGE = process.env.OPENCAGE_API_KEY!;
const INTERNAL_SECRET = process.env.INTERNAL_CRON_SECRET;

async function geocode(city?: string | null, state?: string | null) {
  if (!city || !state) return null;

  const q = encodeURIComponent(`${city}, ${state}, India`);
  const url = `https://api.opencagedata.com/geocode/v1/json?q=${q}&key=${OPENCAGE}&limit=1&no_annotations=1`;

  const res = await fetch(url);
  if (!res.ok) return null;

  const data: OpenCageResponse = await res.json();
  const g = data.results?.[0]?.geometry;

  return g ? { lat: g.lat, lng: g.lng } : null;
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function GET(request: Request) {
  try {
    if (INTERNAL_SECRET) {
      const auth = request.headers.get("authorization");
      if (auth !== `Bearer ${INTERNAL_SECRET}`) {
        return new Response("Unauthorized", { status: 401 });
      }
    }

    const { searchParams } = new URL(request.url);
    const limit = Math.max(1, Math.min(500, Number(searchParams.get("limit")) || 100));
    const onlyNulls = searchParams.get("onlyNulls") !== "false";

    let query = supabase
      .from("donors")
      .select("user_id, city, state, latitude, longitude")
      .limit(limit);

    if (onlyNulls) {
      query = query.is("latitude", null).is("longitude", null);
    }

    const { data: donors, error } = await query;
    if (error) throw error;

    const updates: { user_id: string; latitude: number; longitude: number }[] = [];

    for (const d of (donors ?? []) as DonorRow[]) {
      const g = await geocode(d.city, d.state);
      if (g) {
        updates.push({ user_id: d.user_id, latitude: g.lat, longitude: g.lng });
      }
      await sleep(250); // avoid hitting API rate limits
    }

    if (updates.length) {
      const { error: upErr } = await supabase
        .from("donors")
        .upsert(updates, { onConflict: "user_id" });
      if (upErr) throw upErr;
    }

    return Response.json({
      fetched: donors?.length ?? 0,
      updated: updates.length,
      onlyNulls,
    });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : String(e);
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { "content-type": "application/json" },
    });
  }
}
