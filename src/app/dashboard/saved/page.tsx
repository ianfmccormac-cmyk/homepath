"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Heart, Bed, Bath, Square, ArrowRight, Search, TrendingDown } from "lucide-react";

// ── Same listing data as search + property detail ─────────────────────────
const ALL_LISTINGS = [
  { id: 1, price: 485000, address: "124 Oak Street", city: "Austin, TX 78701", beds: 3, baths: 2, sqft: 1850, type: "Single Family", tag: "New", image: "https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?auto=format&fit=crop&w=800&q=80", daysOnMarket: 2, priceDropped: 15000 },
  { id: 2, price: 672000, address: "55 Maple Avenue", city: "Austin, TX 78704", beds: 4, baths: 3, sqft: 2340, type: "Single Family", tag: "Open House", image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80", daysOnMarket: 7, priceDropped: 0 },
  { id: 3, price: 389000, address: "890 Cedar Lane", city: "Austin, TX 78745", beds: 2, baths: 2, sqft: 1420, type: "Condo", tag: null, image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80", daysOnMarket: 14, priceDropped: 0 },
  { id: 4, price: 825000, address: "33 Riverside Drive", city: "Austin, TX 78703", beds: 4, baths: 4, sqft: 3100, type: "Single Family", tag: "Price Drop", image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80", daysOnMarket: 21, priceDropped: 40000 },
  { id: 5, price: 525000, address: "712 Pine Street", city: "Austin, TX 78702", beds: 3, baths: 2, sqft: 2050, type: "Townhouse", tag: null, image: "https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?auto=format&fit=crop&w=800&q=80", daysOnMarket: 5, priceDropped: 0 },
  { id: 6, price: 299000, address: "1401 Congress Ave", city: "Austin, TX 78701", beds: 1, baths: 1, sqft: 780, type: "Condo", tag: "New", image: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=800&q=80", daysOnMarket: 1, priceDropped: 0 },
  { id: 7, price: 950000, address: "8 Lakewood Blvd", city: "Austin, TX 78730", beds: 5, baths: 4, sqft: 4200, type: "Single Family", tag: null, image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80", daysOnMarket: 9, priceDropped: 0 },
  { id: 8, price: 445000, address: "220 South Lamar", city: "Austin, TX 78704", beds: 2, baths: 2, sqft: 1580, type: "Townhouse", tag: "Open House", image: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=800&q=80", daysOnMarket: 3, priceDropped: 0 },
  { id: 9, price: 615000, address: "500 West 6th St", city: "Austin, TX 78701", beds: 3, baths: 3, sqft: 2120, type: "Condo", tag: null, image: "https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=800&q=80", daysOnMarket: 18, priceDropped: 0 },
];

const HP_SAVED_KEY = "hp_saved_listings";

function getSavedIds(): number[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(HP_SAVED_KEY) ?? "[]"); }
  catch { return []; }
}

function formatPrice(n: number) {
  return n >= 1_000_000 ? `$${(n / 1_000_000).toFixed(2)}M` : `$${(n / 1000).toFixed(0)}K`;
}

const TAG_COLOR: Record<string, string> = {
  New: "bg-gold text-white",
  "Open House": "bg-sky-500 text-white",
  "Price Drop": "bg-amber-500 text-white",
};

export default function SavedHomesPage() {
  const [savedIds, setSavedIds] = useState<number[]>([]);

  useEffect(() => {
    setSavedIds(getSavedIds());

    const handleChange = () => setSavedIds(getSavedIds());
    window.addEventListener("hp_saved_change", handleChange);
    window.addEventListener("storage", handleChange);
    return () => {
      window.removeEventListener("hp_saved_change", handleChange);
      window.removeEventListener("storage", handleChange);
    };
  }, []);

  const savedListings = ALL_LISTINGS.filter((l) => savedIds.includes(l.id));

  const unsave = (id: number) => {
    const updated = savedIds.filter((i) => i !== id);
    localStorage.setItem(HP_SAVED_KEY, JSON.stringify(updated));
    setSavedIds(updated);
    window.dispatchEvent(new Event("hp_saved_change"));
  };

  return (
    <div className="p-5 sm:p-7 lg:p-9 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-7">
        <p className="text-gold-dark font-semibold text-[11px] uppercase tracking-[0.12em] mb-1">
          Your collection
        </p>
        <div className="flex items-end justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-[24px] font-bold text-foreground leading-tight">
              Saved homes
            </h1>
            <p className="text-muted-foreground text-sm mt-0.5">
              {savedListings.length === 0
                ? "No homes saved yet"
                : `${savedListings.length} home${savedListings.length !== 1 ? "s" : ""} saved`}
            </p>
          </div>
          <Link
            href="/search"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary border border-border rounded-xl px-4 py-2.5 hover:bg-primary hover:text-white hover:border-primary transition-all shrink-0"
          >
            <Search className="w-3.5 h-3.5" />
            Browse more
          </Link>
        </div>
      </div>

      {/* Empty state */}
      {savedListings.length === 0 && (
        <div className="bg-secondary rounded-2xl p-10 text-center ring-1 ring-black/[0.06]">
          <div className="w-14 h-14 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Heart className="w-6 h-6 text-rose-400" />
          </div>
          <h2 className="font-semibold text-foreground mb-1">No saved homes yet</h2>
          <p className="text-muted-foreground text-sm mb-5 max-w-xs mx-auto leading-relaxed">
            Tap the heart icon on any listing to save it here for easy comparison.
          </p>
          <Link
            href="/search"
            className="inline-flex items-center gap-2 bg-primary text-white font-semibold text-sm px-6 py-3 rounded-xl hover:bg-primary/90 transition-all"
          >
            Browse homes
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}

      {/* Saved grid */}
      {savedListings.length > 0 && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {savedListings.map((listing) => (
            <div
              key={listing.id}
              className="bg-card rounded-2xl border border-border overflow-hidden hover:shadow-xl transition-all duration-300 group hover:-translate-y-0.5"
            >
              {/* Photo */}
              <div className="relative h-48 overflow-hidden bg-muted">
                <img
                  src={listing.image}
                  alt={listing.address}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />

                {/* Tag */}
                {listing.tag && (
                  <span className={`absolute top-3 left-3 text-xs font-bold px-2.5 py-1 rounded-full z-10 ${TAG_COLOR[listing.tag] ?? "bg-white text-foreground"}`}>
                    {listing.tag}
                  </span>
                )}

                {/* Unsave button */}
                <button
                  onClick={() => unsave(listing.id)}
                  className="absolute top-3 right-3 w-9 h-9 rounded-full bg-rose-500 text-white flex items-center justify-center shadow-md transition-all z-10 hover:bg-rose-600 hover:scale-110"
                  aria-label="Remove from saved"
                >
                  <Heart className="w-4 h-4 fill-white" />
                </button>

                {/* Price overlay */}
                <div className="absolute bottom-0 left-0 right-0 px-4 pb-3 z-10">
                  <div className="flex items-center gap-2">
                    <p className="text-white font-bold text-2xl tracking-tight drop-shadow-sm">
                      {formatPrice(listing.price)}
                    </p>
                    {listing.priceDropped > 0 && (
                      <span className="flex items-center gap-0.5 bg-emerald-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-sm">
                        <TrendingDown className="w-2.5 h-2.5" />
                        ↓${(listing.priceDropped / 1000).toFixed(0)}K
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <p className="text-sm font-semibold text-foreground">{listing.address}</p>
                <p className="text-xs text-muted-foreground">{listing.city}</p>

                <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Bed className="w-3.5 h-3.5" />
                    {listing.beds} bd
                  </span>
                  <span className="flex items-center gap-1">
                    <Bath className="w-3.5 h-3.5" />
                    {listing.baths} ba
                  </span>
                  <span className="flex items-center gap-1">
                    <Square className="w-3.5 h-3.5" />
                    {listing.sqft.toLocaleString()} sqft
                  </span>
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <span className="text-xs font-medium bg-secondary text-muted-foreground px-2.5 py-1 rounded-full border border-border">
                    {listing.type}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {listing.daysOnMarket === 1 ? "1 day" : `${listing.daysOnMarket} days`} on market
                  </span>
                </div>

                <Link
                  href={`/properties/${listing.id}`}
                  className="mt-4 flex items-center justify-center gap-1.5 w-full bg-primary/5 border border-primary/20 rounded-xl py-2.5 text-sm font-semibold text-primary hover:bg-primary hover:text-white hover:border-primary transition-all"
                >
                  View Details
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Footer tip */}
      {savedListings.length > 0 && (
        <p className="text-center text-xs text-muted-foreground mt-8">
          Tap the heart icon on any listing to remove it from your saved homes.
        </p>
      )}
    </div>
  );
}
