import Link from "next/link";
import { Star, MapPin, TrendingUp, ArrowRight, Award, CheckCircle2, Clock } from "lucide-react";

const agents = [
  {
    photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80",
    name: "Paloma Aguilar",
    rating: 4.9,
    reviews: 87,
    sales: 52,
    location: "Austin, TX",
    specialty: "First-time buyers",
    badge: "Best Match",
    badgeColor: "bg-gold",
    href: "/realtors/paloma-aguilar",
    recentSale: "$485K · Oak St",
    responseTime: "< 1 hr",
  },
  {
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
    name: "Marcus Rivera",
    rating: 4.8,
    reviews: 61,
    sales: 44,
    location: "Denver, CO",
    specialty: "Investment & relocation",
    badge: "Top Rated",
    badgeColor: "bg-amber-500",
    href: "/realtors/marcus-rivera",
    recentSale: "$672K · Summit Rd",
    responseTime: "< 2 hrs",
  },
  {
    photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80",
    name: "Priya Kapoor",
    rating: 5.0,
    reviews: 103,
    sales: 67,
    location: "Miami, FL",
    specialty: "Luxury & condos",
    badge: "Top Closer",
    badgeColor: "bg-violet-500",
    href: "/realtors/priya-kapoor",
    recentSale: "$4.5M · Beachfront",
    responseTime: "< 30 min",
  },
];

const STATS = [
  { icon: MapPin,        key: "location" as const },
  { icon: TrendingUp,    key: "sales" as const },
  { icon: CheckCircle2,  key: "specialty" as const },
  { icon: Clock,         key: "responseTime" as const },
];

export default function AgentsSection() {
  return (
    <section className="bg-background py-24 md:py-32 lg:py-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-16 md:mb-20">
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-3.5 py-1.5 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span className="text-emerald-700 text-[11px] font-bold tracking-widest uppercase">Vetted agents</span>
          </div>
          <h2 className="text-[32px] md:text-[44px] font-extrabold text-foreground tracking-tight leading-[1.08] mb-5">
            Work with agents who{" "}
            <span className="text-primary">actually show up</span>
          </h2>
          <p className="text-muted-foreground text-[17px] max-w-[500px] mx-auto leading-relaxed">
            Every agent on HomePath is vetted, reviewed, and matched to buyers
            based on compatibility — not just availability.
          </p>
        </div>

        {/* Agent cards */}
        <div className="grid md:grid-cols-3 gap-5 lg:gap-6">
          {agents.map((agent) => (
            <div
              key={agent.name}
              className="bg-card rounded-2xl ring-1 ring-black/[0.06] overflow-hidden hover:shadow-[0_20px_60px_rgba(0,0,0,0.13)] hover:-translate-y-1 transition-all duration-300 group flex flex-col"
            >
              {/* Photo */}
              <div className="relative h-60 overflow-hidden shrink-0">
                <img
                  src={agent.photo}
                  alt={agent.name}
                  className="w-full h-full object-cover object-top transition-transform duration-700 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-hover:scale-[1.05]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />

                {/* Badge */}
                <span className={`absolute top-3.5 right-3.5 ${agent.badgeColor} text-white text-[11px] font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-lg tracking-wide`}>
                  <Award className="w-3 h-3" />
                  {agent.badge}
                </span>

                {/* Name + rating overlay */}
                <div className="absolute bottom-4 left-4 right-4">
                  <p className="text-white font-bold text-[18px] leading-tight tracking-tight">{agent.name}</p>
                  <div className="flex items-center gap-1.5 mt-1.5">
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3 h-3 ${i < Math.floor(agent.rating) ? "fill-amber-400 text-amber-400" : "fill-white/20 text-white/20"}`}
                        />
                      ))}
                    </div>
                    <span className="text-white/90 text-[13px] font-semibold">{agent.rating}</span>
                    <span className="text-white/40 text-xs">({agent.reviews} reviews)</span>
                  </div>
                </div>
              </div>

              {/* Body */}
              <div className="p-6 flex flex-col gap-5 flex-1">
                {/* Stat list */}
                <div className="flex flex-col gap-2.5">
                  <div className="flex items-center gap-2.5 text-[13px] text-muted-foreground">
                    <MapPin className="w-3.5 h-3.5 shrink-0 text-gold" />
                    {agent.location}
                  </div>
                  <div className="flex items-center gap-2.5 text-[13px] text-muted-foreground">
                    <TrendingUp className="w-3.5 h-3.5 shrink-0 text-gold" />
                    {agent.sales} homes sold &middot; {agent.recentSale}
                  </div>
                  <div className="flex items-center gap-2.5 text-[13px] text-muted-foreground">
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-gold" />
                    Specializes in {agent.specialty}
                  </div>
                  <div className="flex items-center gap-2.5 text-[13px] text-muted-foreground">
                    <Clock className="w-3.5 h-3.5 shrink-0 text-gold" />
                    Usually replies in {agent.responseTime}
                  </div>
                </div>

                {/* CTA */}
                <Link
                  href={agent.href}
                  className="mt-auto inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 active:scale-[0.98] text-primary-foreground font-semibold text-[13px] py-3 rounded-xl transition-all duration-200 shadow-[0_1px_3px_rgba(0,0,0,0.15)] group/btn"
                >
                  View Profile
                  <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform duration-200" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Footer CTA */}
        <div className="text-center mt-14">
          <Link
            href="/onboarding"
            className="inline-flex items-center gap-2 text-primary font-semibold text-[15px] hover:gap-3 transition-all duration-200 group"
          >
            Get matched with my agent
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}
