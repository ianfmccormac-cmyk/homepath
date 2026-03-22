import { Quote, Star } from "lucide-react";

const additionalReviews = [
  {
    initials: "JL",
    name: "Jordan L.",
    location: "Denver, CO",
    bg: "bg-amber-500",
    text: "Closed in 38 days. The agent HomePath matched me with was absolutely perfect for our situation.",
  },
  {
    initials: "SK",
    name: "Simone K.",
    location: "Miami, FL",
    bg: "bg-teal-500",
    text: "I was terrified to buy alone. HomePath made every step feel completely manageable.",
  },
];

export default function Testimonial() {
  return (
    <section className="relative bg-primary py-24 md:py-32 lg:py-40 overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0 opacity-[0.1]">
        <img
          src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1920&q=80"
          alt=""
          className="w-full h-full object-cover"
        />
      </div>

      {/* Glows */}
      <div className="absolute bottom-0 left-0 w-[700px] h-[700px] bg-gold/[0.07] rounded-full blur-3xl translate-y-1/2 -translate-x-1/3 pointer-events-none" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-violet-500/[0.06] rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">

        {/* Stars */}
        <div className="flex justify-center gap-1 mb-6">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
          ))}
        </div>

        {/* Quote */}
        <blockquote className="text-[21px] md:text-[30px] lg:text-[34px] font-medium text-white leading-[1.45] mb-10 max-w-3xl mx-auto tracking-tight">
          &ldquo;I had no idea where to start. HomePath walked me through every
          step and matched me with Paloma in minutes. We closed in{" "}
          <span className="text-gold-text font-bold">47 days</span> on my first home.
          I&rsquo;d never have made it without this.&rdquo;
        </blockquote>

        {/* Author */}
        <div className="flex flex-col items-center gap-2 mb-12">
          <div className="w-12 h-12 bg-violet-500 rounded-full flex items-center justify-center text-white font-bold text-sm ring-2 ring-white/10 mb-1">
            CM
          </div>
          <p className="text-white font-semibold text-[15px]">Carlos M.</p>
          <p className="text-white/40 text-[13px]">First-time buyer &middot; Austin, TX</p>
        </div>

        {/* Outcome stats */}
        <div className="bg-white/[0.05] backdrop-blur-sm border border-white/[0.08] rounded-2xl overflow-hidden max-w-sm mx-auto mb-14">
          <div className="grid grid-cols-3 divide-x divide-white/[0.08]">
            {[
              { value: "47 days", label: "To closing" },
              { value: "$412K",   label: "Home price" },
              { value: "1st",     label: "Home ever" },
            ].map(({ value, label }) => (
              <div key={label} className="px-4 py-5 flex flex-col items-center gap-1">
                <span className="text-white font-bold text-[18px] tracking-tight">{value}</span>
                <span className="text-white/35 text-[11px] font-medium uppercase tracking-wide">{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Mini reviews */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-2xl mx-auto">
          {additionalReviews.map(({ initials, name, location, bg, text }) => (
            <div
              key={name}
              className="flex-1 bg-white/[0.04] border border-white/[0.07] rounded-2xl p-5 text-left hover:bg-white/[0.07] transition-colors duration-200"
            >
              {/* Stars */}
              <div className="flex gap-0.5 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-white/60 text-[13px] leading-relaxed mb-4">&ldquo;{text}&rdquo;</p>
              <div className="flex items-center gap-2.5">
                <div className={`w-7 h-7 ${bg} rounded-full flex items-center justify-center text-white font-bold text-[11px] shrink-0`}>
                  {initials}
                </div>
                <div>
                  <p className="text-white/85 text-[13px] font-semibold leading-none">{name}</p>
                  <p className="text-white/35 text-[11px] mt-0.5">{location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
