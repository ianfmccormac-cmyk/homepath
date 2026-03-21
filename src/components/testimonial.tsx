import { Quote } from "lucide-react";

const additionalReviews = [
  { initials: "JL", name: "Jordan L.", bg: "bg-amber-500", text: "Closed in 38 days. The agent Paloma matched me with was absolutely perfect." },
  { initials: "SK", name: "Simone K.", bg: "bg-teal-500", text: "I was terrified to buy alone. HomePath made it feel completely manageable." },
];

export default function Testimonial() {
  return (
    <section className="relative bg-primary py-24 md:py-32 overflow-hidden">
      {/* Background luxury property image */}
      <div className="absolute inset-0 opacity-[0.12]">
        <img
          src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1920&q=80"
          alt=""
          className="w-full h-full object-cover"
        />
      </div>
      {/* Background glow */}
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gold/[0.08] rounded-full blur-3xl translate-y-1/2 -translate-x-1/3 pointer-events-none" />
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-violet-500/[0.06] rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <Quote className="w-10 h-10 text-gold-text/30 mx-auto mb-8" />

        <blockquote className="text-[22px] md:text-[32px] font-medium text-white leading-[1.4] mb-10 max-w-3xl mx-auto">
          &ldquo;I had no idea where to start. HomePath walked me through every
          step and matched me with Paloma in minutes. We closed in{" "}
          <span className="text-gold-text font-bold">47 days</span> on my first home.
          I&rsquo;d never have made it without this.&rdquo;
        </blockquote>

        {/* Author */}
        <div className="flex flex-col items-center gap-2 mb-12">
          <div className="w-12 h-12 bg-violet-500 rounded-full flex items-center justify-center text-white font-bold text-sm mb-1 ring-2 ring-white/10">
            CM
          </div>
          <p className="text-white font-semibold text-[15px]">Carlos M.</p>
          <p className="text-white/45 text-sm">First-time buyer · Austin, TX</p>
        </div>

        {/* Outcome stats */}
        <div className="bg-white/[0.06] backdrop-blur-sm border border-white/[0.08] rounded-2xl overflow-hidden max-w-xs mx-auto mb-14">
          <div className="grid grid-cols-3 divide-x divide-white/[0.08]">
            {[
              { value: "47 days", label: "To closing" },
              { value: "$412K", label: "Home price" },
              { value: "1st", label: "Home ever" },
            ].map(({ value, label }) => (
              <div key={label} className="px-4 py-5 flex flex-col items-center">
                <span className="text-white font-bold text-[17px] tracking-tight">{value}</span>
                <span className="text-white/40 text-[11px] mt-0.5 font-medium">{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Additional mini-reviews */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-2xl mx-auto">
          {additionalReviews.map(({ initials, name, bg, text }) => (
            <div key={name} className="flex-1 bg-white/[0.05] border border-white/[0.08] rounded-2xl p-4 text-left">
              <div className="flex items-center gap-2.5 mb-3">
                <div className={`w-7 h-7 ${bg} rounded-full flex items-center justify-center text-white font-bold text-[11px] shrink-0`}>
                  {initials}
                </div>
                <span className="text-white/80 text-[13px] font-semibold">{name}</span>
              </div>
              <p className="text-white/50 text-[13px] leading-relaxed">&ldquo;{text}&rdquo;</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
