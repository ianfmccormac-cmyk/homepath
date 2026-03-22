"use client";

import { useState, useMemo } from "react";
import Navbar from "@/components/navbar";
import ListingCard, { type Listing } from "@/components/listing-card";
import { SlidersHorizontal, Search, X, ChevronDown } from "lucide-react";

// ─── Mock listings ──────────────────────────────────────────────────────────
const ALL_LISTINGS: Listing[] = [
  { id: 1, price: 485000, address: "124 Oak Street", city: "Austin, TX 78701", beds: 3, baths: 2, sqft: 1850, type: "Single Family", tag: "New", gradient: "bg-gradient-to-br from-emerald-100 to-teal-100", image: "https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?auto=format&fit=crop&w=800&q=80", daysOnMarket: 2 },
  { id: 2, price: 672000, address: "55 Maple Avenue", city: "Austin, TX 78704", beds: 4, baths: 3, sqft: 2340, type: "Single Family", tag: "Open House", gradient: "bg-gradient-to-br from-sky-100 to-blue-100", image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80", daysOnMarket: 7 },
  { id: 3, price: 389000, address: "890 Cedar Lane", city: "Austin, TX 78745", beds: 2, baths: 2, sqft: 1420, type: "Condo", tag: null, gradient: "bg-gradient-to-br from-violet-100 to-purple-100", image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80", daysOnMarket: 14 },
  { id: 4, price: 825000, address: "33 Riverside Drive", city: "Austin, TX 78703", beds: 4, baths: 4, sqft: 3100, type: "Single Family", tag: "Price Drop", gradient: "bg-gradient-to-br from-amber-100 to-orange-100", image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80", daysOnMarket: 21 },
  { id: 5, price: 525000, address: "712 Pine Street", city: "Austin, TX 78702", beds: 3, baths: 2, sqft: 2050, type: "Townhouse", tag: null, gradient: "bg-gradient-to-br from-rose-100 to-pink-100", image: "https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?auto=format&fit=crop&w=800&q=80", daysOnMarket: 5 },
  { id: 6, price: 299000, address: "1401 Congress Ave", city: "Austin, TX 78701", beds: 1, baths: 1, sqft: 780, type: "Condo", tag: "New", gradient: "bg-gradient-to-br from-lime-100 to-green-100", image: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=800&q=80", daysOnMarket: 1 },
  { id: 7, price: 950000, address: "8 Lakewood Blvd", city: "Austin, TX 78730", beds: 5, baths: 4, sqft: 4200, type: "Single Family", tag: null, gradient: "bg-gradient-to-br from-indigo-100 to-blue-100", image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80", daysOnMarket: 9 },
  { id: 8, price: 445000, address: "220 South Lamar", city: "Austin, TX 78704", beds: 2, baths: 2, sqft: 1580, type: "Townhouse", tag: "Open House", gradient: "bg-gradient-to-br from-fuchsia-100 to-pink-100", image: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=800&q=80", daysOnMarket: 3 },
  { id: 9, price: 615000, address: "500 West 6th St", city: "Austin, TX 78701", beds: 3, baths: 3, sqft: 2120, type: "Condo", tag: null, gradient: "bg-gradient-to-br from-cyan-100 to-sky-100", image: "https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=800&q=80", daysOnMarket: 18 },
];

const PRICE_RANGES = [
  { label: "Any", min: 0, max: Infinity },
  { label: "Under $400K", min: 0, max: 400000 },
  { label: "$400K–$600K", min: 400000, max: 600000 },
  { label: "$600K–$900K", min: 600000, max: 900000 },
  { label: "$900K+", min: 900000, max: Infinity },
];
const BED_OPTIONS = ["Any", "1+", "2+", "3+", "4+"];
const TYPE_OPTIONS = ["All Types", "Single Family", "Condo", "Townhouse"];
const SORT_OPTIONS = ["Newest", "Price: Low–High", "Price: High–Low", "Most Beds"];

function SelectPill({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="relative">
      <label className="sr-only">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none bg-card border border-border text-sm font-medium text-foreground rounded-xl pl-3 pr-8 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/40 cursor-pointer hover:border-primary/50 transition-colors"
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
      <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
    </div>
  );
}

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [priceRange, setPriceRange] = useState("Any");
  const [beds, setBeds] = useState("Any");
  const [propType, setPropType] = useState("All Types");
  const [sort, setSort] = useState("Newest");
  const [showFilters, setShowFilters] = useState(false);

  const activeFilters = [
    priceRange !== "Any" && priceRange,
    beds !== "Any" && `${beds} beds`,
    propType !== "All Types" && propType,
  ].filter(Boolean) as string[];

  const filtered = useMemo(() => {
    const range = PRICE_RANGES.find((r) => r.label === priceRange)!;
    const minBeds = beds === "Any" ? 0 : parseInt(beds);

    let results = ALL_LISTINGS.filter((l) => {
      const matchesQuery =
        !query ||
        l.address.toLowerCase().includes(query.toLowerCase()) ||
        l.city.toLowerCase().includes(query.toLowerCase());
      const matchesPrice = l.price >= range.min && l.price <= range.max;
      const matchesBeds = l.beds >= minBeds;
      const matchesType = propType === "All Types" || l.type === propType;
      return matchesQuery && matchesPrice && matchesBeds && matchesType;
    });

    results = [...results].sort((a, b) => {
      if (sort === "Newest") return a.daysOnMarket - b.daysOnMarket;
      if (sort === "Price: Low–High") return a.price - b.price;
      if (sort === "Price: High–Low") return b.price - a.price;
      if (sort === "Most Beds") return b.beds - a.beds;
      return 0;
    });

    return results;
  }, [query, priceRange, beds, propType, sort]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* ── Search header ── */}
      <div className="bg-primary border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-white font-bold text-2xl mb-4">
            Find Your Home
          </h1>
          {/* Main search bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by address, city, or ZIP..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-white border border-border rounded-xl pl-11 pr-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
          </div>
        </div>
      </div>

      {/* ── Filter bar ── */}
      <div className="bg-card border-b border-border sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 py-3 overflow-x-auto">
            <SelectPill
              label="Price range"
              options={PRICE_RANGES.map((r) => r.label)}
              value={priceRange}
              onChange={setPriceRange}
            />
            <SelectPill
              label="Bedrooms"
              options={BED_OPTIONS}
              value={beds}
              onChange={setBeds}
            />
            <SelectPill
              label="Property type"
              options={TYPE_OPTIONS}
              value={propType}
              onChange={setPropType}
            />

            {/* Active filter chips */}
            {activeFilters.map((f) => (
              <span
                key={f}
                className="flex items-center gap-1.5 text-xs font-semibold bg-primary/10 text-primary px-3 py-2 rounded-xl border border-primary/20 shrink-0"
              >
                {f}
                <button onClick={() => {
                  if (f === priceRange) setPriceRange("Any");
                  else if (f.includes("beds")) setBeds("Any");
                  else setPropType("All Types");
                  setShowFilters(false);
                }}>
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}

            {/* Spacer + sort */}
            <div className="ml-auto shrink-0 flex items-center gap-2">
              <SelectPill
                label="Sort by"
                options={SORT_OPTIONS}
                value={sort}
                onChange={setSort}
              />
            </div>
          </div>
        </div>

        {/* Mobile filter panel */}
        {showFilters && (
          <div className="lg:hidden bg-card border-b border-border px-4 py-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Price Range</p>
                <select
                  value={priceRange}
                  onChange={(e) => setPriceRange(e.target.value)}
                  className="w-full appearance-none bg-secondary border border-border text-sm font-medium text-foreground rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/40"
                >
                  {PRICE_RANGES.map((r) => <option key={r.label} value={r.label}>{r.label}</option>)}
                </select>
              </div>
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Bedrooms</p>
                <select
                  value={beds}
                  onChange={(e) => setBeds(e.target.value)}
                  className="w-full appearance-none bg-secondary border border-border text-sm font-medium text-foreground rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/40"
                >
                  {BED_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Property Type</p>
                <select
                  value={propType}
                  onChange={(e) => setPropType(e.target.value)}
                  className="w-full appearance-none bg-secondary border border-border text-sm font-medium text-foreground rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/40"
                >
                  {TYPE_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Sort By</p>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="w-full appearance-none bg-secondary border border-border text-sm font-medium text-foreground rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/40"
                >
                  {SORT_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>
            </div>
            {activeFilters.length > 0 && (
              <button
                onClick={() => { setPriceRange("Any"); setBeds("Any"); setPropType("All Types"); setShowFilters(false); }}
                className="mt-3 text-sm font-semibold text-primary hover:underline"
              >
                Clear all filters
              </button>
            )}
          </div>
        )}
      </div>

      {/* ── Results ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">{filtered.length}</span>{" "}
            home{filtered.length !== 1 ? "s" : ""} found
            {query && ` for "${query}"`}
          </p>
          <button
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground border border-border rounded-xl px-3 py-2 transition-colors hover:border-primary/50 lg:hidden"
            onClick={() => setShowFilters(!showFilters)}
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters{activeFilters.length > 0 ? ` (${activeFilters.length})` : ""}
          </button>
        </div>

        {/* Grid */}
        {filtered.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-16 h-16 bg-muted rounded-2xl flex items-center justify-center mb-4">
              <Search className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">
              No homes found
            </h3>
            <p className="text-muted-foreground text-sm max-w-xs">
              Try adjusting your filters or searching a different location.
            </p>
            <button
              onClick={() => {
                setQuery("");
                setPriceRange("Any");
                setBeds("Any");
                setPropType("All Types");
              }}
              className="mt-4 text-sm font-semibold text-primary hover:underline"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
