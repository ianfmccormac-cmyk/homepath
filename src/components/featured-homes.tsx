import Link from "next/link";
import { ArrowRight, Bed, Bath, Square, MapPin, ArrowUpRight } from "lucide-react";

const FEATURED = [
  {
    image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=900&q=85",
    price: "$3,200,000",
    address: "1 Pacific Heights Blvd",
    city: "San Francisco, CA",
    beds: 5, baths: 4, sqft: "4,200",
    tag: "Just Listed", tagColor: "bg-gold",
  },
  {
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=700&q=85",
    price: "$1,875,000",
    address: "88 Summit Ridge Drive",
    city: "Aspen, CO",
    beds: 4, baths: 3, sqft: "3,100",
    tag: "Mountain Views", tagColor: "bg-sky-500",
  },
  {
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=700&q=85",
    price: "$4,500,000",
    address: "22 Beachfront Way",
    city: "Miami Beach, FL",
    beds: 6, baths: 5, sqft: "5,800",
    tag: "Waterfront", tagColor: "bg-amber-500",
  },
];

function PropertyCard({ home, tall = false }: { home: (typeof FEATURED)[number]; tall?: boolean }) {
  return (
    <Link
      href="/search"
      className={`relative overflow-hidden rounded-2xl group cursor-pointer ring-1 ring-white/[0.06] block hover:ring-white/[0.16] transition-all duration-300 ${tall ? "h-full" : ""}`}
    >
      <img
        src={home.image}
        alt={home.address}
        className={`w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-hover:scale-[1.05] ${
          tall ? "h-full min-h-[500px]" : "h-64"
        }`}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/92 via-black/10 to-transparent" />

      <span className={`absolute top-4 left-4 ${home.tagColor} text-white text-[11px] font-bold px-3 py-1.5 rounded-full tracking-wide shadow-lg`}>
        {home.tag}
      </span>

      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-200 translate-y-1 group-hover:translate-y-0">
        <div className="bg-white/15 backdrop-blur-md border border-white/20 rounded-full p-2">
          <ArrowUpRight className="w-3.5 h-3.5 text-white" />
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-5">
        <p className="text-white font-bold text-[26px] tracking-tight leading-none">{home.price}</p>
        <p className="text-white/80 text-[13px] font-medium mt-1.5">{home.address}</p>
        <div className="flex items-center gap-1 text-white/45 text-xs mt-0.5">
          <MapPin className="w-3 h-3" />{home.city}
        </div>
        <div className="flex items-center gap-4 mt-4 pt-4 border-t border-white/[0.10] text-white/55 text-[13px]">
          <span className="flex items-center gap-1.5"><Bed className="w-3.5 h-3.5" />{home.beds} bd</span>
          <span className="flex items-center gap-1.5"><Bath className="w-3.5 h-3.5" />{home.baths} ba</span>
          <span className="flex items-center gap-1.5"><Square className="w-3.5 h-3.5" />{home.sqft} sqft</span>
        </div>
      </div>
    </Link>
  );
}

export default function FeaturedHomes() {
  return (
    <section className="bg-slate-950 py-24 md:py-32 lg:py-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5 mb-12">
          <div>
            <p className="text-white/30 text-[12px] font-bold uppercase tracking-[0.14em] mb-4">
              Featured listings
            </p>
            <h2 className="text-[32px] md:text-[44px] font-extrabold text-white tracking-tight leading-[1.06]">
              Homes worth dreaming about
            </h2>
          </div>
          <Link
            href="/search"
            className="shrink-0 inline-flex items-center gap-2 text-white/35 hover:text-white/70 font-medium text-[13px] transition-colors duration-200 group"
          >
            View all listings
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform duration-200" />
          </Link>
        </div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3 lg:grid-rows-2">
          <div className="lg:row-span-2">
            <PropertyCard home={FEATURED[0]} tall />
          </div>
          <div className="lg:col-span-2 grid sm:grid-cols-2 gap-3">
            <PropertyCard home={FEATURED[1]} />
            <PropertyCard home={FEATURED[2]} />
          </div>
        </div>
      </div>
    </section>
  );
}
