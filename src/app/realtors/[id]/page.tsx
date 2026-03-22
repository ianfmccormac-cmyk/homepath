"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import Navbar from "@/components/navbar";
import Link from "next/link";
import { JargonTip } from "@/components/jargon-tip";
import {
  Star,
  MapPin,
  TrendingUp,
  Clock,
  Users,
  MessageSquare,
  Play,
  CheckCircle2,
  ArrowLeft,
  Home,
  ThumbsUp,
  Zap,
  X,
} from "lucide-react";

// ─── Mock agent data ──────────────────────────────────────────────────────
type Agent = {
  initials: string;
  color: string;
  name: string;
  title: string;
  location: string;
  rating: number;
  reviews: number;
  sales: number;
  avgDays: number;
  memberSince: number;
  listToClose: number;
  avgListPrice: string;
  buyersHelped: number;
  priceRange: string;
  specialty: string;
  comStyle: string;
  comNote: string;
  bio: string;
  tags: string[];
  reviewList: { author: string; date: string; rating: number; text: string }[];
  photo?: string;
  recentSales: { address: string; price: string; gradient: string; image?: string }[];
};

const AGENTS: Record<string, Agent> = {
  "paloma-aguilar": {
    initials: "PA",
    color: "bg-violet-500",
    photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
    name: "Paloma Aguilar",
    title: "Licensed Realtor",
    location: "Austin, TX",
    rating: 4.9,
    reviews: 87,
    sales: 52,
    avgDays: 38,
    memberSince: 2019,
    listToClose: 97,
    avgListPrice: "$485K",
    buyersHelped: 94,
    priceRange: "$250K – $900K",
    specialty: "First-time buyers",
    comStyle: "Text & Chat",
    comNote: "Responds within 1 hour · Available Mon–Sat, 8am–7pm CT",
    bio: "I specialize in helping first-time buyers navigate Austin's competitive market. No question is too basic — I'll walk you through every step, from getting pre-approved to closing day. I believe home buying should feel empowering, not overwhelming.",
    tags: ["First-time buyers", "Central Austin", "Condos", "Investment"],
    reviewList: [
      { author: "Carlos M.", date: "Feb 2026", rating: 5, text: "Paloma answered every question I had — and I had a lot. She never made me feel dumb for asking. Closed in 31 days on my first home!" },
      { author: "Priya & Tom", date: "Jan 2026", rating: 5, text: "We were relocating from NYC and had no idea how Austin worked. Paloma was patient, responsive, and found us exactly what we wanted under budget." },
      { author: "Jordan K.", date: "Dec 2025", rating: 5, text: "I was nervous about the whole process but Paloma made it seamless. She explained everything clearly and negotiated an amazing deal for us." },
    ],
    recentSales: [
      { address: "124 Oak Street, Austin TX", price: "$512K", gradient: "from-emerald-100 to-teal-100", image: "https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?auto=format&fit=crop&w=600&q=80" },
      { address: "55 Maple Ave, Austin TX", price: "$387K", gradient: "from-sky-100 to-blue-100", image: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=600&q=80" },
      { address: "712 Pine St, Austin TX", price: "$625K", gradient: "from-violet-100 to-purple-100", image: "https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?auto=format&fit=crop&w=600&q=80" },
    ],
  },
  "marcus-rivera": {
    initials: "MR",
    color: "bg-sky-500",
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
    name: "Marcus Rivera",
    title: "Licensed Realtor",
    location: "Denver, CO",
    rating: 4.8,
    reviews: 61,
    sales: 44,
    avgDays: 42,
    memberSince: 2020,
    listToClose: 94,
    avgListPrice: "$620K",
    buyersHelped: 72,
    priceRange: "$300K – $1.2M",
    specialty: "Investment & relocation",
    comStyle: "Phone & Email",
    comNote: "Responds within 2 hours · Available Mon–Fri, 8am–6pm MT",
    bio: "I help investors and relocating buyers find the right fit in Denver's fast-moving market. With a background in finance, I bring a data-first approach to every deal.",
    tags: ["Investors", "Relocation", "Denver Metro", "Mountain Properties"],
    reviewList: [
      { author: "Aisha R.", date: "Mar 2026", rating: 5, text: "Marcus helped me find an investment property with great potential. His analysis was spot on." },
      { author: "Derek T.", date: "Feb 2026", rating: 5, text: "Relocated from Chicago — Marcus made the whole process easy and stress-free." },
    ],
    recentSales: [
      { address: "890 Cedar Ln, Denver CO", price: "$718K", gradient: "from-amber-100 to-orange-100", image: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=600&q=80" },
      { address: "33 Mountain Blvd, Denver CO", price: "$545K", gradient: "from-rose-100 to-pink-100", image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=600&q=80" },
    ],
  },
};

const DEFAULT_AGENT = AGENTS["paloma-aguilar"];

function StarRow({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${i <= Math.round(rating) ? "fill-amber-400 text-amber-400" : "text-muted-foreground/20"}`}
        />
      ))}
    </div>
  );
}

export default function AgentProfilePage() {
  const { id } = useParams<{ id: string }>();
  const agent = AGENTS[id] ?? DEFAULT_AGENT;
  const [showVideoModal, setShowVideoModal] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back */}
        <Link
          href="/#agents"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to agents
        </Link>

        {/* Video modal */}
        {showVideoModal && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
            onClick={() => setShowVideoModal(false)}
          >
            <div
              className="bg-card rounded-2xl p-8 max-w-sm w-full text-center shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setShowVideoModal(false)}
                className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Play className="w-6 h-6 text-primary ml-1" />
              </div>
              <h3 className="font-bold text-foreground text-lg mb-2">
                Video coming soon
              </h3>
              <p className="text-sm text-muted-foreground mb-5">
                {agent.name.split(" ")[0]}&apos;s intro video will be live shortly. In the meantime, send a message to get started.
              </p>
              <Link
                href="/dashboard/messages"
                onClick={() => setShowVideoModal(false)}
                className="inline-flex items-center gap-2 bg-gold hover:bg-gold-hover text-white font-bold text-sm px-6 py-3 rounded-xl transition-colors"
              >
                <MessageSquare className="w-4 h-4" />
                Message {agent.name.split(" ")[0]}
              </Link>
            </div>
          </div>
        )}

        {/* ── Profile header ── */}
        <div className="bg-card rounded-2xl border border-border p-6 sm:p-8 mb-6">
          <div className="flex flex-col sm:flex-row gap-6">
            {/* Avatar */}
            {agent.photo ? (
              <img
                src={agent.photo}
                alt={agent.name}
                className="w-24 h-24 rounded-2xl object-cover shrink-0"
              />
            ) : (
              <div
                className={`w-24 h-24 ${agent.color} rounded-2xl flex items-center justify-center text-white font-bold text-3xl shrink-0`}
              >
                {agent.initials}
              </div>
            )}

            {/* Info */}
            <div className="flex-1">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h1 className="text-2xl font-bold text-foreground">
                    {agent.name}
                  </h1>
                  <p className="text-muted-foreground">
                    {agent.title} · Member since {agent.memberSince}
                  </p>
                  <div className="flex items-center gap-3 mt-2 flex-wrap">
                    <div className="flex items-center gap-1.5">
                      <StarRow rating={agent.rating} />
                      <span className="font-semibold text-sm text-foreground">
                        {agent.rating}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        ({agent.reviews} reviews)
                      </span>
                    </div>
                    <span className="text-muted-foreground">·</span>
                    <span className="flex items-center gap-1 text-sm text-muted-foreground">
                      <MapPin className="w-3.5 h-3.5" />
                      {agent.location}
                    </span>
                  </div>
                </div>

                {/* Single clear CTA — no decision paralysis */}
                <div className="sm:shrink-0">
                  <Link
                    href="/dashboard/messages"
                    className="inline-flex items-center justify-center gap-2 bg-gold hover:bg-gold-hover text-white font-bold text-sm px-6 py-3 rounded-xl transition-colors shadow-sm"
                  >
                    <MessageSquare className="w-4 h-4" />
                    Message {agent.name.split(" ")[0]}
                  </Link>
                  <p className="text-xs text-muted-foreground mt-1.5 text-center">
                    Free · No commitment
                  </p>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mt-4">
                {agent.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs font-medium bg-secondary border border-border text-muted-foreground px-3 py-1 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* ── Left column ── */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            {/* Video intro */}
            <div className="bg-card border border-border rounded-2xl overflow-hidden">
              <div className="relative h-52 bg-gradient-to-br from-primary/80 to-primary flex items-center justify-center">
                {/* Dot grid texture */}
                <div
                  className="absolute inset-0 opacity-[0.06]"
                  style={{
                    backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
                    backgroundSize: "24px 24px",
                  }}
                />
                <button
                  onClick={() => setShowVideoModal(true)}
                  className="relative flex flex-col items-center gap-3 group"
                >
                  <div className="w-16 h-16 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors border-2 border-white/30">
                    <Play className="w-7 h-7 text-white fill-white ml-1" />
                  </div>
                  <span className="text-white/80 text-sm font-medium">
                    Watch {agent.name.split(" ")[0]}&apos;s 60-second intro
                  </span>
                </button>
              </div>
            </div>

            {/* About */}
            <div className="bg-card border border-border rounded-2xl p-6">
              <h2 className="font-semibold text-foreground text-lg mb-3">
                About {agent.name.split(" ")[0]}
              </h2>
              <p className="text-muted-foreground leading-relaxed">{agent.bio}</p>

              <div className="flex flex-wrap gap-3 mt-5">
                {[
                  { icon: CheckCircle2, text: "Background verified", color: "text-gold-dark" },
                  { icon: ThumbsUp, text: "Top-rated agent", color: "text-amber-600" },
                  { icon: Zap, text: "Fast responder", color: "text-sky-600" },
                ].map(({ icon: Icon, text, color }) => (
                  <span
                    key={text}
                    className={`flex items-center gap-1.5 text-xs font-semibold ${color} bg-secondary border border-border px-3 py-1.5 rounded-full`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {text}
                  </span>
                ))}
              </div>
            </div>

            {/* Reviews */}
            <div className="bg-card border border-border rounded-2xl p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-semibold text-foreground text-lg">
                  Reviews ({agent.reviews})
                </h2>
                <div className="flex items-center gap-1.5">
                  <Star className="w-4.5 h-4.5 fill-amber-400 text-amber-400" />
                  <span className="font-bold text-foreground">{agent.rating}</span>
                  <span className="text-muted-foreground text-sm">/ 5</span>
                </div>
              </div>

              <div className="flex flex-col gap-5">
                {agent.reviewList.map((r, i) => (
                  <div key={i} className="pb-5 border-b border-border last:border-0 last:pb-0">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-semibold text-sm text-foreground">
                          {r.author}
                        </p>
                        <p className="text-xs text-muted-foreground">{r.date}</p>
                      </div>
                      <StarRow rating={r.rating} />
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      &ldquo;{r.text}&rdquo;
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent sales */}
            <div className="bg-card border border-border rounded-2xl p-6">
              <h2 className="font-semibold text-foreground text-lg mb-4">
                Recent Sales
              </h2>
              <div className="grid sm:grid-cols-3 gap-3">
                {agent.recentSales.map((s) => (
                  <div
                    key={s.address}
                    className="rounded-xl border border-border overflow-hidden"
                  >
                    {s.image ? (
                      <img src={s.image} alt={s.address} className="h-24 w-full object-cover" />
                    ) : (
                      <div className={`h-24 bg-gradient-to-br ${s.gradient}`} />
                    )}
                    <div className="p-3">
                      <p className="text-sm font-bold text-foreground">{s.price}</p>
                      <p className="text-xs text-muted-foreground truncate">
                        {s.address}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Right sidebar ── */}
          <div className="flex flex-col gap-4">
            {/* Stats */}
            <div className="bg-card border border-border rounded-2xl p-5">
              <h3 className="font-semibold text-foreground mb-4">Agent Stats</h3>
              <div className="flex flex-col gap-3">
                {[
                  {
                    icon: TrendingUp,
                    label: <JargonTip term="List-to-close rate" definition="The percentage of offers this agent submits that actually result in a closed sale. 97% means almost every deal they start, they finish — very few fall apart.">List-to-close</JargonTip>,
                    value: `${agent.listToClose}%`,
                    color: "text-gold-dark bg-gold-light",
                  },
                  {
                    icon: Clock,
                    label: <JargonTip term="Average days to close" definition="How long it typically takes from the day an offer is accepted to the day you get your keys. The national average is 43 days. Faster is usually better.">Avg. days to close</JargonTip>,
                    value: `${agent.avgDays} days`,
                    color: "text-sky-600 bg-sky-50",
                  },
                  { icon: Home, label: "Avg. sale price", value: agent.avgListPrice, color: "text-amber-600 bg-amber-50" },
                  { icon: Users, label: "Buyers helped", value: String(agent.buyersHelped), color: "text-violet-600 bg-violet-50" },
                ].map(({ icon: Icon, label, value, color }) => (
                  <div key={value} className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-muted-foreground">{label}</p>
                      <p className="text-sm font-bold text-foreground">{value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Price range */}
            <div className="bg-card border border-border rounded-2xl p-5">
              <h3 className="font-semibold text-foreground mb-3">
                Price Range
              </h3>
              <p className="text-lg font-bold text-primary">{agent.priceRange}</p>
              <p className="text-xs text-muted-foreground mt-1">
                Homes {agent.name.split(" ")[0]} typically works with
              </p>
            </div>

            {/* Communication style */}
            <div className="bg-card border border-border rounded-2xl p-5">
              <h3 className="font-semibold text-foreground mb-3">
                Communication Style
              </h3>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-gold" />
                <span className="text-sm font-medium text-foreground">
                  {agent.comStyle}
                </span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {agent.comNote}
              </p>
            </div>

            {/* Specializes in */}
            <div className="bg-gold-light border border-gold-subtle rounded-2xl p-5">
              <p className="text-xs font-semibold text-gold-dark uppercase tracking-widest mb-1">
                Specializes in
              </p>
              <p className="text-sm font-bold text-foreground">
                {agent.specialty}
              </p>
            </div>

            {/* CTA repeat */}
            <Link
              href="/dashboard/messages"
              className="flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white font-semibold py-3.5 rounded-xl transition-colors text-sm"
            >
              <MessageSquare className="w-4 h-4" />
              Connect with {agent.name.split(" ")[0]}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
