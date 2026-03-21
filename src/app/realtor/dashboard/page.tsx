"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import {
  Users,
  CalendarDays,
  UserPlus,
  MessageSquare,
  CheckCircle2,
  Circle,
  ArrowRight,
  Clock,
  TrendingUp,
  Star,
  MapPin,
  Check,
  X,
  Inbox,
  Activity,
} from "lucide-react";

// ── Static fallback data (shown when DB has no matches yet) ───────────────
const FALLBACK_PIPELINE = [
  { id: "f1", initials: "MT", color: "bg-sky-500",   name: "Marcus T.",   budget: "$400–500K", location: "Austin, TX",     step: 3, stepLabel: "Agent Match",   urgency: "low",    lastActive: "Today",       nextAction: "Send intro message" },
  { id: "f2", initials: "AR", color: "bg-teal-500",  name: "Aisha R.",    budget: "$600–750K", location: "Austin, TX",     step: 5, stepLabel: "Submit Offer",  urgency: "high",   lastActive: "Yesterday",   nextAction: "Prepare offer — deadline today" },
  { id: "f3", initials: "TL", color: "bg-amber-500", name: "Tom & Lisa",  budget: "$300–400K", location: "Round Rock, TX", step: 2, stepLabel: "Pre-Approval", urgency: "medium", lastActive: "3 days ago",  nextAction: "Follow up on pre-approval" },
];

const FALLBACK_LEADS = [
  { id: "l1", initials: "JK", color: "bg-violet-500", name: "Jordan K.", match: 94, budget: "$500–650K", timeline: "3–6 months", location: "Austin, TX",      style: "Text / Chat", type: "First-time buyer" },
  { id: "l2", initials: "SW", color: "bg-rose-500",   name: "Sam W.",    match: 88, budget: "$300–450K", timeline: "6–12 months",location: "Cedar Park, TX",  style: "Email",       type: "First-time buyer" },
];

const INITIAL_TASKS = [
  { id: 1, text: "Follow up with Marcus re: tour availability", done: false, urgent: false },
  { id: 2, text: "Prepare offer for Aisha — deadline 5pm",       done: false, urgent: true  },
  { id: 3, text: "Review new listing matches for Tom & Lisa",    done: false, urgent: false },
  { id: 4, text: "Respond to Jordan's lead request",              done: false, urgent: false },
];

const URGENCY_COLORS: Record<string, string> = {
  high:   "border-l-rose-500",
  medium: "border-l-amber-500",
  low:    "border-l-transparent",
};

const AVATAR_COLORS = ["bg-sky-500","bg-teal-500","bg-amber-500","bg-violet-500","bg-rose-500"];

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-gold-dark font-semibold text-[11px] uppercase tracking-[0.12em] mb-3">
      {children}
    </p>
  );
}

// ── DB types ──────────────────────────────────────────────────────────────
interface PipelineBuyer {
  id: string;
  initials: string;
  color: string;
  name: string;
  budget: string;
  location: string;
  step: number;
  stepLabel: string;
  urgency: string;
  lastActive: string;
  nextAction: string;
}

interface Lead {
  id: string;
  initials: string;
  color: string;
  name: string;
  match: number;
  budget: string;
  timeline: string;
  location: string;
  style: string;
  type: string;
}

