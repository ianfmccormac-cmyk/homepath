"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  Search,
  FileCheck,
  UserCheck,
  CalendarDays,
  FileSignature,
  MessageSquare,
  ClipboardCheck,
  PartyPopper,
  Heart,
  ArrowRight,
  Star,
  Bed,
  Bath,
  Square,
  ChevronRight,
  ShieldCheck,
  TrendingDown,
  MapPin,
  Clock,
  Sparkles,
  CheckCircle2,
  ChevronDown,
  HelpCircle,
} from "lucide-react";

// ── Journey steps ─────────────────────────────────────────────────────────
const JOURNEY_STEPS = [
  { num: 1, icon: Search,         label: "Browse",      done: true  },
  { num: 2, icon: FileCheck,      label: "Pre-Approval",done: true  },
  { num: 3, icon: UserCheck,      label: "Match",       done: false, active: true },
  { num: 4, icon: CalendarDays,   label: "Tours",       done: false },
  { num: 5, icon: FileSignature,  label: "Offer",       done: false },
  { num: 6, icon: MessageSquare,  label: "Negotiate",   done: false },
  { num: 7, icon: ClipboardCheck, label: "Inspection",  done: false },
  { num: 8, icon: PartyPopper,    label: "Close",       done: false },
];

const STEP_GLOSSARY = [
  { step: "Browse",        plain: "Look at homes online to get a feel for what's out there in your budget." },
  { step: "Pre-Approval",  plain: "A letter from a lender saying 'we'll loan you up to $X.' Makes sellers take you seriously." },
  { step: "Agent Match",   plain: "Your personal expert who guides you, negotiates for you, and explains every step — free for buyers." },
  { step: "Tours",         plain: "Visit homes in person. Your agent schedules these and comes with you." },
  { step: "Offer",         plain: "You tell the seller how much you'd like to pay. Your agent writes this up formally." },
  { step: "Negotiate",     plain: "The seller might counter-offer. Your agent handles all the back-and-forth." },
  { step: "Inspection",    plain: "A certified inspector checks the house for hidden problems before you commit." },
  { step: "Close 🎉",      plain: "Sign the final paperwork, hand over the money, get your keys. You're a homeowner!" },
];

