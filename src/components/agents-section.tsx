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

export default function AgentsSection() {
  return (
    <section className="bg-background py-16 sm:py-20 md:py-28 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10 md:mb-16">
          <p className="text-gold-dark font-semibold text-xs uppercase tracking-[0.12em] mb-3">
            Vetted agents
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight">
            Work with agents who{" "}
            <span className="text-primary">actually show up</span>
          </h2>
          <p className="mt-4 text-muted-foreground text-[17px] max-w-xl mx-auto leading-relaxed">
            Every agent on HomePath is vetted, reviewed, and matched to buyers
            based on compatibility — not just availability.
          </p>
        </div>

        {/* Agent cards */}
        <div className="grid md:grid-cols-3 gap-5">
          {agents.map((agent) => (
            <div
              key={agent.name}
              className="bg-card rounded-2xl ring-1 ring-black/[0.07] overflow-hidden hover:shadow-[0_16px_48px_rgba(0,0,0,0.12)] transition-all duration-500 group hover:-translate-y-1"
            >
              {/* Photo header */}
              <div className="relative h-64 overflow-hidden">
                <img
                  src={agent.photo}
                  alt={agent.name}
                  className="w-full h-full object-cover object-top transition-transform duration-700 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-hover:scale-[1.04]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                <span className={`absolute top-4 right-4 ${agent.badgeColor} text-white text-[11px] font-bold px-3 py-1.5 rounded-full flex items-center gap-1 shadow-lg tracking-wide`}>
                  <Award className="w-3 h-3" />
                  {agent.badge}
                </span>
                <div className="absolute bottom-4 left-4 right-4">
                  <p className="text-white font-bold text-[18px] leading-tight">{agent.name}</p>
                  <div className="flex items-center gap-1.5 mt-1">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-3 h-3 ${i < Math.floor(agent.rating) ? "fill-amber-400 text-amber-400" : "fill-white/20 text-white/20"}`} />
                      ))}
                    </div>
                    <span className="text-white/90 text-[13px] font-semibold">{agent.rating}</span>
                    <span className="text-white/45 text-xs">({agent.reviews})</span>
                  </div>
                </div>
              </div>

              {/* Card body */}
              <div className="p-5 flex flex-col gap-4">
                <div className="flex flex-col gap-2.5">
                  <div className="flex items-center gap-2 text-[13px] text-muted-foreground">
                    <MapPin className="w-3.5 h-3.5 shrink-0 text-gold" />
                    {agent.location}
                  </div>
                  <div className="flex items-center gap-2 text-[13px] text-muted-foreground">
                    <TrendingUp className="w-3.5 h-3.5 shrink-0 text-gold" />
                    {agent.sales} homes sold · {agent.recentSale}
                  </div>
                  <div className="flex items-center gap-2 text-[13px] text-muted-foreground">
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-gold" />
                    Specializes in {agent.specialty}
                  </div>
                  <div className="flex items-center gap-2 text-[13px] text-muted-foreground">
                    <Clock className="w-3.5 h-3.5 shrink-0 text-gold" />
                    Usually replies in {agent.responseTime}
                  </div>
                </div>

                <Link
                  href={agent.href}
                  className="mt-1 inline-flex items-center justify-center gap-2 bg-primary text-white font-semibold text-[13px] py-3 rounded-xl hover:bg-primary/90 transition-all shadow-[0_1px_3px_rgba(0,0,0,0.15)] group/btn"
                >
                  View Profile
                  <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Footer CTA */}
        <div className="text-center mt-12">
          <Link
            href="/onboarding"
            className="inline-flex items-center gap-2 text-primary font-semibold text-[15px] hover:gap-3 transition-all group"
          >
            Get matched with my agent
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}
