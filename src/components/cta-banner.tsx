import Link from "next/link";
import { ArrowRight, ShieldCheck, Clock, Users } from "lucide-react";

const trust = [
  { icon: ShieldCheck, label: "No commitment required" },
  { icon: Clock, label: "Takes 5 minutes" },
  { icon: Users, label: "10,000+ buyers matched" },
];

export default function CtaBanner() {
  return (
    <section className="relative overflow-hidden py-16 sm:py-20 md:py-28 lg:py-32 bg-slate-950">
      {/* Background luxury home */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1920&q=80"
          alt=""
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/97 via-slate-950/85 to-slate-950/65" />
      </div>

      <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-gold-text font-semibold text-xs uppercase tracking-[0.12em] mb-5">
          Your next chapter starts here
        </p>
        <h2 className="text-[30px] sm:text-4xl md:text-[52px] font-extrabold text-white tracking-tight mb-5 leading-[1.05]">
          Ready to find the home{" "}<br className="hidden sm:block" />you&apos;ve always wanted?
        </h2>
        <p className="text-white/55 text-[16px] sm:text-[17px] mb-8 sm:mb-10 max-w-xl mx-auto leading-relaxed">
          Get matched with a top local agent in minutes. No commitment, no cold
          calls — just a clear, guided path to closing day.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
          <Link
            href="/onboarding"
            className="inline-flex items-center justify-center gap-2 bg-gold hover:bg-gold-hover text-white font-bold text-[15px] px-9 py-4 rounded-xl transition-all shadow-[0_4px_24px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.15)] min-h-[52px]"
          >
            Get Started — It&apos;s Free
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/search"
            className="inline-flex items-center justify-center gap-2 bg-white/[0.07] hover:bg-white/[0.12] backdrop-blur-sm text-white font-semibold text-[15px] px-9 py-4 rounded-xl border border-white/[0.12] hover:border-white/[0.2] transition-all min-h-[52px]"
          >
            Browse Homes
          </Link>
        </div>

        {/* Trust badges */}
        <div className="flex flex-wrap items-center justify-center gap-5">
          {trust.map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-1.5 text-white/35 text-[13px]">
              <Icon className="w-3.5 h-3.5" />
              {label}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
