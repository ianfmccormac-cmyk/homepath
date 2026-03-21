"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { MapPin, ArrowLeft, CheckCircle2, Sparkles } from "lucide-react";
import { JargonTip } from "@/components/jargon-tip";

type QuizAnswers = {
  location: string;
  budget: string;
  timeline: string;
  experience: string;
  comStyle: string;
};

const BUDGET_OPTIONS = [
  { label: "Under $300K", hint: "Great for condos & starter homes" },
  { label: "$300K – $500K", hint: "Most popular range in Austin" },
  { label: "$500K – $800K", hint: "Single family & larger spaces" },
  { label: "$800K – $1.2M", hint: "Premium neighborhoods" },
  { label: "$1.2M+", hint: "Luxury & custom homes" },
  { label: "Not sure yet", hint: "We'll help you figure it out" },
];

const TIMELINE_OPTIONS = [
  { label: "ASAP — under 3 months", hint: "You're ready to move fast" },
  { label: "3 – 6 months", hint: "The most common timeline" },
  { label: "6 – 12 months", hint: "You're planning ahead" },
  { label: "Just exploring", hint: "No pressure — we'll keep you informed" },
];

const EXPERIENCE_OPTIONS = [
  { label: "First-time buyer", hint: "I need guidance through every step" },
  { label: "Done it before", hint: "I just need the right agent" },
  { label: "Investor", hint: "I'm looking for opportunity & returns" },
];

const COM_OPTIONS = [
  { label: "💬 Text / Chat", hint: "Quick back-and-forth, on your time" },
  { label: "📞 Phone calls", hint: "I like talking things through" },
  { label: "📧 Email", hint: "I want everything in writing" },
  { label: "🎥 Video calls", hint: "Face-to-face feels right to me" },
];

const POPULAR_CITIES = ["Austin, TX", "Denver, CO", "Miami, FL", "Nashville, TN"];

