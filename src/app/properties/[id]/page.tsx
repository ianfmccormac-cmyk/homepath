"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/navbar";
import { JargonTip } from "@/components/jargon-tip";
import {
  ArrowLeft,
  Bed,
  Bath,
  Square,
  MapPin,
  Calendar,
  Heart,
  MessageSquare,
  TrendingDown,
  Home,
  CheckCircle2,
  Clock,
  Zap,
} from "lucide-react";
import { useState } from "react";

// ─── Same mock data as search page ────────────────────────────────────────────
const ALL_LISTINGS = [
  { id: 1, price: 485000, address: "124 Oak Street", city: "Austin, TX 78701", beds: 3, baths: 2, sqft: 1850, type: "Single Family", tag: "New", image: "https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?auto=format&fit=crop&w=1200&q=80", daysOnMarket: 2, yearBuilt: 2019, garage: "2-car attached", lot: "0.18 acres", hoa: null, description: "Bright, open-plan home in one of Austin's most walkable neighbourhoods. Soaring 10-ft ceilings, quartz countertops, and a chef's kitchen with gas range. The primary suite has a spa-style bath and a walk-in closet. Covered back porch, xeriscaped yard, and a two-car garage. Walk to coffee shops, parks, and the light-rail stop." },
  { id: 2, price: 672000, address: "55 Maple Avenue", city: "Austin, TX 78704", beds: 4, baths: 3, sqft: 2340, type: "Single Family", tag: "Open House", image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1200&q=80", daysOnMarket: 7, yearBuilt: 2016, garage: "2-car detached", lot: "0.22 acres", hoa: null, description: "Stunning South Austin retreat with designer finishes throughout. The open living area flows to a covered outdoor kitchen — perfect for year-round entertaining. Four generously sized bedrooms, a game room, and a primary suite with dual vanities. Mature oaks shade the private back yard." },
  { id: 3, price: 389000, address: "890 Cedar Lane", city: "Austin, TX 78745", beds: 2, baths: 2, sqft: 1420, type: "Condo", tag: null, image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80", daysOnMarket: 14, yearBuilt: 2021, garage: "1-car assigned", lot: null, hoa: "$285/mo", description: "Lock-and-leave luxury in an amenity-rich building. Floor-to-ceiling windows flood this corner unit with natural light. Upgraded kitchen with waterfall island, in-unit laundry, and a private balcony. Building amenities include a rooftop pool, fitness centre, and co-working lounge." },
  { id: 4, price: 825000, address: "33 Riverside Drive", city: "Austin, TX 78703", beds: 4, baths: 4, sqft: 3100, type: "Single Family", tag: "Price Drop", image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80", daysOnMarket: 21, yearBuilt: 2008, garage: "3-car attached", lot: "0.31 acres", hoa: null, description: "Exceptional Tarrytown estate with river views from the second-floor terrace. Grand entry, formal dining, a chef's kitchen, and a butler's pantry. The primary suite occupies the entire east wing. Infinity pool, spa, and a detached studio — ideal as a guest suite or home office." },
  { id: 5, price: 525000, address: "712 Pine Street", city: "Austin, TX 78702", beds: 3, baths: 2, sqft: 2050, type: "Townhouse", tag: null, image: "https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?auto=format&fit=crop&w=1200&q=80", daysOnMarket: 5, yearBuilt: 2020, garage: "1-car attached", lot: null, hoa: "$195/mo", description: "Modern East Austin townhome in the heart of the action. Three levels of thoughtfully designed living space. Main level open-plan kitchen and living, upper-level primary suite with city views. Rooftop terrace with built-in seating. Steps from restaurants, bars, and music venues on East 6th." },
  { id: 6, price: 299000, address: "1401 Congress Ave", city: "Austin, TX 78701", beds: 1, baths: 1, sqft: 780, type: "Condo", tag: "New", image: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=1200&q=80", daysOnMarket: 1, yearBuilt: 2023, garage: "1-car assigned", lot: null, hoa: "$240/mo", description: "Brand-new downtown pied-à-terre at the corner of Congress and 14th. Polished concrete floors, Bosch appliances, and a juliet balcony. Building concierge, bike storage, and a pet-washing station. Walk score of 98 — everything you need is right outside your door." },
  { id: 7, price: 950000, address: "8 Lakewood Blvd", city: "Austin, TX 78730", beds: 5, baths: 4, sqft: 4200, type: "Single Family", tag: null, image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80", daysOnMarket: 9, yearBuilt: 2014, garage: "3-car attached", lot: "0.52 acres", hoa: "$350/mo", description: "Sprawling lakeside estate in a gated community. Resort-calibre pool with a waterfall grotto, a private boat dock, and over half an acre of manicured grounds. Inside: a two-storey great room, gourmet kitchen, media room, and a dedicated home gym. Top-rated Lake Travis ISD." },
  { id: 8, price: 445000, address: "220 South Lamar", city: "Austin, TX 78704", beds: 2, baths: 2, sqft: 1580, type: "Townhouse", tag: "Open House", image: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=1200&q=80", daysOnMarket: 3, yearBuilt: 2018, garage: "1-car attached", lot: null, hoa: "$175/mo", description: "Sleek South Lamar townhome walking distance to Alamo Drafthouse, BookPeople, and Barton Springs Pool. Hardwood floors, a gourmet kitchen with gas range, and a private rooftop deck. The primary suite is a true retreat with a soaking tub and rainfall shower." },
  { id: 9, price: 615000, address: "500 West 6th St", city: "Austin, TX 78701", beds: 3, baths: 3, sqft: 2120, type: "Condo", tag: null, image: "https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=1200&q=80", daysOnMarket: 18, yearBuilt: 2017, garage: "2-car assigned", lot: null, hoa: "$420/mo", description: "Corner penthouse on the 18th floor with panoramic downtown skyline views. Three split bedrooms each with their own en-suite. Floor-to-ceiling glass, wide-plank oak floors, and a gourmet kitchen with a hidden walk-in pantry. Building amenities include a 25th-floor sky lounge and a resort pool." },
];

function formatPrice(n: number) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
  return `$${(n / 1000).toFixed(0)}K`;
}

const TAG_COLOR: Record<string, string> = {
  New: "bg-gold text-white",
  "Open House": "bg-sky-500 text-white",
  "Price Drop": "bg-amber-500 text-white",
};

export default function PropertyDetailPage() {
  const { id } = useParams<{ id: string }>();
  const listing = ALL_LISTINGS.find((l) => l.id === Number(id));
  const [saved, setSaved] = useState(false);

  if (!listing) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-24 text-center">
          <Home className="w-12 h-12 text-muted-foreground/40 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Listing not found
          </h1>
          <p className="text-muted-foreground mb-6">
            This home may have been removed or the link is incorrect.
          </p>
          <Link
            href="/search"
            className="inline-flex items-center gap-2 bg-primary text-white font-semibold text-sm px-6 py-3 rounded-xl hover:bg-primary/90 transition-all"
          >
            Browse all homes
          </Link>
        </div>
      </div>
    );
  }

  const monthlyEstimate = Math.round((listing.price * 0.007));

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back */}
        <Link
          href="/search"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to search
        </Link>

        {/* ── Hero image ── */}
        <div className="relative rounded-2xl overflow-hidden mb-6 h-72 sm:h-96 bg-muted">
          <img
            src={listing.image}
            alt={listing.address}
            className="w-full h-full object-cover"
          />
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

          {/* Tag */}
          {listing.tag && (
            <span
              className={`absolute top-4 left-4 text-xs font-bold px-3 py-1.5 rounded-full z-10 ${TAG_COLOR[listing.tag] ?? "bg-white text-foreground"}`}
            >
              {listing.tag}
            </span>
          )}

          {/* Save */}
          <button
            onClick={() => setSaved((s) => !s)}
            className={`absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center shadow-md transition-all z-10 ${
              saved
                ? "bg-rose-500 text-white scale-110"
                : "bg-white/90 backdrop-blur-sm text-foreground hover:bg-white"
            }`}
            aria-label={saved ? "Remove from saved" : "Save home"}
          >
            <Heart className={`w-4 h-4 ${saved ? "fill-white" : ""}`} />
          </button>

          {/* Price */}
          <div className="absolute bottom-0 left-0 right-0 px-6 pb-5 z-10">
            <p className="text-white font-bold text-4xl tracking-tight drop-shadow">
              {formatPrice(listing.price)}
            </p>
            <div className="flex items-center gap-1.5 mt-1">
              <MapPin className="w-3.5 h-3.5 text-white/70" />
              <span className="text-white/80 text-sm">
                {listing.address}, {listing.city}
              </span>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* ── Left: main info ── */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            {/* Stats strip */}
            <div className="bg-card border border-border rounded-2xl p-5">
              <div className="grid grid-cols-3 gap-4 text-center">
                {[
                  { icon: Bed, value: `${listing.beds}`, label: "Beds" },
                  { icon: Bath, value: `${listing.baths}`, label: "Baths" },
                  { icon: Square, value: listing.sqft.toLocaleString(), label: "Sq ft" },
                ].map(({ icon: Icon, value, label }) => (
                  <div key={label}>
                    <Icon className="w-5 h-5 text-muted-foreground mx-auto mb-1" />
                    <p className="text-xl font-bold text-foreground">{value}</p>
                    <p className="text-xs text-muted-foreground">{label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="bg-card border border-border rounded-2xl p-6">
              <h2 className="font-semibold text-foreground text-lg mb-3">
                About this home
              </h2>
              <p className="text-muted-foreground leading-relaxed text-sm">
                {listing.description}
              </p>
            </div>

            {/* Property details */}
            <div className="bg-card border border-border rounded-2xl p-6">
              <h2 className="font-semibold text-foreground text-lg mb-4">
                Property details
              </h2>
              <div className="grid sm:grid-cols-2 gap-y-3 gap-x-8">
                {[
                  { label: "Type", value: listing.type },
                  { label: "Year built", value: String(listing.yearBuilt) },
                  { label: "Garage", value: listing.garage },
                  {
                    label: "Lot size",
                    value: listing.lot ?? "N/A (condo)",
                  },
                  {
                    label: "HOA fees",
                    value: listing.hoa ?? "None",
                  },
                  {
                    label: "Days on market",
                    value:
                      listing.daysOnMarket === 1
                        ? "1 day"
                        : `${listing.daysOnMarket} days`,
                  },
                ].map(({ label, value }) => (
                  <div key={label} className="flex items-start justify-between text-sm">
                    <span className="text-muted-foreground">{label}</span>
                    <span className="font-semibold text-foreground text-right ml-4">
                      {value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Jargon tip */}
            <div className="bg-amber-50 border border-amber-200/60 rounded-2xl p-5">
              <p className="text-sm text-amber-900 leading-relaxed">
                <span className="font-semibold">New to buying?</span>{" "}
                <JargonTip
                  term="HOA fees"
                  definition="A monthly fee charged by a Homeowners Association that covers shared costs like landscaping, building maintenance, pools, and amenities. They reduce your buying power, so factor them into your monthly budget."
                >
                  HOA fees
                </JargonTip>
                {" "}and{" "}
                <JargonTip
                  term="days on market"
                  definition="How long a listing has been active. Homes sitting for 21+ days often have room to negotiate on price. A home listed for just 1–3 days typically gets multiple offers quickly."
                >
                  days on market
                </JargonTip>
                {" "}are two of the most important numbers when deciding whether and how much to offer.
              </p>
            </div>
          </div>

          {/* ── Right sidebar ── */}
          <div className="flex flex-col gap-4">
            {/* Monthly estimate */}
            <div className="bg-card border border-border rounded-2xl p-5">
              <h3 className="font-semibold text-foreground mb-1">
                Est. monthly payment
              </h3>
              <p className="text-3xl font-bold text-primary">
                ~${monthlyEstimate.toLocaleString()}
                <span className="text-base font-normal text-muted-foreground">/mo</span>
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Based on 20% down, 30-yr fixed at 7%.{" "}
                <JargonTip
                  term="What is this estimate?"
                  definition="This is a rough approximation — your actual payment depends on your down payment, interest rate (which changes daily), credit score, and whether you pay for mortgage insurance. Your lender will give you an exact figure."
                >
                  How is this calculated?
                </JargonTip>
              </p>
            </div>

            {/* Open house */}
            {listing.tag === "Open House" && (
              <div className="bg-sky-50 border border-sky-200/60 rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="w-4 h-4 text-sky-600" />
                  <span className="text-sm font-semibold text-sky-800">
                    Open House
                  </span>
                </div>
                <p className="text-sm text-sky-700">
                  Saturday &amp; Sunday · 1:00 – 4:00 PM
                </p>
                <p className="text-xs text-sky-600 mt-1">
                  No appointment needed
                </p>
              </div>
            )}

            {/* Price drop */}
            {listing.tag === "Price Drop" && (
              <div className="bg-amber-50 border border-amber-200/60 rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-1">
                  <TrendingDown className="w-4 h-4 text-amber-700" />
                  <span className="text-sm font-semibold text-amber-800">
                    Price reduced
                  </span>
                </div>
                <p className="text-xs text-amber-700">
                  This listing was recently reduced — there may be room to negotiate further.
                </p>
              </div>
            )}

            {/* Badges */}
            <div className="bg-card border border-border rounded-2xl p-5">
              <h3 className="font-semibold text-foreground mb-3 text-sm">
                Why buyers love this
              </h3>
              <div className="flex flex-col gap-2">
                {[
                  { icon: CheckCircle2, text: "Verified listing data", color: "text-gold-dark" },
                  { icon: Clock, text: `Listed ${listing.daysOnMarket === 1 ? "today" : `${listing.daysOnMarket} days ago`}`, color: "text-sky-600" },
                  { icon: Zap, text: "Fast agent response", color: "text-violet-600" },
                ].map(({ icon: Icon, text, color }) => (
                  <div key={text} className={`flex items-center gap-2 text-xs font-semibold ${color}`}>
                    <Icon className="w-3.5 h-3.5 shrink-0" />
                    {text}
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <Link
              href="/dashboard/messages"
              className="flex items-center justify-center gap-2 bg-gold hover:bg-gold-hover text-white font-bold py-4 rounded-xl transition-colors shadow-sm text-sm"
            >
              <MessageSquare className="w-4 h-4" />
              Ask your agent about this home
            </Link>
            <p className="text-center text-xs text-muted-foreground -mt-1">
              Free · No commitment
            </p>

            <Link
              href="/search"
              className="flex items-center justify-center gap-1.5 bg-secondary border border-border text-foreground font-semibold py-3 rounded-xl transition-colors hover:bg-secondary/80 text-sm"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to search
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
