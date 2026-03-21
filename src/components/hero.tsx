import Link from "next/link";
import { ArrowRight, CheckCircle2, Star, Bed, Bath, Square } from "lucide-react";

const stats = [
  { value: "12,400+", label: "Homes closed" },
  { value: "4.9 / 5", label: "Agent rating" },
  { value: "< 5 min", label: "To your first match" },
];

export default function Hero() {
  return (
    <section className="relative min-h-[92vh] flex flex-col overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1920&q=90"
          alt="Stunning luxury home with pool at dusk"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/97 via-slate-900/85 to-slate-900/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
      </div>

      {/* Main content */}
      <div className="relative flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center w-full">
        <div className="grid lg:grid-cols-2 gap-12 xl:gap-24 items-center w-full py-16 sm:py-20 md:py-28 lg:py-32">

          {/* Left: Text */}
          <div>
            {/* Social proof — live activity signal */}
            <div className="flex items-center gap-2.5 mb-5">
              <div className="flex -space-x-1.5">
                {["bg-violet-500", "bg-amber-500", "bg-teal-500"].map((bg, i) => (
                  <div key={i} className={`w-6 h-6 ${bg} rounded-full ring-2 ring-slate-950 flex items-center justify-center text-white font-bold text-[9px]`}>
                    {["M", "J", "S"][i]}
                  </div>
                ))}
              </div>
              <span className="text-white/55 text-[13px]">
                <span className="text-white/85 font-semibold">4 buyers</span> matched in Austin this week
              </span>
            </div>

            <div className="inline-flex items-center gap-2 bg-white/[0.08] border border-white/[0.12] backdrop-blur-sm rounded-full px-4 py-1.5 mb-6">
              <CheckCircle2 className="w-3.5 h-3.5 text-gold-text" />
              <span className="text-white/80 text-[13px] font-medium">Trusted by 10,000+ home buyers</span>
            </div>

            <h1 className="text-[36px] sm:text-5xl md:text-6xl lg:text-[68px] font-extrabold text-white leading-[1.05] tracking-[-0.04em] mb-6">
              Find your<br />
              <span className="text-gold-text">dream home.</span>
            </h1>

            <p className="text-[16px] sm:text-[17px] text-white/60 leading-relaxed mb-8 sm:mb-10 max-w-md">
              Your personal guide from first search to closing day — a matched agent, clear steps, and zero jargon.
            </p>

            <div className="flex flex-col gap-3 mb-8 sm:mb-12">
              <Link
                href="/onboarding"
                className="inline-flex items-center justify-center gap-2 bg-gold hover:bg-gold-hover text-white font-semibold text-[15px] px-8 py-4 rounded-xl transition-all shadow-[0_4px_24px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.15)] w-full sm:w-auto sm:self-start"
              >
                Start My Journey — It&apos;s Free
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/search"
                className="text-white/35 hover:text-white/60 text-sm transition-colors sm:pl-1"
              >
                or browse homes first →
              </Link>
            </div>

            <div className="flex flex-wrap gap-x-5 gap-y-2">
              {["No pressure", "No cold calls", "Matched in minutes"].map((t) => (
                <span key={t} className="flex items-center gap-1.5 text-white/50 text-sm">
                  <CheckCircle2 className="w-3.5 h-3.5 text-gold-text shrink-0" />
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Right: Floating property card */}
          <div className="hidden lg:block">
            <div className="rounded-[20px] overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.7)] ring-1 ring-white/[0.08]">
              {/* Photo */}
              <div className="relative h-72">
                <img
                  src="https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=800&q=80"
                  alt="Luxury home interior"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                <span className="absolute top-4 left-4 bg-gold text-white text-[11px] font-bold px-3 py-1.5 rounded-full tracking-wide shadow-lg">
                  ✦ Featured
                </span>
                <div className="absolute bottom-4 left-4 right-4">
                  <p className="text-white font-bold text-[30px] tracking-tight leading-none">$2,150,000</p>
                  <p className="text-white/65 text-[13px] mt-1.5">742 Oceanview Drive, Malibu, CA</p>
                </div>
              </div>

              {/* Card body */}
              <div className="bg-white/[0.07] backdrop-blur-2xl border-t border-white/[0.08] p-5">
                <div className="flex items-center gap-5 text-white/70 text-[13px]">
                  <span className="flex items-center gap-1.5">
                    <Bed className="w-3.5 h-3.5 text-white/40" />4 beds
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Bath className="w-3.5 h-3.5 text-white/40" />3 baths
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Square className="w-3.5 h-3.5 text-white/40" />3,200 sqft
                  </span>
                </div>
                <div className="mt-4 pt-4 border-t border-white/[0.08] flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 bg-violet-500 rounded-[10px] flex items-center justify-center text-white font-bold text-xs shadow-sm">
                      PA
                    </div>
                    <div>
                      <p className="text-white text-[13px] font-semibold">Paloma Aguilar</p>
                      <div className="flex items-center gap-1 mt-0.5">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        <span className="text-white/50 text-xs">4.9 · Your matched agent</span>
                      </div>
                    </div>
                  </div>
                  <Link
                    href="/onboarding"
                    className="bg-gold hover:bg-gold-hover text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors shadow-sm"
                  >
                    Schedule Tour
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom stats bar */}
      <div className="relative bg-black/50 backdrop-blur-md border-t border-white/[0.08]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="grid grid-cols-3 sm:flex sm:divide-x sm:divide-white/[0.08]">
            {stats.map(({ value, label }) => (
              <div key={label} className="flex flex-col items-start sm:px-10 first:pl-0 last:pr-0">
                <span className="text-white font-bold text-xl sm:text-2xl tracking-tight">{value}</span>
                <span className="text-white/40 text-[11px] sm:text-xs mt-0.5 font-medium leading-tight">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