// ── Saved homes (static demo) ─────────────────────────────────────────────
const SAVED_HOMES = [
  { id: 1, address: "124 Oak Street",  city: "Austin, TX", price: 485000, beds: 3, baths: 2, sqft: 1850, priceDropped: 15000, image: "https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?auto=format&fit=crop&w=600&q=80" },
  { id: 2, address: "55 Maple Avenue", city: "Austin, TX", price: 672000, beds: 4, baths: 3, sqft: 2340, priceDropped: 0,     image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=600&q=80" },
  { id: 3, address: "890 Cedar Lane",  city: "Austin, TX", price: 389000, beds: 2, baths: 2, sqft: 1420, priceDropped: 0,     image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&q=80" },
  { id: 4, address: "33 Riverside Dr", city: "Austin, TX", price: 825000, beds: 4, baths: 4, sqft: 3100, priceDropped: 0,     image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80" },
];

function formatPrice(n: number) {
  return n >= 1_000_000 ? `$${(n / 1_000_000).toFixed(1)}M` : `$${(n / 1000).toFixed(0)}K`;
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-gold-dark font-semibold text-[11px] uppercase tracking-[0.12em] mb-3">
      {children}
    </p>
  );
}

// ── Agent data shape ──────────────────────────────────────────────────────
interface MatchedAgent {
  name: string;
  avatar: string | null;
  rating: number;
  reviews: number;
  location: string | null;
  specialties: string[] | null;
  responseTime: string | null;
  score: number | null;
  bio: string | null;
}

// ── Component ─────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const [savedIds, setSavedIds]       = useState([1, 2, 3, 4]);
  const [showGlossary, setShowGlossary] = useState(false);
  const [firstName, setFirstName]     = useState("there");
  const [agent, setAgent]             = useState<MatchedAgent | null>(null);
  const [loadingAgent, setLoadingAgent] = useState(true);

  const currentStep    = JOURNEY_STEPS.find((s) => s.active)!;
  const completedSteps = JOURNEY_STEPS.filter((s) => s.done).length;
  const progressPct    = Math.round((completedSteps / JOURNEY_STEPS.length) * 100);

  useEffect(() => {
    const supabase = createClient();
    (async () => {
      if (!supabase) { setLoadingAgent(false); return; }
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setLoadingAgent(false); return; }

      // Profile name
      const { data: profile } = await supabase
        .from("profiles").select("full_name").eq("id", user.id).single();
      if (profile?.full_name) setFirstName(profile.full_name.split(" ")[0]);

      // Top matched agent — join realtors → profiles
      const { data: topMatch } = await supabase
        .from("matches")
        .select(`
          match_score,
          realtors!matches_realtor_id_fkey(
            avg_rating, total_reviews, location, specialties, response_time, bio,
            profiles(full_name, avatar_url)
          )
        `)
        .eq("buyer_id", user.id)
        .eq("status", "active")
        .order("match_score", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (topMatch) {
        type R = {
          avg_rating: number; total_reviews: number; location: string | null;
          specialties: string[] | null; response_time: string | null; bio: string | null;
          profiles: { full_name: string | null; avatar_url: string | null } | null;
        } | null;
        const r = topMatch.realtors as unknown as R;
        if (r) {
          setAgent({
            name:         r.profiles?.full_name ?? "Your Agent",
            avatar:       r.profiles?.avatar_url ?? null,
            rating:       r.avg_rating,
            reviews:      r.total_reviews,
            location:     r.location,
            specialties:  r.specialties,
            responseTime: r.response_time,
            score:        topMatch.match_score ?? null,
            bio:          r.bio,
          });
        }
      }
      setLoadingAgent(false);
    })();
  }, []);

  // Fallback agent when DB has no matches yet (demo mode)
  const displayAgent: MatchedAgent = agent ?? {
    name: "Paloma Aguilar", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80",
    rating: 4.9, reviews: 87, location: "Austin, TX",
    specialties: ["First-time buyers", "Starter homes"],
    responseTime: "< 1 hr", score: null, bio: "Austin native with 9 years helping first-time buyers navigate the Texas market.",
  };

  return (
    <div className="p-5 sm:p-7 lg:p-9 max-w-4xl mx-auto space-y-8">

      {/* ═══════════════════════════════════════════════════════════
          SECTION 1 — PROGRESS TRACKER
      ════════════════════════════════════════════════════════════ */}
      <div>
        <h1 className="text-[26px] font-bold text-foreground mb-0.5">
          Good morning, {firstName} 👋
        </h1>
        <p className="text-muted-foreground text-[14px] mb-5">
          You&apos;re on step {currentStep.num} of 8 — keep going.
        </p>

        <SectionLabel>Your buying journey</SectionLabel>

        {/* Progress bar */}
        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-gold rounded-full transition-all" style={{ width: `${progressPct}%` }} />
          </div>
          <span className="text-xs text-muted-foreground whitespace-nowrap font-medium">
            {progressPct}% done
          </span>
        </div>

        {/* Step nodes — horizontal scroll on mobile */}
        <div className="overflow-x-auto pb-1 -mx-1 px-1">
          <div className="flex gap-1 min-w-max">
            {JOURNEY_STEPS.map((s, idx) => {
              const Icon = s.icon;
              return (
                <div key={s.num} className="flex items-center">
                  <div className="flex flex-col items-center gap-1.5 w-[68px]">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all
                      ${s.done    ? "bg-gold text-white shadow-[0_2px_8px_rgba(0,0,0,0.12)]"
                      : s.active  ? "bg-primary text-white shadow-[0_2px_12px_rgba(0,0,0,0.2)] ring-2 ring-primary/30"
                      :             "bg-secondary text-muted-foreground/50"}`}>
                      {s.done
                        ? <CheckCircle2 className="w-4 h-4" />
                        : <Icon className="w-4 h-4" />}
                    </div>
                    <span className={`text-[10px] text-center leading-tight font-medium
                      ${s.done ? "text-gold-dark" : s.active ? "text-primary font-semibold" : "text-muted-foreground/50"}`}>
                      {s.label}
                    </span>
                  </div>
                  {idx < JOURNEY_STEPS.length - 1 && (
                    <div className={`w-3 h-px mb-5 shrink-0 ${s.done ? "bg-gold" : "bg-border"}`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Glossary toggle */}
        <button
          onClick={() => setShowGlossary((prev) => !prev)}
          className="flex items-center gap-1.5 text-xs text-muted-foreground/60 hover:text-muted-foreground transition-colors mt-3"
        >
          <HelpCircle className="w-3 h-3" />
          What does each step mean?
          <ChevronDown className={`w-3 h-3 transition-transform ${showGlossary ? "rotate-180" : ""}`} />
        </button>
        {showGlossary && (
          <div className="mt-3 bg-sky-50 border border-sky-100 rounded-2xl p-4 grid gap-3">
            <p className="text-xs font-bold text-sky-700 uppercase tracking-wider mb-1">Plain-English Guide</p>
            {STEP_GLOSSARY.map(({ step, plain }) => (
              <div key={step} className="flex gap-3 items-start">
                <span className="text-xs font-bold text-sky-800 shrink-0 w-24 sm:w-28 leading-snug pt-0.5">{step}</span>
                <span className="text-xs text-sky-900 leading-relaxed">{plain}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ═══════════════════════════════════════════════════════════
          SECTION 2 — NEXT STEP
      ════════════════════════════════════════════════════════════ */}
      <div>
        <SectionLabel>Next step</SectionLabel>
        <div className="relative bg-primary rounded-2xl overflow-hidden shadow-[0_8px_40px_rgba(0,0,0,0.15)] ring-1 ring-white/[0.05]">
          <div className="absolute inset-0 opacity-[0.1]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=60" alt="" className="w-full h-full object-cover" />
          </div>
          <div className="relative p-6 sm:p-8">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 bg-white/10 rounded-lg flex items-center justify-center">
                <UserCheck className="w-4 h-4 text-white" />
              </div>
              <span className="text-gold-text text-xs font-bold uppercase tracking-widest">
                Step {currentStep.num} · {currentStep.label}
              </span>
            </div>
            <h2 className="text-white font-bold text-xl md:text-2xl leading-tight mb-2">
              Send your first message to {displayAgent.name.split(" ")[0]}
            </h2>
            <p className="text-white/60 text-sm leading-relaxed mb-5 max-w-lg">
              Your agent has reviewed your profile and is ready to start. One message unlocks everything — tours, offers, the whole journey.
            </p>

            {/* Live signal */}
            <div className="flex items-center gap-2.5 bg-white/[0.07] border border-white/[0.08] rounded-xl px-3 py-2 mb-5 w-fit">
              <div className="w-1.5 h-1.5 rounded-full bg-gold-text animate-pulse shrink-0" />
              <p className="text-white/60 text-xs">
                <span className="text-white/90 font-semibold">{displayAgent.name.split(" ")[0]}</span> is waiting for your message
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/dashboard/messages"
                className="inline-flex items-center justify-center gap-2 bg-gold hover:bg-gold-hover text-white font-bold text-[14px] px-7 py-3.5 rounded-xl transition-all shadow-md min-h-[48px]"
              >
                <MessageSquare className="w-4 h-4" />
                Send First Message
              </Link>
              <Link
                href="/dashboard/matches"
                className="inline-flex items-center gap-1.5 text-white/50 hover:text-white/80 text-sm font-medium transition-colors py-3.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                See all my matches
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-5 pt-4 border-t border-white/[0.08]">
              {["Verified agent", "Free for buyers", "No commitment"].map((l) => (
                <span key={l} className="flex items-center gap-1 text-white/30 text-[11px]">
                  <ShieldCheck className="w-3 h-3" />{l}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════
          SECTION 3 — YOUR MATCHED AGENT
      ════════════════════════════════════════════════════════════ */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <SectionLabel>Your matched agent</SectionLabel>
          <Link href="/dashboard/matches" className="text-xs text-primary font-medium hover:underline flex items-center gap-1">
            See all <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {loadingAgent ? (
          <div className="bg-card rounded-2xl ring-1 ring-black/[0.07] p-6 flex items-center gap-3">
            <div className="w-6 h-6 border-2 border-muted border-t-primary rounded-full animate-spin shrink-0" />
            <p className="text-muted-foreground text-sm">Loading your match…</p>
          </div>
        ) : (
          <div className="bg-card rounded-2xl ring-1 ring-black/[0.07] shadow-[0_2px_16px_rgba(0,0,0,0.06)] overflow-hidden">
            <div className="p-5 sm:p-6 flex items-start gap-4">
              {/* Avatar */}
              <div className="shrink-0">
                {displayAgent.avatar ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={displayAgent.avatar} alt={displayAgent.name} className="w-16 h-16 rounded-2xl object-cover object-top ring-1 ring-black/[0.08]" />
                ) : (
                  <div className="w-16 h-16 bg-violet-500 rounded-2xl flex items-center justify-center text-white font-bold text-lg">
                    {displayAgent.name.split(" ").map((n: string) => n[0]).join("").slice(0, 2)}
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 flex-wrap">
                  <div>
                    <p className="font-bold text-foreground text-[16px]">{displayAgent.name}</p>
                    <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        {displayAgent.rating} · {displayAgent.reviews} reviews
                      </span>
                      {displayAgent.location && (
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                          <MapPin className="w-3 h-3 text-gold shrink-0" />
                          {displayAgent.location}
                        </span>
                      )}
                    </div>
                  </div>
                  {displayAgent.score !== null && (
                    <span className="text-xs font-bold bg-gold-light text-gold-dark px-2.5 py-1 rounded-full shrink-0">
                      {displayAgent.score}% match
                    </span>
                  )}
                </div>

                {displayAgent.bio && (
                  <p className="text-muted-foreground text-[13px] leading-relaxed mt-2 line-clamp-2">{displayAgent.bio}</p>
                )}

                {/* Specialties */}
                {displayAgent.specialties && displayAgent.specialties.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {displayAgent.specialties.slice(0, 3).map((s) => (
                      <span key={s} className="text-[11px] bg-secondary border border-border text-muted-foreground rounded-full px-2.5 py-0.5">
                        {s}
                      </span>
                    ))}
                  </div>
                )}

                {/* Footer row */}
                <div className="flex items-center justify-between mt-4 pt-3 border-t border-border flex-wrap gap-3">
                  {displayAgent.responseTime && (
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3 text-gold shrink-0" />
                      Replies {displayAgent.responseTime}
                    </span>
                  )}
                  <div className="flex gap-2 ml-auto">
                    <Link
                      href="/dashboard/messages"
                      className="flex items-center gap-1.5 text-xs font-semibold text-primary border border-border rounded-lg px-3 py-2 hover:bg-primary hover:text-white hover:border-primary transition-all"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      Message
                    </Link>
                    <Link
                      href="/dashboard/matches"
                      className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground border border-border rounded-lg px-3 py-2 hover:bg-secondary transition-colors"
                    >
                      View profile
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ═══════════════════════════════════════════════════════════
          SECTION 4 — SAVED HOMES
      ════════════════════════════════════════════════════════════ */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <SectionLabel>Saved homes</SectionLabel>
          <Link href="/dashboard/saved" className="text-xs text-primary font-medium hover:underline flex items-center gap-1">
            See all <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {SAVED_HOMES.map((home) => (
            <Link
              key={home.id}
              href={`/properties/${home.id}`}
              className="group rounded-xl ring-1 ring-black/[0.07] overflow-hidden hover:shadow-[0_8px_24px_rgba(0,0,0,0.1)] transition-all hover:-translate-y-0.5 duration-200"
            >
              <div className="relative h-32 sm:h-28 overflow-hidden bg-muted">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={home.image} alt={home.address} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                {home.priceDropped > 0 && (
                  <div className="absolute top-2 left-2 flex items-center gap-0.5 bg-emerald-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-sm">
                    <TrendingDown className="w-2.5 h-2.5" />
                    ↓${(home.priceDropped / 1000).toFixed(0)}K
                  </div>
                )}
                <p className="absolute bottom-2 left-2.5 text-white font-bold text-sm drop-shadow-sm">{formatPrice(home.price)}</p>
                <button
                  onClick={(e) => { e.preventDefault(); setSavedIds((ids) => ids.includes(home.id) ? ids.filter(i => i !== home.id) : [...ids, home.id]); }}
                  className={`absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center transition-all ${savedIds.includes(home.id) ? "bg-rose-500 text-white" : "bg-white/80 text-foreground hover:bg-white"}`}
                >
                  <Heart className={`w-3.5 h-3.5 ${savedIds.includes(home.id) ? "fill-white" : ""}`} />
                </button>
              </div>
              <div className="p-2.5 bg-card">
                <p className="text-xs text-muted-foreground truncate font-medium">{home.address}</p>
                <div className="flex gap-2 mt-1 text-[11px] text-muted-foreground">
                  <span className="flex items-center gap-0.5"><Bed className="w-3 h-3" />{home.beds}</span>
                  <span className="flex items-center gap-0.5"><Bath className="w-3 h-3" />{home.baths}</span>
                  <span className="flex items-center gap-0.5"><Square className="w-3 h-3" />{home.sqft.toLocaleString()}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

    </div>
  );
}
