import React from "react";
import Link from "next/link";
import { ArrowRight, Check, Calendar, Star } from "lucide-react";

const STEPS = [
  { label: "Tell us your preferences",  done: true },
  { label: "Get matched with an agent", done: true },
  { label: "Tour your top picks",       active: true },
  { label: "Make the right offer",      done: false },
  { label: "Close on your home",        done: false },
];

const STATS = [
  { value: "12,400+", label: "Homes closed" },
  { value: "4.9 / 5",  label: "Avg. agent rating" },
  { value: "< 5 min",  label: "To your first match" },
];

export default function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col bg-slate-950 overflow-hidden">

      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[700px] h-[700px] bg-emerald-500/[0.06] rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-sky-500/[0.04] rounded-full blur-[120px]" />
        {/* Subtle grid */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      {/* Main content */}
      <div className="relative flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center w-full">
        <div className="grid lg:grid-cols-[1fr_1.15fr] gap-16 xl:gap-28 items-center w-full py-24 lg:py-32">

          {/* ── Left: Copy ── */}
          <div>
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-3.5 py-1.5 mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-emerald-400 text-[11px] font-bold tracking-widest uppercase">
                Always free for buyers
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-[44px] sm:text-5xl lg:text-[58px] xl:text-[66px] font-extrabold text-white leading-[1.04] tracking-[-0.04em] mb-6">
              Your agent.<br />
              Your roadmap.<br />
              <span className="text-gold-text">Your keys.</span>
            </h1>

            {/* Subheadline */}
            <p className="text-[17px] text-white/50 leading-relaxed mb-10 max-w-[400px]">
              Answer 5 questions. Get matched to a top local agent. See every step between now and closing day — clearly.
            </p>

            {/* Single CTA */}
            <Link
              href="/onboarding"
              className="inline-flex items-center justify-center gap-2.5 bg-gold hover:bg-gold-hover text-white font-bold text-[16px] px-8 py-4 rounded-xl transition-all duration-200 shadow-[0_0_48px_rgba(5,150,105,0.3)] w-full sm:w-auto"
            >
              Get Matched Free
              <ArrowRight className="w-4 h-4" />
            </Link>

            {/* Micro-trust signals */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2.5 mt-8">
              {["No cold calls", "No commission from you", "Matched in under 5 min"].map((t) => (
                <span key={t} className="flex items-center gap-1.5 text-white/30 text-[13px]">
                  <Check className="w-3.5 h-3.5 text-emerald-600/70 shrink-0" />
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* ── Right: Product preview ── */}
          <div className="hidden lg:block">
            <div className="rounded-2xl overflow-hidden ring-1 ring-white/[0.08] shadow-[0_48px_120px_rgba(0,0,0,0.8),inset_0_1px_0_rgba(255,255,255,0.05)] bg-[#0d1117]">

              {/* Browser chrome */}
              <div className="bg-[#161b22] border-b border-white/[0.06] px-4 py-3 flex items-center gap-3">
                <div className="flex gap-1.5 shrink-0">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
                </div>
                <div className="flex-1 bg-[#0d1117] border border-white/[0.06] rounded-md px-3 py-1 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                  <span className="text-white/25 text-[11px] font-mono tracking-tight">homepath.io/dashboard</span>
                </div>
              </div>

              {/* Dashboard */}
              <div className="p-6 space-y-5">

                {/* Header row */}
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-white/30 text-[10px] font-semibold uppercase tracking-widest mb-1">Buyer Dashboard</p>
                    <h3 className="text-white font-bold text-[20px] tracking-tight">Your Journey</h3>
                  </div>
                  <div className="bg-gold/10 border border-gold/25 rounded-full px-3 py-1 shrink-0">
                    <span className="text-gold-text text-[11px] font-bold">Step 3 of 5</span>
                  </div>
                </div>

                {/* Progress bar — animates in on load */}
                <div className="w-full bg-white/[0.05] rounded-full h-1 overflow-hidden">
                  <div
                    className="bg-gold h-1 rounded-full animate-progress"
                    style={{ "--progress-width": "40%" } as React.CSSProperties}
                  />
                </div>

                {/* Steps */}
                <div className="space-y-2">
                  {STEPS.map((step, i) => (
                    <div
                      key={i}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                        step.active
                          ? "bg-gold/[0.08] border border-gold/[0.18]"
                          : ""
                      }`}
                    >
                      {/* Step indicator */}
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-[10px] font-bold transition-all ${
                          step.done
                            ? "bg-gold/15 border border-gold/30"
                            : step.active
                            ? "bg-gold shadow-[0_0_10px_rgba(5,150,105,0.5)]"
                            : "bg-white/[0.04] border border-white/[0.08]"
                        }`}
                      >
                        {step.done ? (
                          <Check className="w-2.5 h-2.5 text-gold-text" />
                        ) : step.active ? (
                          <div className="w-1.5 h-1.5 bg-white rounded-full" />
                        ) : (
                          <span className="text-white/20">{i + 1}</span>
                        )}
                      </div>

                      {/* Label */}
                      <span
                        className={`text-[12.5px] font-medium flex-1 ${
                          step.done
                            ? "text-white/30 line-through"
                            : step.active
                            ? "text-white"
                            : "text-white/25"
                        }`}
                      >
                        {step.label}
                      </span>

                      {step.active && (
                        <span className="text-[10px] font-bold text-gold-text bg-gold/15 px-2 py-0.5 rounded-full shrink-0">
                          Now
                        </span>
                      )}
                    </div>
                  ))}
                </div>

                {/* Matched agent card */}
                <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-violet-500 flex items-center justify-center text-white font-bold text-sm shrink-0">
                    PA
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-semibold text-[13px]">Paloma Aguilar</p>
                    <div className="flex items-center gap-1 mt-0.5">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      <span className="text-white/35 text-[11px]">4.9 · 143 closings · Austin, TX</span>
                    </div>
                  </div>
                  <div className="bg-gold hover:bg-gold-hover text-white text-[11px] font-semibold px-3 py-1.5 rounded-lg cursor-pointer transition-colors shrink-0">
                    Message
                  </div>
                </div>

                {/* Next action prompt */}
                <div className="bg-gold/[0.06] border border-gold/[0.12] rounded-xl p-4 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gold/15 flex items-center justify-center shrink-0">
                    <Calendar className="w-3.5 h-3.5 text-gold-text" />
                  </div>
                  <div>
                    <p className="text-white text-[13px] font-semibold">Schedule your first tour</p>
                    <p className="text-white/35 text-[11px] mt-0.5">3 homes shortlisted · Paloma is ready</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats bar */}
      <div className="relative border-t border-white/[0.05]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-wrap items-center justify-between gap-5">

            <div className="flex flex-wrap gap-x-10 gap-y-2">
              {STATS.map(({ value, label }) => (
                <div key={label} className="flex items-baseline gap-2">
                  <span className="text-white font-bold text-[18px] tracking-tight">{value}</span>
                  <span className="text-white/25 text-[12px]">{label}</span>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2.5">
              <div className="flex -space-x-1.5">
                {["bg-violet-500", "bg-amber-500", "bg-teal-500", "bg-rose-400"].map((bg, i) => (
                  <div key={i} className={`w-6 h-6 ${bg} rounded-full ring-2 ring-slate-950`} />
                ))}
              </div>
              <span className="text-white/30 text-[12px]">
                <span className="text-white/55 font-semibold">4 buyers</span> matched today in Austin
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
