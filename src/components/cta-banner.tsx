import Link from "next/link";
import { ArrowRight, ShieldCheck, Clock, Users } from "lucide-react";

const trust = [
  { icon: ShieldCheck, label: "No commitment required" },
  { icon: Clock,       label: "Takes 5 minutes" },
  { icon: Users,       label: "10,000+ buyers matched" },
];

export default function CtaBanner() {
  return (
    <section className="relative overflow-hidden py-24 md:py-32 lg:py-40 bg-slate-950">
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1920&q=80"
          alt=""
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/97 via-slate-950/88 to-slate-950/70" />
      </div>

      <div className="relative max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">

        {/* Eyebrow */}
        <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-3.5 py-1.5 mb-7">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-emerald-400 text-[11px] font-bold tracking-widest uppercase">Your next chapter starts here</span>
        </div>

        {/* Headline */}
        <h2 className="text-[32px] sm:text-[44px] md:text-[52px] font-extrabold text-white tracking-tight leading-[1.05] mb-5">
          Ready to find the home<br className="hidden sm:block" /> you&apos;ve always wanted?
        </h2>

        {/* Subhead */}
        <p className="text-white/50 text-[16px] sm:text-[17px] mb-10 max-w-lg mx-auto leading-relaxed">
          Get matched with a top local agent in minutes. No commitment, no cold
          calls — just a clear, guided path to closing day.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-10">
          <Link
            href="/onboarding"
            className="inline-flex items-center justify-center gap-2.5 bg-gold hover:bg-gold-hover active:scale-[0.98] text-white font-bold text-[15px] px-9 py-4 rounded-xl transition-all duration-200 shadow-[0_0_48px_rgba(5,150,105,0.25)] min-h-[52px]"
          >
            Get Started — It&apos;s Free
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/search"
            className="inline-flex items-center justify-center gap-2 bg-white/[0.06] hover:bg-white/[0.11] active:scale-[0.98] backdrop-blur-sm text-white font-semibold text-[15px] px-9 py-4 rounded-xl border border-white/[0.10] hover:border-white/[0.18] transition-all duration-200 min-h-[52px]"
          >
            Browse Homes
          </Link>
        </div>

        {/* Trust badges */}
        <div className="flex flex-wrap items-center justify-center gap-6">
          {trust.map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-1.5 text-white/30 text-[13px]">
              <Icon className="w-3.5 h-3.5" />
              {label}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