// ── Component ─────────────────────────────────────────────────────────────
export default function RealtorDashboardPage() {
  const supabaseRef = useRef<ReturnType<typeof createClient> | null>(null);

  const [realtorName, setRealtorName] = useState("Paloma");
  const [pipeline, setPipeline]       = useState<PipelineBuyer[]>(FALLBACK_PIPELINE);
  const [leads, setLeads]             = useState<Lead[]>(FALLBACK_LEADS);
  const [tasks, setTasks]             = useState(INITIAL_TASKS);
  const [unreadCount, setUnreadCount] = useState(0);
  const [recentMsgs, setRecentMsgs]   = useState<{ senderName: string; preview: string; time: string }[]>([]);
  const [loading, setLoading]         = useState(true);

  // ── Fetch real data ───────────────────────────────────────────────────
  useEffect(() => {
    (async () => {
      if (!supabaseRef.current) {
        supabaseRef.current = createClient();
      }
      const supabase = supabaseRef.current;
      if (!supabase) { setLoading(false); return; }
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setLoading(false); return; }

      // Realtor's name
      const { data: profile } = await supabase
        .from("profiles").select("full_name").eq("id", user.id).single();
      if (profile?.full_name) setRealtorName(profile.full_name.split(" ")[0]);

      // Active pipeline (matches where this user is the realtor)
      const { data: activeMatches } = await supabase
        .from("matches")
        .select(`
          id, match_score,
          buyers!matches_buyer_id_fkey(
            budget, location, journey_step,
            profiles(full_name)
          )
        `)
        .eq("realtor_id", user.id)
        .eq("status", "active");

      if (activeMatches && activeMatches.length > 0) {
        type B = { budget: string | null; location: string | null; journey_step: number | null; profiles: { full_name: string | null } | null } | null;
        const mapped: PipelineBuyer[] = activeMatches.map((m, i) => {
          const b = m.buyers as unknown as B;
          const name = b?.profiles?.full_name ?? `Buyer ${i + 1}`;
          const initials = name.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase();
          const step = b?.journey_step ?? 1;
          const labels = ["", "Browse", "Pre-Approval", "Match", "Tours", "Offer", "Negotiate", "Inspection", "Close"];
          return {
            id: m.id, initials, color: AVATAR_COLORS[i % AVATAR_COLORS.length],
            name, budget: b?.budget ?? "—", location: b?.location ?? "—",
            step, stepLabel: labels[step] ?? `Step ${step}`,
            urgency: step >= 5 ? "high" : step >= 3 ? "medium" : "low",
            lastActive: "Recently", nextAction: `Continue step ${step} → ${labels[step + 1] ?? "Close"}`,
          };
        });
        setPipeline(mapped);

        // Unread messages
        const matchIds = activeMatches.map(m => m.id);
        const { count } = await supabase
          .from("messages")
          .select("*", { count: "exact", head: true })
          .in("match_id", matchIds)
          .eq("read", false)
          .neq("sender_id", user.id);
        setUnreadCount(count ?? 0);

        // Recent messages preview
        const { data: recent } = await supabase
          .from("messages")
          .select("content, created_at, sender_id, match_id")
          .in("match_id", matchIds)
          .neq("sender_id", user.id)
          .eq("read", false)
          .order("created_at", { ascending: false })
          .limit(3);

        if (recent && recent.length > 0) {
          setRecentMsgs(
            recent.map((msg) => ({
              senderName: mapped.find(p => p.id === msg.match_id)?.name ?? "A buyer",
              preview: msg.content.slice(0, 60) + (msg.content.length > 60 ? "…" : ""),
              time: new Date(msg.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            }))
          );
        }
      }

      setLoading(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleTask = (id: number) =>
    setTasks((t) => t.map((task) => (task.id === id ? { ...task, done: !task.done } : task)));

  const today = new Date().toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" });

  const stats = [
    { icon: Users,          label: "Active Buyers",  value: pipeline.length,  color: "text-sky-600 bg-sky-50",        href: "/realtor/dashboard"  },
    { icon: UserPlus,       label: "New Leads",       value: leads.length,     color: "text-gold-dark bg-gold-light",  href: "/realtor/dashboard"   },
    { icon: MessageSquare,  label: "Unread Messages", value: unreadCount,      color: "text-violet-600 bg-violet-50",  href: "/realtor/messages"},
    { icon: CalendarDays,   label: "Tours This Week", value: 4,                color: "text-teal-600 bg-teal-50",      href: "/realtor/dashboard"},
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto">

      {/* ── Greeting ─────────────────────────────────────────────────────── */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Good morning, {realtorName} 👋</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            {pipeline.length} active buyer{pipeline.length !== 1 ? "s" : ""} · {leads.length} new lead{leads.length !== 1 ? "s" : ""}{unreadCount > 0 ? ` · ${unreadCount} unread messages` : ""}
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground bg-card border border-border px-4 py-2 rounded-xl">
          <Clock className="w-4 h-4 shrink-0" />
          {today}
        </div>
      </div>

      {/* ── Stats cards ──────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
        {stats.map(({ icon: Icon, label, value, color, href }) => (
          <Link key={label} href={href} className="bg-card border border-border rounded-2xl p-4 flex flex-col gap-2.5 hover:shadow-sm transition-shadow">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${color}`}>
              <Icon className="w-4.5 h-4.5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* ── Main column ──────────────────────────────────────────────── */}
        <div className="lg:col-span-2 space-y-8">

          {/* ═══════════════════════════════════════════════════════════
              SECTION 1 — MESSAGES
          ════════════════════════════════════════════════════════════ */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <SectionLabel>Messages</SectionLabel>
              <Link href="/realtor/messages" className="text-xs text-primary font-medium hover:underline flex items-center gap-1">
                Open inbox <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            <div className="bg-card rounded-2xl ring-1 ring-black/[0.07] shadow-[0_2px_12px_rgba(0,0,0,0.05)] overflow-hidden">
              {unreadCount > 0 ? (
                <div>
                  {/* Unread banner */}
                  <div className="flex items-center gap-3 px-5 py-3.5 border-b border-border bg-violet-50/50">
                    <div className="w-8 h-8 bg-violet-100 rounded-lg flex items-center justify-center shrink-0">
                      <Inbox className="w-4 h-4 text-violet-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-foreground">
                        {unreadCount} unread message{unreadCount !== 1 ? "s" : ""}
                      </p>
                      <p className="text-xs text-muted-foreground">From your active buyers</p>
                    </div>
                    <Link
                      href="/realtor/messages"
                      className="flex items-center gap-1.5 text-xs font-bold bg-primary text-white px-3 py-1.5 rounded-lg hover:bg-primary/90 transition-colors shrink-0"
                    >
                      Reply <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>

                  {/* Recent message previews */}
                  {recentMsgs.length > 0 && (
                    <div className="divide-y divide-border">
                      {recentMsgs.map((msg, i) => (
                        <Link key={i} href="/realtor/messages" className="flex items-start gap-3 px-5 py-3.5 hover:bg-secondary/50 transition-colors">
                          <div className={`w-8 h-8 ${AVATAR_COLORS[i % AVATAR_COLORS.length]} rounded-lg flex items-center justify-center text-white font-bold text-xs shrink-0 mt-0.5`}>
                            {msg.senderName.split(" ").map((n: string) => n[0]).join("").slice(0, 2)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-baseline gap-2">
                              <p className="text-sm font-semibold text-foreground truncate">{msg.senderName}</p>
                              <span className="text-[11px] text-muted-foreground shrink-0">{msg.time}</span>
                            </div>
                            <p className="text-xs text-muted-foreground truncate mt-0.5">{msg.preview}</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-4 px-5 py-5">
                  <div className="w-10 h-10 bg-secondary rounded-xl flex items-center justify-center shrink-0">
                    <MessageSquare className="w-5 h-5 text-muted-foreground/50" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-foreground">All caught up</p>
                    <p className="text-xs text-muted-foreground mt-0.5">No unread messages right now.</p>
                  </div>
                  <Link href="/realtor/messages" className="text-xs text-primary font-medium hover:underline shrink-0 flex items-center gap-1">
                    Open <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* ═══════════════════════════════════════════════════════════
              SECTION 2 — LEADS
          ════════════════════════════════════════════════════════════ */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <SectionLabel>New leads</SectionLabel>
              {leads.length > 0 && (
                <span className="text-xs text-muted-foreground">{leads.length} waiting for response</span>
              )}
            </div>

            {leads.length === 0 ? (
              <div className="bg-card rounded-2xl ring-1 ring-black/[0.07] p-6 text-center">
                <UserPlus className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">No new leads right now.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {leads.map((lead) => (
                  <div key={lead.id} className="bg-card rounded-2xl ring-1 ring-black/[0.07] shadow-[0_2px_12px_rgba(0,0,0,0.05)] p-5">
                    <div className="flex items-start gap-4">
                      <div className={`w-11 h-11 ${lead.color} rounded-xl flex items-center justify-center text-white font-bold text-sm shrink-0`}>
                        {lead.initials}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="font-semibold text-foreground">{lead.name}</p>
                            <p className="text-xs text-muted-foreground mt-0.5">{lead.type} · {lead.location}</p>
                          </div>
                          <span className="text-xs font-bold bg-gold-light text-gold-dark px-2.5 py-1 rounded-full shrink-0">
                            {lead.match}% match
                          </span>
                        </div>
                        <div className="grid grid-cols-3 gap-2 mt-3">
                          {[{ label: "Budget", value: lead.budget }, { label: "Timeline", value: lead.timeline }, { label: "Prefers", value: lead.style }].map(({ label, value }) => (
                            <div key={label} className="bg-secondary rounded-xl p-2.5">
                              <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">{label}</p>
                              <p className="text-xs font-semibold text-foreground mt-0.5">{value}</p>
                            </div>
                          ))}
                        </div>
                        <div className="flex gap-2 mt-3">
                          <button
                            onClick={() => setLeads(l => l.filter(x => x.id !== lead.id))}
                            className="flex items-center gap-1.5 text-xs font-bold bg-gold hover:bg-gold-hover text-white px-4 py-2 rounded-xl transition-colors"
                          >
                            <Check className="w-3.5 h-3.5" /> Accept Lead
                          </button>
                          <button
                            onClick={() => setLeads(l => l.filter(x => x.id !== lead.id))}
                            className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground border border-border px-4 py-2 rounded-xl hover:bg-secondary transition-colors"
                          >
                            <X className="w-3.5 h-3.5" /> Pass
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ═══════════════════════════════════════════════════════════
              SECTION 3 — PIPELINE STATUS
          ════════════════════════════════════════════════════════════ */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <SectionLabel>Pipeline status</SectionLabel>
              <Link href="/realtor/dashboard" className="text-xs text-primary font-medium hover:underline flex items-center gap-1">
                View all <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            {loading ? (
              <div className="bg-card rounded-2xl ring-1 ring-black/[0.07] p-6 flex items-center gap-3">
                <div className="w-5 h-5 border-2 border-muted border-t-primary rounded-full animate-spin shrink-0" />
                <p className="text-muted-foreground text-sm">Loading pipeline…</p>
              </div>
            ) : pipeline.length === 0 ? (
              <div className="bg-card rounded-2xl ring-1 ring-black/[0.07] p-6 text-center">
                <Activity className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">No active buyers yet.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {pipeline.map((buyer) => {
                  const pct = Math.round((buyer.step / 8) * 100);
                  return (
                    <div key={buyer.id} className={`bg-card border border-l-4 ${URGENCY_COLORS[buyer.urgency]} border-border rounded-2xl ring-1 ring-black/[0.06] p-5`}>
                      <div className="flex items-start gap-4">
                        <div className={`w-11 h-11 ${buyer.color} rounded-xl flex items-center justify-center text-white font-bold text-sm shrink-0`}>
                          {buyer.initials}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 flex-wrap">
                            <div>
                              <p className="font-semibold text-foreground">{buyer.name}</p>
                              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                                <MapPin className="w-3 h-3 shrink-0" />
                                {buyer.location} · {buyer.budget}
                              </p>
                            </div>
                            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full shrink-0 ${
                              buyer.urgency === "high" ? "bg-rose-100 text-rose-700"
                              : buyer.urgency === "medium" ? "bg-amber-100 text-amber-700"
                              : "bg-secondary text-muted-foreground"}`}>
                              Step {buyer.step}/8 · {buyer.stepLabel}
                            </span>
                          </div>

                          {/* Progress bar */}
                          <div className="mt-3 mb-1">
                            <div className="flex justify-between text-xs text-muted-foreground mb-1">
                              <span>Journey progress</span><span>{pct}%</span>
                            </div>
                            <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                              <div className="h-full bg-gold rounded-full" style={{ width: `${pct}%` }} />
                            </div>
                          </div>

                          {buyer.urgency === "high" && (
                            <p className="text-xs text-rose-600 font-semibold flex items-center gap-1 mt-2">
                              <Clock className="w-3 h-3" />{buyer.nextAction}
                            </p>
                          )}

                          <div className="flex gap-2 flex-wrap mt-3">
                            <Link href="/realtor/messages" className="flex items-center gap-1.5 text-xs font-semibold text-primary border border-border rounded-lg px-3 py-1.5 hover:bg-primary hover:text-white hover:border-primary transition-all">
                              <MessageSquare className="w-3.5 h-3.5" /> Message
                            </Link>
                            <Link href="/realtor/dashboard" className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground border border-border rounded-lg px-3 py-1.5 hover:bg-secondary transition-colors">
                              <TrendingUp className="w-3.5 h-3.5" /> View Profile
                            </Link>
                            <span className="text-xs text-muted-foreground flex items-center gap-1 ml-auto">
                              <Clock className="w-3 h-3" />{buyer.lastActive}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* ── Right column ─────────────────────────────────────────────── */}
        <div className="space-y-4">
          {/* Tasks */}
          <div className="bg-card border border-border rounded-2xl p-5">
            <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-gold" />
              Today&apos;s Tasks
            </h3>
            <div className="flex flex-col gap-1">
              {tasks.map((task) => (
                <button key={task.id} onClick={() => toggleTask(task.id)}
                  className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-secondary transition-colors text-left w-full">
                  {task.done
                    ? <CheckCircle2 className="w-5 h-5 text-gold shrink-0 mt-0.5" />
                    : <Circle className={`w-5 h-5 shrink-0 mt-0.5 ${task.urgent ? "text-rose-400" : "text-muted-foreground/40"}`} />}
                  <span className={`text-sm leading-snug ${task.done ? "line-through text-muted-foreground" : task.urgent ? "text-foreground font-semibold" : "text-foreground"}`}>
                    {task.text}
                  </span>
                </button>
              ))}
            </div>
            <div className="mt-3 pt-3 border-t border-border text-xs text-muted-foreground text-center">
              {tasks.filter(t => t.done).length} of {tasks.length} completed
            </div>
          </div>

          {/* Performance */}
          <div className="bg-card border border-border rounded-2xl p-5">
            <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <Activity className="w-4 h-4 text-gold" />
              Your Performance
            </h3>
            <div className="flex flex-col gap-3">
              {[
                { label: "Avg. days to close", value: "38 days" },
                { label: "Lead conversion",    value: "74%"     },
                { label: "Response time",      value: "< 1 hr"  },
                { label: "Closed (YTD)",       value: "12"      },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-center justify-between">
                  <p className="text-xs text-muted-foreground">{label}</p>
                  <span className="text-xs font-bold text-gold-dark">{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Rating */}
          <div className="bg-primary rounded-2xl p-5 text-white">
            <div className="flex items-center gap-2 mb-1">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span className="font-bold text-2xl">4.9</span>
              <span className="text-white/60 text-sm">/ 5.0</span>
            </div>
            <p className="text-white/70 text-xs mb-3">Based on 87 buyer reviews</p>
            <Link href="/realtors/paloma-aguilar" className="text-xs font-semibold text-gold-text hover:text-gold-text/80 flex items-center gap-1">
              View public profile <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