const STEPS = [
  { key: "location", label: "Location" },
  { key: "budget", label: "Budget" },
  { key: "timeline", label: "Timeline" },
  { key: "experience", label: "Experience" },
  { key: "style", label: "Style" },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [matching, setMatching] = useState(false);
  const [answers, setAnswers] = useState<QuizAnswers>({
    location: "",
    budget: "",
    timeline: "",
    experience: "",
    comStyle: "",
  });

  const progressPct = Math.round((step / STEPS.length) * 100);
  const currentStepLabel = STEPS[step - 1]?.label ?? "";

  const canProceed =
    (step === 1 && answers.location.trim().length > 0) ||
    (step === 2 && answers.budget !== "") ||
    (step === 3 && answers.timeline !== "") ||
    (step === 4 && answers.experience !== "") ||
    (step === 5 && answers.comStyle !== "");

  // Auto-advance for single-choice steps (2-5)
  const selectAndAdvance = async (key: keyof QuizAnswers, value: string) => {
    const newAnswers = { ...answers, [key]: value };
    setAnswers(newAnswers);

    setTimeout(async () => {
      if (step < STEPS.length) {
        setStep((s) => s + 1);
      } else {
        // Last step — save to DB then show matching screen
        setMatching(true);

        try {
          const { createClient } = await import("@/lib/supabase/client");
          const supabase = createClient();
          if (!supabase) throw new Error("Supabase not configured");
          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
            await supabase
              .from("buyers")
              .upsert({
                id: user.id,
                location: newAnswers.location,
                budget: newAnswers.budget,
                timeline: newAnswers.timeline,
                experience: newAnswers.experience,
                com_style: newAnswers.comStyle,
                onboarding_complete: true,
                journey_step: 3,
              });
          }
        } catch (err) {
          console.error("Failed to save onboarding preferences:", err);
        }

        // Call matching API while animation plays
        fetch("/api/match", { method: "POST" }).catch(() => {});
        setTimeout(() => router.push("/dashboard/matches"), 2800);
      }
    }, 320);
  };

  // ── Matching loading screen ──────────────────────────────────────────────
  if (matching) {
    return (
      <div className="min-h-screen bg-primary flex flex-col items-center justify-center px-4 text-center">
        {/* Subtle background texture */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
            backgroundSize: "28px 28px",
          }}
        />
        <div className="relative">
          {/* Animated spinner ring */}
          <div className="w-20 h-20 rounded-full border-4 border-white/10 border-t-gold mx-auto mb-8 animate-spin" />

          <Sparkles className="w-8 h-8 text-gold-text mx-auto mb-4" />
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3 tracking-tight">
            Finding your perfect match&hellip;
          </h2>
          <p className="text-white/55 text-base max-w-xs mx-auto leading-relaxed">
            Comparing 200+ vetted agents against your preferences.
          </p>

          {/* Animated dots progress */}
          <div className="flex gap-2 justify-center mt-8">
            {["Checking location", "Matching budget", "Comparing style"].map((label, i) => (
              <div
                key={label}
                className="flex items-center gap-1.5 text-xs text-white/40 bg-white/8 rounded-full px-3 py-1.5 border border-white/10"
                style={{ animationDelay: `${i * 0.4}s` }}
              >
                <div className="w-1.5 h-1.5 rounded-full bg-gold-text animate-pulse" />
                {label}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Minimal header */}
      <header className="bg-primary h-16 flex items-center px-6 shrink-0">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gold rounded-lg flex items-center justify-center shadow-sm">
            <MapPin className="w-4 h-4 text-white" strokeWidth={2.5} />
          </div>
          <span className="text-white font-semibold text-lg">HomePath</span>
        </Link>
        {/* Step counter top-right */}
        <div className="ml-auto flex items-center gap-3">
          <span className="text-white/30 text-xs hidden sm:block">Free for buyers · No commitment</span>
          <span className="text-white/50 text-sm font-medium">{step} of {STEPS.length}</span>
        </div>
      </header>

      {/* Slim progress bar */}
      <div className="h-1 bg-muted shrink-0">
        <div
          className="h-full bg-gold transition-all duration-500 ease-out"
          style={{ width: `${progressPct}%` }}
        />
      </div>

      {/* Content */}
      <div className="flex-1 flex items-start justify-center px-4 py-10 sm:py-16">
        <div className="w-full max-w-lg">

          {/* ── Step 1: Location ── */}
          {step === 1 && (
            <div>
              <p className="text-gold-dark font-semibold text-xs uppercase tracking-widest mb-4">
                Step 1 — Location
              </p>
              <h1 className="text-[26px] sm:text-3xl md:text-4xl font-bold text-foreground mb-2 leading-tight">
                Where are you looking to buy?
              </h1>
              <p className="text-muted-foreground mb-2">
                Pick a city below, or type your own.
              </p>
              {/* Inline tip */}
              <p className="text-xs text-muted-foreground/70 bg-secondary border border-border rounded-lg px-3 py-2 mb-6 inline-block">
                💡 This helps us show you agents licensed in your area.
              </p>

              {/* City pills — tap to auto-select + advance */}
              <div className="grid grid-cols-2 gap-2 mb-5">
                {POPULAR_CITIES.map((city) => (
                  <button
                    key={city}
                    onClick={() => {
                      setAnswers((a) => ({ ...a, location: city }));
                      setTimeout(() => setStep((s) => s + 1), 320);
                    }}
                    className={`text-sm border rounded-xl px-4 py-3.5 transition-all font-medium flex items-center justify-center gap-1.5 min-h-[52px] ${
                      answers.location === city
                        ? "border-primary bg-primary text-white shadow-md"
                        : "border-border text-foreground hover:border-primary/60 hover:bg-secondary bg-card"
                    }`}
                  >
                    {answers.location === city && <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />}
                    {city}
                  </button>
                ))}
              </div>

              <div className="relative">
                <input
                  type="text"
                  placeholder="Or type a city, ZIP code, or neighborhood…"
                  value={answers.location}
                  onChange={(e) => setAnswers((a) => ({ ...a, location: e.target.value }))}
                  onKeyDown={(e) =>
                    e.key === "Enter" && canProceed && setStep((s) => s + 1)
                  }
                  className="w-full border border-border rounded-xl px-4 py-3.5 text-base focus:outline-none focus:ring-2 focus:ring-primary/50 bg-card text-foreground placeholder:text-muted-foreground transition-shadow"
                  autoFocus
                />
              </div>

              <div className="mt-8">
                <button
                  onClick={() => canProceed && setStep((s) => s + 1)}
                  disabled={!canProceed}
                  className={`w-full flex items-center justify-center gap-2 font-semibold text-[15px] px-8 py-4 rounded-xl transition-all min-h-[52px] ${
                    canProceed
                      ? "bg-primary text-white hover:bg-primary/90 shadow-sm"
                      : "bg-muted text-muted-foreground cursor-not-allowed"
                  }`}
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {/* ── Step 2: Budget ── */}
          {step === 2 && (
            <div>
              <p className="text-gold-dark font-semibold text-xs uppercase tracking-widest mb-4">
                Step 2 — Budget
              </p>
              <h1 className="text-[26px] sm:text-3xl md:text-4xl font-bold text-foreground mb-2 leading-tight">
                What&apos;s your rough budget?
              </h1>
              <p className="text-muted-foreground mb-1">
                No judgment — there&apos;s no wrong answer.
              </p>
              <p className="text-xs text-muted-foreground/70 bg-secondary border border-border rounded-lg px-3 py-2 mb-6 inline-block">
                💡 This is the{" "}
                <JargonTip
                  term="total home price"
                  definition="The full purchase price of the home — not your down payment. Most first-time buyers pay 3–20% of this upfront (e.g., $15K–$100K on a $500K home) and borrow the rest via a mortgage."
                >
                  total home price
                </JargonTip>
                , not your down payment. Most buyers pay 3–20% upfront.
              </p>
              <div className="grid grid-cols-2 gap-3">
                {BUDGET_OPTIONS.map(({ label, hint }) => (
                  <button
                    key={label}
                    onClick={() => selectAndAdvance("budget", label)}
                    className={`text-left px-4 py-4 rounded-xl border text-sm font-medium transition-all min-h-[64px] ${
                      answers.budget === label
                        ? "border-primary bg-primary text-white shadow-md scale-[0.98]"
                        : "border-border bg-card text-foreground hover:border-primary/60 hover:bg-secondary"
                    }`}
                  >
                    <p className="font-semibold">{label}</p>
                    <p className={`text-xs mt-0.5 ${answers.budget === label ? "text-white/70" : "text-muted-foreground"}`}>
                      {hint}
                    </p>
                  </button>
                ))}
              </div>
              <button
                onClick={() => setStep((s) => s - 1)}
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground text-sm font-medium transition-colors mt-6 min-h-[44px]"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>
            </div>
          )}

          {/* ── Step 3: Timeline ── */}
          {step === 3 && (
            <div>
              <p className="text-gold-dark font-semibold text-xs uppercase tracking-widest mb-4">
                Step 3 — Timeline
              </p>
              <h1 className="text-[26px] sm:text-3xl md:text-4xl font-bold text-foreground mb-2 leading-tight">
                When are you hoping to move?
              </h1>
              <p className="text-muted-foreground mb-1">
                Tap your answer — no overthinking needed.
              </p>
              <p className="text-xs text-muted-foreground/70 bg-secondary border border-border rounded-lg px-3 py-2 mb-6 inline-block">
                💡 This adjusts the pace of your journey plan. You can always update it later.
              </p>
              <div className="flex flex-col gap-3">
                {TIMELINE_OPTIONS.map(({ label, hint }) => (
                  <button
                    key={label}
                    onClick={() => selectAndAdvance("timeline", label)}
                    className={`text-left px-5 py-4 rounded-xl border flex items-center justify-between gap-3 transition-all min-h-[64px] ${
                      answers.timeline === label
                        ? "border-primary bg-primary text-white shadow-md"
                        : "border-border bg-card text-foreground hover:border-primary/60 hover:bg-secondary"
                    }`}
                  >
                    <div>
                      <p className="font-semibold text-sm">{label}</p>
                      <p className={`text-xs mt-0.5 ${answers.timeline === label ? "text-white/70" : "text-muted-foreground"}`}>
                        {hint}
                      </p>
                    </div>
                    {answers.timeline === label && <CheckCircle2 className="w-5 h-5 shrink-0" />}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setStep((s) => s - 1)}
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground text-sm font-medium transition-colors mt-6 min-h-[44px]"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>
            </div>
          )}

          {/* ── Step 4: Experience ── */}
          {step === 4 && (
            <div>
              <p className="text-gold-dark font-semibold text-xs uppercase tracking-widest mb-4">
                Step 4 — Experience
              </p>
              <h1 className="text-[26px] sm:text-3xl md:text-4xl font-bold text-foreground mb-2 leading-tight">
                Have you bought a home before?
              </h1>
              <p className="text-muted-foreground mb-1">
                Be honest — this shapes how your agent guides you.
              </p>
              <p className="text-xs text-muted-foreground/70 bg-secondary border border-border rounded-lg px-3 py-2 mb-6 inline-block">
                💡 First-time buyers get more hand-holding. Experienced buyers get a faster track.
              </p>
              <div className="flex flex-col gap-3">
                {EXPERIENCE_OPTIONS.map(({ label, hint }) => (
                  <button
                    key={label}
                    onClick={() => selectAndAdvance("experience", label)}
                    className={`text-left px-5 py-4 rounded-xl border flex items-center justify-between gap-3 transition-all min-h-[64px] ${
                      answers.experience === label
                        ? "border-primary bg-primary text-white shadow-md"
                        : "border-border bg-card text-foreground hover:border-primary/60 hover:bg-secondary"
                    }`}
                  >
                    <div>
                      <p className="font-semibold text-sm">{label}</p>
                      <p className={`text-xs mt-0.5 ${answers.experience === label ? "text-white/70" : "text-muted-foreground"}`}>
                        {hint}
                      </p>
                    </div>
                    {answers.experience === label && <CheckCircle2 className="w-5 h-5 shrink-0" />}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setStep((s) => s - 1)}
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground text-sm font-medium transition-colors mt-6 min-h-[44px]"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>
            </div>
          )}

          {/* ── Step 5: Communication style ── */}
          {step === 5 && (
            <div>
              <p className="text-gold-dark font-semibold text-xs uppercase tracking-widest mb-4">
                Step 5 — Last one!
              </p>
              <h1 className="text-[26px] sm:text-3xl md:text-4xl font-bold text-foreground mb-2 leading-tight">
                How do you like to communicate?
              </h1>
              <p className="text-muted-foreground mb-1">
                We&apos;ll match you with an agent who works the same way.
              </p>
              <p className="text-xs text-muted-foreground/70 bg-secondary border border-border rounded-lg px-3 py-2 mb-6 inline-block">
                💡 Your agent will use your preferred channel — no surprise phone calls.
              </p>
              <div className="grid grid-cols-2 gap-3">
                {COM_OPTIONS.map(({ label, hint }) => (
                  <button
                    key={label}
                    onClick={() => selectAndAdvance("comStyle", label)}
                    className={`text-left px-4 py-4 rounded-xl border transition-all ${
                      answers.comStyle === label
                        ? "border-primary bg-primary text-white shadow-md scale-[0.98]"
                        : "border-border bg-card text-foreground hover:border-primary/60 hover:bg-secondary"
                    }`}
                  >
                    <p className="font-semibold text-sm">{label}</p>
                    <p className={`text-xs mt-1 leading-snug ${answers.comStyle === label ? "text-white/70" : "text-muted-foreground"}`}>
                      {hint}
                    </p>
                  </button>
                ))}
              </div>
              <button
                onClick={() => setStep((s) => s - 1)}
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground text-sm font-medium transition-colors mt-6 min-h-[44px]"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
