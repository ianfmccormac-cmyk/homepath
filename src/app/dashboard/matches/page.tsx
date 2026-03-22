"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Star,
  MapPin,
  Clock,
  Award,
  MessageSquare,
  ChevronRight,
  Sparkles,
  TrendingUp,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";

interface MatchResult {
  realtorId: string;
  realtorName: string | null;
  score: number;
  breakdown: {
    location: number;
    specialty: number;
    rating: number;
    responseTime: number;
  };
  badges: string[];
  avatar_url: string | null;
  bio: string | null;
  response_time: string | null;
  avg_rating: number;
  total_reviews: number;
  location: string | null;
  specialties: string[] | null;
}

const AVATAR_COLORS = [
  "bg-violet-500",
  "bg-sky-500",
  "bg-teal-500",
  "bg-amber-500",
  "bg-rose-500",
];

function ScoreBar({ label, value, max, color }: { label: string; value: number; max: number; color: string }) {
  const pct = Math.round((value / max) * 100);
  return (
    <div>
      <div className="flex justify-between text-[11px] text-muted-foreground mb-1">
        <span>{label}</span>
        <span>{value}/{max}</span>
      </div>
      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

export default function MatchesPage() {
  const [matches, setMatches] = useState<MatchResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/match", { method: "POST" })
      .then((r) => r.json())
      .then(({ matches: m, error: e }) => {
        if (e) setError(e);
        else setMatches(m ?? []);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load matches. Please try again.");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="p-5 sm:p-7 lg:p-9 max-w-4xl mx-auto flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 rounded-full border-4 border-muted border-t-gold mx-auto mb-4 animate-spin" />
        <p className="text-muted-foreground text-sm">Finding your best matches&hellip;</p>
      </div>
    );
  }

  if (error || matches.length === 0) {
    return (
      <div className="p-5 sm:p-7 lg:p-9 max-w-4xl mx-auto">
        <div className="bg-secondary rounded-2xl p-8 text-center ring-1 ring-black/[0.06]">
          <Sparkles className="w-8 h-8 text-gold mx-auto mb-3" />
          <p className="text-foreground font-semibold mb-1">No matches yet</p>
          <p className="text-muted-foreground text-sm mb-4">
            Complete your onboarding quiz to get matched with top local agents.
          </p>
          <Link
            href="/onboarding"
            className="inline-flex items-center gap-2 bg-primary text-white font-semibold text-sm px-6 py-3 rounded-xl hover:bg-primary/90 transition-all"
          >
            Start matching
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  const topMatch = matches[0];

  return (
    <div className="p-5 sm:p-7 lg:p-9 max-w-4xl mx-auto space-y-5">
      {/* Header */}
      <div>
        <p className="text-gold-dark font-semibold text-xs uppercase tracking-[0.12em] mb-1">
          Your matches
        </p>
        <h1 className="text-[24px] font-bold text-foreground leading-tight mb-1">
          {matches.length} agent{matches.length !== 1 ? "s" : ""} matched to you
        </h1>
        <p className="text-muted-foreground text-sm">
          Ranked by location, specialties, rating, and responsiveness.
        </p>
      </div>

      {/* #1 Match — hero card */}
      <div className="relative bg-primary rounded-2xl overflow-hidden shadow-[0_8px_40px_rgba(0,0,0,0.18)] ring-1 ring-white/[0.05]">
        <div className="absolute inset-0 opacity-[0.08]">
          {topMatch.avatar_url && (
            <img src={topMatch.avatar_url} alt="" className="w-full h-full object-cover object-top" />
          )}
        </div>
        <div className="relative p-6 sm:p-8">
          <div className="flex items-center gap-2 mb-4">
            <span className="bg-gold text-white text-[11px] font-bold px-3 py-1 rounded-full flex items-center gap-1">
              <Award className="w-3 h-3" />
              Best Match &middot; {topMatch.score}% compatible
            </span>
          </div>

          <div className="flex items-center gap-4 mb-4">
            {topMatch.avatar_url ? (
              <img
                src={topMatch.avatar_url}
                alt={topMatch.realtorName ?? ""}
                className="w-16 h-16 rounded-2xl object-cover object-top ring-2 ring-white/20 shrink-0"
              />
            ) : (
              <div className="w-16 h-16 bg-violet-500 rounded-2xl flex items-center justify-center text-white font-bold text-xl shrink-0">
                {topMatch.realtorName?.split(" ").map((n) => n[0]).join("").slice(0, 2)}
              </div>
            )}
            <div>
              <h2 className="text-white font-bold text-xl leading-tight">{topMatch.realtorName}</h2>
              <div className="flex items-center gap-1.5 mt-1">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span className="text-white/90 text-sm font-semibold">{topMatch.avg_rating}</span>
                <span className="text-white/40 text-xs">({topMatch.total_reviews} reviews)</span>
              </div>
              <div className="flex items-center gap-1 mt-1">
                <MapPin className="w-3 h-3 text-white/50" />
                <span className="text-white/60 text-xs">{topMatch.location}</span>
              </div>
            </div>
          </div>

          {topMatch.bio && (
            <p className="text-white/60 text-sm leading-relaxed mb-4 max-w-lg">{topMatch.bio}</p>
          )}

          {/* Score breakdown */}
          <div className="bg-white/[0.07] rounded-xl p-4 mb-4 border border-white/[0.08] grid sm:grid-cols-2 gap-3">
            <ScoreBar label="Location match" value={topMatch.breakdown.location} max={35} color="bg-sky-400" />
            <ScoreBar label="Specialty fit" value={topMatch.breakdown.specialty} max={25} color="bg-violet-400" />
            <ScoreBar label="Rating & reviews" value={topMatch.breakdown.rating} max={25} color="bg-amber-400" />
            <ScoreBar label="Responsiveness" value={topMatch.breakdown.responseTime} max={15} color="bg-emerald-400" />
          </div>

          {/* Badges */}
          {topMatch.badges.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-5">
              {topMatch.badges.map((b) => (
                <span key={b} className="flex items-center gap-1 text-xs text-white/70 bg-white/[0.08] border border-white/[0.1] rounded-full px-2.5 py-1">
                  <CheckCircle2 className="w-3 h-3 text-gold-text" />
                  {b}
                </span>
              ))}
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href={`/dashboard/messages?realtorId=${topMatch.realtorId}`}
              className="inline-flex items-center justify-center gap-2 bg-gold hover:bg-gold-hover text-white font-bold text-[14px] px-6 py-3.5 rounded-xl transition-all shadow-md min-h-[48px]"
            >
              <MessageSquare className="w-4 h-4" />
              Message {topMatch.realtorName?.split(" ")[0]}
            </Link>
            <div className="flex items-center gap-2 text-white/50 text-xs py-3.5">
              <Clock className="w-3.5 h-3.5" />
              Usually replies {topMatch.response_time}
            </div>
          </div>
        </div>
      </div>

      {/* Remaining matches */}
      {matches.slice(1).map((match, i) => (
        <div
          key={match.realtorId}
          className="bg-card rounded-2xl ring-1 ring-black/[0.07] shadow-[0_2px_12px_rgba(0,0,0,0.05)] overflow-hidden hover:shadow-[0_8px_32px_rgba(0,0,0,0.1)] transition-all duration-300 group"
        >
          <div className="p-5">
            <div className="flex items-start gap-4">
              {/* Rank */}
              <div className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center text-muted-foreground font-bold text-xs shrink-0 mt-0.5">
                #{i + 2}
              </div>

              {/* Avatar */}
              {match.avatar_url ? (
                <img
                  src={match.avatar_url}
                  alt={match.realtorName ?? ""}
                  className="w-12 h-12 rounded-xl object-cover object-top ring-1 ring-black/[0.08] shrink-0"
                />
              ) : (
                <div className={`w-12 h-12 ${AVATAR_COLORS[(i + 1) % AVATAR_COLORS.length]} rounded-xl flex items-center justify-center text-white font-bold shrink-0`}>
                  {match.realtorName?.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                </div>
              )}

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 flex-wrap">
                  <div>
                    <p className="font-semibold text-foreground">{match.realtorName}</p>
                    <div className="flex items-center gap-3 mt-0.5">
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <MapPin className="w-3 h-3 text-gold shrink-0" />
                        {match.location}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        {match.avg_rating} ({match.total_reviews})
                      </span>
                    </div>
                  </div>
                  <span className="text-sm font-bold text-gold-dark bg-gold-light px-2.5 py-1 rounded-full shrink-0">
                    {match.score}% match
                  </span>
                </div>

                {/* Score bars (compact) */}
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <ScoreBar label="Location" value={match.breakdown.location} max={35} color="bg-sky-400" />
                  <ScoreBar label="Specialty" value={match.breakdown.specialty} max={25} color="bg-violet-400" />
                </div>

                {/* Badges */}
                {match.badges.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {match.badges.slice(0, 3).map((b) => (
                      <span key={b} className="text-[11px] text-muted-foreground bg-secondary border border-border rounded-full px-2 py-0.5 flex items-center gap-1">
                        <TrendingUp className="w-2.5 h-2.5 text-gold" />
                        {b}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex items-center gap-3 mt-3">
                  <Link
                    href={`/dashboard/messages?realtorId=${match.realtorId}`}
                    className="flex items-center gap-1.5 text-xs font-semibold text-primary border border-border rounded-lg px-3 py-2 hover:bg-primary hover:text-white hover:border-primary transition-all"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    Message
                  </Link>
                  <span className="flex items-center gap-1 text-xs text-muted-foreground ml-auto">
                    <Clock className="w-3 h-3" />
                    {match.response_time}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Footer note */}
      <p className="text-center text-xs text-muted-foreground pb-4">
        Matches are ranked using location, specialties, ratings, and response time.{" "}
        <Link href="/onboarding" className="text-primary hover:underline">Update your preferences</Link>
      </p>
    </div>
  );
}
