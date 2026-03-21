"use client";

import { useState } from "react";
import Link from "next/link";
import { Heart, Bed, Bath, Square, ArrowRight } from "lucide-react";

export type Listing = {
  id: number;
  price: number;
  address: string;
  city: string;
  beds: number;
  baths: number;
  sqft: number;
  type: string;
  tag?: string | null;
  tagColor?: string;
  gradient: string;
  image?: string;
  daysOnMarket: number;
};

function formatPrice(n: number) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
  return `$${(n / 1000).toFixed(0)}K`;
}

export default function ListingCard({ listing }: { listing: Listing }) {
  const [saved, setSaved] = useState(false);

  const tagColorMap: Record<string, string> = {
    New: "bg-gold text-white",
    "Open House": "bg-sky-500 text-white",
    "Price Drop": "bg-amber-500 text-white",
  };

  return (
    <div className="bg-card rounded-2xl border border-border overflow-hidden hover:shadow-xl transition-all duration-300 group hover:-translate-y-0.5">
      {/* Photo */}
      <div className={`relative h-56 overflow-hidden ${!listing.image ? listing.gradient : "bg-muted"}`}>
        {listing.image ? (
          <img
            src={listing.image}
            alt={listing.address}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        ) : null}
        {/* Gradient overlay on photo */}
        {listing.image && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
        )}

        {/* Save button */}
        <button
          onClick={() => setSaved((s) => !s)}
          className={`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center shadow-md transition-all z-10 ${
            saved
              ? "bg-rose-500 text-white scale-110"
              : "bg-white/90 backdrop-blur-sm text-foreground hover:bg-white hover:scale-105"
          }`}
          aria-label={saved ? "Remove from saved" : "Save home"}
        >
          <Heart className={`w-4 h-4 ${saved ? "fill-white" : ""}`} />
        </button>

        {/* Tag */}
        {listing.tag && (
          <span
            className={`absolute top-3 left-3 text-xs font-bold px-2.5 py-1 rounded-full z-10 ${
              tagColorMap[listing.tag] ?? "bg-white text-foreground"
            }`}
          >
            {listing.tag}
          </span>
        )}

        {/* Price overlay on image */}
        {listing.image && (
          <div className="absolute bottom-0 left-0 right-0 px-4 pb-3 z-10">
            <p className="text-white font-bold text-2xl tracking-tight drop-shadow-sm">
              {formatPrice(listing.price)}
            </p>
          </div>
        )}

        {/* Days on market (no-photo fallback) */}
        {!listing.image && (
          <span className="absolute bottom-3 left-3 text-xs font-medium bg-black/40 text-white px-2 py-0.5 rounded-full backdrop-blur-sm">
            {listing.daysOnMarket === 1
              ? "1 day on market"
              : `${listing.daysOnMarket} days on market`}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Price (shown below only if no photo overlay) */}
        {!listing.image && (
          <p className="text-2xl font-bold text-foreground">{formatPrice(listing.price)}</p>
        )}

        {/* Address */}
        <p className={`text-sm font-semibold text-foreground ${listing.image ? "" : "mt-0.5"}`}>
          {listing.address}
        </p>
        <p className="text-xs text-muted-foreground">{listing.city}</p>

        {/* Stats row */}
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

        {/* Bottom row */}
        <div className="mt-4 flex items-center justify-between">
          <span className="text-xs font-medium bg-secondary text-muted-foreground px-2.5 py-1 rounded-full border border-border">
            {listing.type}
          </span>
          <span className="text-xs text-muted-foreground">
            {listing.daysOnMarket === 1 ? "1 day" : `${listing.daysOnMarket} days`} on market
          </span>
        </div>

        {/* CTA */}
        <Link
          href={`/search`}
          className="mt-4 flex items-center justify-center gap-1.5 w-full bg-primary/5 border border-primary/20 rounded-xl py-2.5 text-sm font-semibold text-primary hover:bg-primary hover:text-white hover:border-primary transition-all"
        >
          View Details
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
