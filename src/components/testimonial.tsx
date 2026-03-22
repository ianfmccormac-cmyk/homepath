import { Star } from "lucide-react";

export default function Testimonial() {
  return (
    <section className="bg-primary py-24 md:py-32 lg:py-40 overflow-hidden">
      {/* Subtle ambient glow */}
      <div className="absolute left-0 w-[600px] h-[600px] bg-gold/[0.06] rounded-full blur-3xl -translate-x-1/2 pointer-events-none" />

      <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">

        {/* Stars */}
        <div className="flex justify-center gap-1 mb-8">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
          ))}
        </div>

        {/* Quote */}
        <blockquote className="text-[22px] md:text-[32px] lg:text-[36px] font-medium text-white leading-[1.42] mb-12 tracking-tight">
          &ldquo;I had no idea where to start. HomePath walked me through every
          step and matched me with the perfect agent. We closed in{" "}
          <span className="text-gold-text font-bold">47 days</span> on my
          first home.&rdquo;
        </blockquote>

        {/* Author */}
        <div className="flex flex-col items-center gap-1.5 mb-14">
          <div className="w-11 h-11 bg-violet-500 rounded-full flex items-center justify-center text-white font-bold text-[13px] ring-2 ring-white/10 mb-2">
            CM
          </div>
          <p className="text-white font-semibold text-[15px]">Carlos M.</p>
          <p className="text-white/40 text-[13px]">First-time buyer &middot; Austin, TX</p>
        </div>

        {/* Outcome stats */}
        <div className="inline-flex bg-white/[0.04] border border-white/[0.07] rounded-2xl overflow-hidden">
          {[
            { value: "47 days", label: "To closing" },
            { value: "$412K",   label: "Home price" },
            { value: "1st",     label: "Home ever" },
          ].map(({ value, label }, i) => (
            <div
              key={label}
              className={`px-8 py-5 flex flex-col items-center gap-1 ${i > 0 ? "border-l border-white/[0.07]" : ""}`}
            >
              <span className="text-white font-bold text-[20px] tracking-tight">{value}</span>
              <span className="text-white/35 text-[11px] font-medium uppercase tracking-widest">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
