import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { rankRealtors, type RealtorProfile } from "@/lib/matching";

export async function POST() {
  const supabase = await createClient();

  // 1. Get the authenticated user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  }

  // 2. Fetch the buyer's preferences
  const { data: buyer, error: buyerError } = await supabase
    .from("buyers")
    .select("location, budget, timeline, experience, com_style")
    .eq("id", user.id)
    .single();

  if (buyerError || !buyer) {
    return NextResponse.json({ error: "Buyer preferences not found" }, { status: 404 });
  }

  // 3. Fetch all realtors with their profiles
  const { data: realtorRows, error: realtorError } = await supabase
    .from("realtors")
    .select(`
      id,
      bio,
      location,
      specialties,
      years_experience,
      avg_rating,
      total_reviews,
      response_time,
      profiles!inner(full_name, avatar_url)
    `);

  if (realtorError || !realtorRows || realtorRows.length === 0) {
    return NextResponse.json({ error: "No realtors found", matches: [] }, { status: 200 });
  }

  // 4. Normalise to RealtorProfile shape
  type ProfileShape = { full_name: string | null; avatar_url: string | null };
  const realtors: RealtorProfile[] = realtorRows.map((r) => ({
    id: r.id,
    full_name: (r.profiles as unknown as ProfileShape).full_name,
    avg_rating: r.avg_rating ?? 0,
    total_reviews: r.total_reviews ?? 0,
    location: r.location,
    specialties: r.specialties,
    response_time: r.response_time,
    years_experience: r.years_experience,
    bio: r.bio,
  }));

  // 5. Run the matching algorithm
  const ranked = rankRealtors(buyer, realtors);

  // 6. Upsert top 5 matches into the matches table
  const top5 = ranked.slice(0, 5);
  if (top5.length > 0) {
    const upsertRows = top5.map((m) => ({
      buyer_id: user.id,
      realtor_id: m.realtorId,
      status: "active" as const,
      match_score: m.score,
    }));

    await supabase
      .from("matches")
      .upsert(upsertRows, { onConflict: "buyer_id,realtor_id" });
  }

  // 7. Attach avatar URLs for UI rendering
  const realtorMap = Object.fromEntries(
    realtorRows.map((r) => [
      r.id,
      {
        avatar_url: (r.profiles as unknown as ProfileShape).avatar_url,
        bio: r.bio,
        response_time: r.response_time,
        avg_rating: r.avg_rating,
        total_reviews: r.total_reviews,
        location: r.location,
        specialties: r.specialties,
        years_experience: r.years_experience,
      },
    ])
  );

  const enriched = ranked.map((m) => ({
    ...m,
    ...realtorMap[m.realtorId],
  }));

  return NextResponse.json({ matches: enriched });
}
