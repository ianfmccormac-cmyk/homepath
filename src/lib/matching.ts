// ── Types ────────────────────────────────────────────────────────────────────

export interface BuyerPreferences {
  location: string | null;
  budget: string | null;
  timeline: string | null;
  experience: string | null;
  com_style: string | null;
}

export interface RealtorProfile {
  id: string;
  full_name: string | null;
  avg_rating: number;
  total_reviews: number;
  location: string | null;
  specialties: string[] | null;
  response_time: string | null;
  years_experience: number | null;
  bio: string | null;
}

export interface MatchResult {
  realtorId: string;
  realtorName: string | null;
  score: number;           // 0–100
  breakdown: {
    location: number;      // 0–35
    specialty: number;     // 0–25
    rating: number;        // 0–25
    responseTime: number;  // 0–15
  };
  badges: string[];        // e.g. ["Location match", "First-timer specialist"]
}

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Normalise a location string: "Austin, TX" → ["austin", "tx"] */
function parseLocation(loc: string | null): [string, string] {
  if (!loc) return ["", ""];
  const parts = loc.split(",").map((s) => s.trim().toLowerCase());
  return [parts[0] ?? "", parts[1] ?? ""];
}

/** Map buyer budget label → approx numeric midpoint */
function budgetMidpoint(budget: string | null): number {
  if (!budget) return 0;
  if (budget.includes("Under $300K")) return 250_000;
  if (budget.includes("$300K – $500K")) return 400_000;
  if (budget.includes("$500K – $800K")) return 650_000;
  if (budget.includes("$800K – $1.2M")) return 1_000_000;
  if (budget.includes("$1.2M")) return 1_500_000;
  return 400_000; // "Not sure yet"
}

/** Check if a realtor's specialties list matches buyer experience */
function specialtyScore(
  experience: string | null,
  budget: string | null,
  specialties: string[] | null
): { score: number; badges: string[] } {
  const specs = (specialties ?? []).map((s) => s.toLowerCase());
  let score = 0;
  const badges: string[] = [];
  const mid = budgetMidpoint(budget);

  // Experience alignment
  if (experience?.toLowerCase().includes("first")) {
    if (specs.some((s) => s.includes("first"))) {
      score += 15;
      badges.push("First-timer specialist");
    } else {
      score += 5; // all realtors can help, just not specialist
    }
  } else if (experience?.toLowerCase().includes("investor")) {
    if (specs.some((s) => s.includes("invest"))) {
      score += 15;
      badges.push("Investment specialist");
    } else {
      score += 7;
    }
  } else {
    score += 10; // "Done it before" — any realtor is fine
  }

  // Budget / luxury alignment
  if (mid >= 1_000_000 && specs.some((s) => s.includes("luxury"))) {
    score += 10;
    badges.push("Luxury specialist");
  } else if (mid >= 1_000_000) {
    score += 2;
  } else if (mid < 600_000 && specs.some((s) => s.includes("first") || s.includes("condo") || s.includes("starter"))) {
    score += 5;
  } else {
    score += 3;
  }

  return { score: Math.min(score, 25), badges };
}

/** Score response time (0–15 pts) */
function responseTimeScore(
  responseTime: string | null,
  timeline: string | null
): { score: number; badges: string[] } {
  const rt = responseTime?.toLowerCase() ?? "";
  const urgent = timeline?.toLowerCase().includes("asap") || timeline?.toLowerCase().includes("under 3");
  let score = 0;
  const badges: string[] = [];

  if (rt.includes("30 min")) {
    score = urgent ? 15 : 13;
    badges.push("Replies in < 30 min");
  } else if (rt.includes("1 hr")) {
    score = urgent ? 12 : 10;
    badges.push("Replies in < 1 hr");
  } else if (rt.includes("2 hr")) {
    score = urgent ? 7 : 8;
  } else {
    score = 5;
  }

  return { score, badges };
}

/** Score rating (0–25 pts) */
function ratingScore(rating: number, reviews: number): { score: number; badges: string[] } {
  const badges: string[] = [];
  let score = 0;
  if (rating >= 4.9) { score = 25; badges.push("Top rated"); }
  else if (rating >= 4.7) { score = 20; }
  else if (rating >= 4.5) { score = 15; }
  else if (rating >= 4.0) { score = 10; }
  else { score = 5; }

  // Bonus for high review count
  if (reviews >= 80) score = Math.min(25, score + 3);

  return { score, badges };
}

// ── Main scoring function ─────────────────────────────────────────────────────

export function scoreMatch(
  buyer: BuyerPreferences,
  realtor: RealtorProfile
): MatchResult {
  // ── Location (0–35) ──────────────────────────────────────────────────────
  const [buyerCity, buyerState] = parseLocation(buyer.location);
  const [realtorCity, realtorState] = parseLocation(realtor.location);

  let locationPts = 0;
  const locationBadges: string[] = [];

  if (buyerCity && buyerCity === realtorCity && buyerState === realtorState) {
    locationPts = 35;
    locationBadges.push("Local expert");
  } else if (buyerState && buyerState === realtorState) {
    locationPts = 18;
  } else if (buyerCity && realtorCity && (realtorCity.includes(buyerCity) || buyerCity.includes(realtorCity))) {
    locationPts = 25;
    locationBadges.push("Area match");
  }

  // ── Specialty (0–25) ─────────────────────────────────────────────────────
  const { score: specialtyPts, badges: specBadges } = specialtyScore(
    buyer.experience,
    buyer.budget,
    realtor.specialties
  );

  // ── Rating (0–25) ────────────────────────────────────────────────────────
  const { score: ratingPts, badges: ratingBadges } = ratingScore(
    realtor.avg_rating ?? 0,
    realtor.total_reviews ?? 0
  );

  // ── Response time (0–15) ─────────────────────────────────────────────────
  const { score: responsePts, badges: responseBadges } = responseTimeScore(
    realtor.response_time,
    buyer.timeline
  );

  const total = locationPts + specialtyPts + ratingPts + responsePts;

  return {
    realtorId: realtor.id,
    realtorName: realtor.full_name,
    score: Math.min(100, total),
    breakdown: {
      location: locationPts,
      specialty: specialtyPts,
      rating: ratingPts,
      responseTime: responsePts,
    },
    badges: [...locationBadges, ...specBadges, ...ratingBadges, ...responseBadges],
  };
}

/** Rank a list of realtors against buyer preferences, return sorted best-first */
export function rankRealtors(
  buyer: BuyerPreferences,
  realtors: RealtorProfile[]
): MatchResult[] {
  return realtors
    .map((r) => scoreMatch(buyer, r))
    .sort((a, b) => b.score - a.score);
}
