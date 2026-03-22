import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function CtaBanner() {
  return (
    <section className="relative overflow-hidden py-24 md:py-32 lg:py-40 bg-slate-950">
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1920&q=80"
          alt=""
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-slate-950/90" />
      </div>

      {/* Glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-emerald-500/[0.07] rounded-full blur-[80px]" />
      </div>

      <div className="relative max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">

        <p className="text-white/30 text-[12px] font-bold uppercase tracking-[0.14em] mb-6">
          Get started today
        </p>

        <h2 className="text-[32px] sm:text-[48px] md:text-[56px] font-extrabold text-white tracking-tight leading-[1.04] mb-6">
          Your home is out there.<br />Let&apos;s find it.
        </h2>

        <p className="text-white/45 text-[17px] mb-10 max-w-md mx-auto leading-relaxed">
          Answer 5 questions. Get matched to a top local agent.
          Know exactly what happens next.
        </p>

        <Link
          href="/onboarding"
          className="inline-flex items-center gap-2.5 bg-gold hover:bg-gold-hover active:scale-[0.98] text-white font-bold text-[16px] px-10 py-4 rounded-xl transition-all duration-200 shadow-[0_0_60px_rgba(5,150,105,0.3)]"
        >
          Get Matched Free
          <ArrowRight className="w-4 h-4" />
        </Link>

        <p className="mt-5 text-white/25 text-[13px]">
          No commitment &middot; No cold calls &middot; Takes 5 minutes
        </p>
      </div>
    </section>
  );
}
