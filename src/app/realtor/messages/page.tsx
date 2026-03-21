"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  Send,
  ArrowLeft,
  MapPin,
  TrendingUp,
  Sparkles,
  CheckCheck,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

interface DbMessage {
  id: string;
  match_id: string;
  sender_id: string;
  content: string;
  read: boolean;
  created_at: string;
}

interface Conversation {
  matchId: string;
  matchScore: number | null;
  otherPartyName: string | null;
  otherPartyAvatar: string | null;
  buyerBudget: string | null;
  buyerLocation: string | null;
  latestMessage: DbMessage | null;
  unreadCount: number;
}

type SupabaseClient = ReturnType<typeof createClient>;

function formatTime(iso: string): string {
  const date = new Date(iso);
  const now = new Date();
  if (date.toDateString() === now.toDateString())
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  if (date.toDateString() === yesterday.toDateString()) return "Yesterday";
  return date.toLocaleDateString([], { month: "short", day: "numeric" });
}

function getInitials(name: string | null): string {
  if (!name) return "?";
  return name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
}

const AVATAR_COLORS = [
  "bg-sky-500", "bg-teal-500", "bg-amber-500", "bg-rose-500", "bg-violet-500",
];

export default function RealtorMessagesPage() {
  const supabaseRef = useRef<SupabaseClient | null>(null);

  const [userId, setUserId] = useState<string | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeMatchId, setActiveMatchId] = useState<string | null>(null);
  const [messages, setMessages] = useState<DbMessage[]>([]);
  const [input, setInput] = useState("");
  const [loadingConvos, setLoadingConvos] = useState(true);
  const [loadingMsgs, setLoadingMsgs] = useState(false);
  const [sending, setSending] = useState(false);
  const [mobileView, setMobileView] = useState<"list" | "chat">("list");

  const bottomRef = useRef<HTMLDivElement>(null);
  const channelRef = useRef<ReturnType<SupabaseClient["channel"]> | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const activeConvo = conversations.find((c) => c.matchId === activeMatchId) ?? null;

  const loadConversations = useCallback(
    async (uid: string, sb: SupabaseClient) => {
      type BuyerRow = {
        budget: string | null;
        location: string | null;
        profiles: { full_name: string | null; avatar_url: string | null } | null;
      };
      type MatchRow = {
        id: string;
        match_score: number | null;
        buyer_id: string;
        buyers: unknown;
      };

      const { data: matches } = await sb
        .from("matches")
        .select(
          `id, match_score, buyer_id,
           buyers!matches_buyer_id_fkey(budget, location,
             profiles(full_name, avatar_url))`
        )
        .eq("realtor_id", uid)
        .eq("status", "active");

      if (!matches || matches.length === 0) {
        setConversations([]);
        setLoadingConvos(false);
        return;
      }

      const convos: Conversation[] = await Promise.all(
        (matches as unknown as MatchRow[]).map(async (m, idx) => {
          const { data: latestMsg } = await sb
            .from("messages")
            .select("*")
            .eq("match_id", m.id)
            .order("created_at", { ascending: false })
            .limit(1)
            .maybeSingle();

          const { count: unread } = await sb
            .from("messages")
            .select("*", { count: "exact", head: true })
            .eq("match_id", m.id)
            .eq("read", false)
            .neq("sender_id", uid);

          const b = m.buyers as BuyerRow | null;
          return {
            matchId: m.id,
            matchScore: m.match_score,
            otherPartyName: b?.profiles?.full_name ?? `Buyer ${idx + 1}`,
            otherPartyAvatar: b?.profiles?.avatar_url ?? null,
            buyerBudget: b?.budget ?? null,
            buyerLocation: b?.location ?? null,
            latestMessage: (latestMsg as DbMessage) ?? null,
            unreadCount: unread ?? 0,
          };
        })
      );

      convos.sort((a, b) => {
        const ta = a.latestMessage?.created_at ?? a.matchId;
        const tb = b.latestMessage?.created_at ?? b.matchId;
        return tb > ta ? 1 : -1;
      });

      setConversations(convos);
      setLoadingConvos(false);
      setActiveMatchId((prev) => prev ?? convos[0]?.matchId ?? null);
    },
    []
  );

  const loadMessages = useCallback(
    async (matchId: string, uid: string, sb: SupabaseClient) => {
      setLoadingMsgs(true);
      const { data } = await sb
        .from("messages")
        .select("*")
        .eq("match_id", matchId)
        .order("created_at", { ascending: true });

      setMessages((data as DbMessage[]) ?? []);
      setLoadingMsgs(false);

      await sb
        .from("messages")
        .update({ read: true })
        .eq("match_id", matchId)
        .neq("sender_id", uid)
        .eq("read", false);

      setConversations((prev) =>
        prev.map((c) => (c.matchId === matchId ? { ...c, unreadCount: 0 } : c))
      );
    },
    []
  );

  const subscribe = useCallback(
    (matchId: string, uid: string, sb: SupabaseClient) => {
      if (channelRef.current) sb.removeChannel(channelRef.current);

      const ch = sb
        .channel(`realtor-msgs-${matchId}`)
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "messages",
            filter: `match_id=eq.${matchId}`,
          },
          async (payload) => {
            const msg = payload.new as DbMessage;
            setMessages((prev) =>
              prev.some((m) => m.id === msg.id) ? prev : [...prev, msg]
            );
            if (msg.sender_id !== uid) {
              await sb
                .from("messages")
                .update({ read: true })
                .eq("id", msg.id);
            }
            setConversations((prev) =>
              prev.map((c) =>
                c.matchId === matchId ? { ...c, latestMessage: msg } : c
              )
            );
          }
        )
        .subscribe();

      channelRef.current = ch;
    },
    []
  );

  useEffect(() => {
    const sb = createClient();
    if (!sb) { setLoadingConvos(false); return; }
    supabaseRef.current = sb;

    sb.auth.getUser().then(({ data: { user } }) => {
      if (user) { setUserId(user.id); loadConversations(user.id, sb); }
      else setLoadingConvos(false);
    });
    return () => { if (channelRef.current) sb.removeChannel(channelRef.current); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const sb = supabaseRef.current;
    if (activeMatchId && userId && sb) {
      loadMessages(activeMatchId, userId, sb);
      subscribe(activeMatchId, userId, sb);
    }
  }, [activeMatchId, userId, loadMessages, subscribe]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = useCallback(async () => {
    const text = input.trim();
    const sb = supabaseRef.current;
    if (!text || !activeMatchId || !userId || sending || !sb) return;
    setInput(""); setSending(true);

    const tempId = `temp-${Date.now()}`;
    const optimistic: DbMessage = {
      id: tempId, match_id: activeMatchId, sender_id: userId,
      content: text, read: false, created_at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, optimistic]);

    const { data: real, error } = await sb
      .from("messages")
      .insert({ match_id: activeMatchId, sender_id: userId, content: text })
      .select().single();

    if (error) {
      setMessages((prev) => prev.filter((m) => m.id !== tempId));
      setInput(text);
    } else {
      const realMsg = real as DbMessage;
      setMessages((prev) => prev.map((m) => (m.id === tempId ? realMsg : m)));
      setConversations((prev) =>
        prev.map((c) => c.matchId === activeMatchId ? { ...c, latestMessage: realMsg } : c)
      );
    }
    setSending(false);
    inputRef.current?.focus();
  }, [input, activeMatchId, userId, sending]);

  const totalUnread = conversations.reduce((s, c) => s + c.unreadCount, 0);

  if (!loadingConvos && conversations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-56px)] lg:h-screen px-4 text-center">
        <div className="w-14 h-14 bg-secondary rounded-2xl flex items-center justify-center mb-4 ring-1 ring-black/[0.06]">
          <Sparkles className="w-6 h-6 text-gold" />
        </div>
        <h2 className="text-foreground font-semibold text-lg mb-1">No conversations yet</h2>
        <p className="text-muted-foreground text-sm mb-6 max-w-xs leading-relaxed">
          Accept a lead to start your first buyer conversation.
        </p>
        <Link
          href="/realtor/dashboard"
          className="inline-flex items-center gap-2 bg-primary text-white font-semibold text-sm px-6 py-3 rounded-xl hover:bg-primary/90 transition-all"
        >
          View leads <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-56px)] lg:h-screen overflow-hidden bg-background">

      {/* Conversation list */}
      <div className={`w-full sm:w-72 shrink-0 border-r border-border bg-card flex flex-col ${mobileView === "chat" ? "hidden sm:flex" : "flex"}`}>
        <div className="px-4 py-4 border-b border-border shrink-0 flex items-center justify-between">
          <div>
            <h2 className="font-semibold text-foreground text-[15px]">Buyer Chats</h2>
            {totalUnread > 0 && (
              <p className="text-xs text-muted-foreground mt-0.5">{totalUnread} unread</p>
            )}
          </div>
        </div>

        {loadingConvos ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-muted border-t-primary rounded-full animate-spin" />
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto">
            {conversations.map((c, idx) => (
              <button
                key={c.matchId}
                onClick={() => { setActiveMatchId(c.matchId); setMobileView("chat"); }}
                className={`w-full flex items-center gap-3 px-4 py-3.5 text-left transition-colors
                  ${activeMatchId === c.matchId ? "bg-secondary border-r-2 border-r-primary" : "hover:bg-secondary/60"}`}
              >
                <div className="relative shrink-0">
                  {c.otherPartyAvatar ? (
                    <img src={c.otherPartyAvatar} alt="" className="w-10 h-10 rounded-xl object-cover" />
                  ) : (
                    <div className={`w-10 h-10 ${AVATAR_COLORS[idx % AVATAR_COLORS.length]} rounded-xl flex items-center justify-center text-white font-bold text-sm`}>
                      {getInitials(c.otherPartyName)}
                    </div>
                  )}
                  {c.unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                      {c.unreadCount > 9 ? "9+" : c.unreadCount}
                    </span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline gap-2">
                    <p className={`text-sm truncate ${c.unreadCount > 0 ? "font-bold" : "font-semibold"} text-foreground`}>
                      {c.otherPartyName}
                    </p>
                    {c.latestMessage && (
                      <span className="text-[11px] text-muted-foreground shrink-0">
                        {formatTime(c.latestMessage.created_at)}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground truncate mt-0.5">
                    {c.latestMessage
                      ? (c.latestMessage.sender_id === userId ? "You: " : "") + c.latestMessage.content
                      : "No messages yet"}
                  </p>
                  {(c.buyerBudget || c.buyerLocation) && (
                    <p className="text-[10px] text-gold-dark font-medium mt-0.5 truncate">
                      {[c.buyerLocation, c.buyerBudget].filter(Boolean).join(" · ")}
                    </p>
                  )}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Chat view */}
      {activeConvo ? (
        <div className={`flex-1 flex flex-col min-w-0 ${mobileView === "list" ? "hidden sm:flex" : "flex"}`}>
          {/* Header */}
          <div className="h-16 border-b border-border bg-card px-4 flex items-center gap-3 shrink-0">
            <button onClick={() => setMobileView("list")} className="sm:hidden text-muted-foreground hover:text-foreground p-1 -ml-1">
              <ArrowLeft className="w-5 h-5" />
            </button>

            <div className={`w-10 h-10 ${AVATAR_COLORS[conversations.findIndex(c => c.matchId === activeMatchId) % AVATAR_COLORS.length]} rounded-xl flex items-center justify-center text-white font-bold text-sm shrink-0`}>
              {getInitials(activeConvo.otherPartyName)}
            </div>

            <div className="flex-1 min-w-0">
              <p className="font-semibold text-[14px] text-foreground truncate">{activeConvo.otherPartyName}</p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                {activeConvo.buyerLocation && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 shrink-0" />{activeConvo.buyerLocation}
                  </span>
                )}
                {activeConvo.buyerBudget && (
                  <span className="flex items-center gap-1">
                    <TrendingUp className="w-3 h-3 shrink-0" />{activeConvo.buyerBudget}
                  </span>
                )}
                {activeConvo.matchScore && (
                  <span className="text-gold-dark font-semibold">· {activeConvo.matchScore}% match</span>
                )}
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-6 flex flex-col gap-2.5">
            {loadingMsgs ? (
              <div className="flex items-center justify-center py-12">
                <div className="w-6 h-6 border-2 border-muted border-t-primary rounded-full animate-spin" />
              </div>
            ) : messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <p className="font-semibold text-foreground text-[15px] mb-1">{activeConvo.otherPartyName}</p>
                {activeConvo.buyerLocation && (
                  <p className="text-muted-foreground text-sm">{activeConvo.buyerLocation} · {activeConvo.buyerBudget}</p>
                )}
                <p className="text-muted-foreground text-xs mt-3 max-w-[220px] leading-relaxed">
                  Send an intro message — buyers who hear from their agent within 1 hour are 3× more likely to commit.
                </p>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-3 my-1">
                  <div className="flex-1 h-px bg-border" />
                  <span className="text-xs text-muted-foreground font-medium px-2">Today</span>
                  <div className="flex-1 h-px bg-border" />
                </div>

                {messages.map((msg) => {
                  const isMe = msg.sender_id === userId;
                  const isTemp = msg.id.startsWith("temp-");
                  return (
                    <div key={msg.id} className={`flex items-end gap-2 ${isMe ? "flex-row-reverse" : "flex-row"}`}>
                      {!isMe && (
                        <div className={`w-7 h-7 shrink-0 mb-1 ${AVATAR_COLORS[0]} rounded-lg flex items-center justify-center text-white font-bold text-[10px]`}>
                          {getInitials(activeConvo.otherPartyName)}
                        </div>
                      )}
                      <div className={`flex flex-col gap-0.5 max-w-[72%] ${isMe ? "items-end" : "items-start"}`}>
                        <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-line transition-opacity
                          ${isMe ? "bg-primary text-white rounded-br-sm shadow-[0_1px_4px_rgba(0,0,0,0.15)]" : "bg-card border border-border text-foreground rounded-bl-sm"}
                          ${isTemp ? "opacity-60" : "opacity-100"}`}>
                          {msg.content}
                        </div>
                        <div className="flex items-center gap-1 px-1 text-[11px] text-muted-foreground">
                          <span>{formatTime(msg.created_at)}</span>
                          {isMe && !isTemp && msg.read && <CheckCheck className="w-3 h-3 text-primary" />}
                          {isTemp && <span className="text-muted-foreground/50">sending…</span>}
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={bottomRef} />
              </>
            )}
          </div>

          {/* Input */}
          <div className="border-t border-border bg-card px-4 py-3 shrink-0">
            <div className="flex items-center gap-2">
              <input
                ref={inputRef}
                type="text"
                placeholder={`Message ${activeConvo.otherPartyName?.split(" ")[0] ?? "buyer"}…`}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
                className="flex-1 bg-secondary border border-border rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                autoComplete="off"
              />
              <button
                onClick={sendMessage}
                disabled={!input.trim() || sending}
                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all shrink-0 ${input.trim() && !sending ? "bg-primary hover:bg-primary/90 text-white" : "bg-muted text-muted-foreground cursor-not-allowed"}`}
              >
                {sending ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Send className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className={`flex-1 items-center justify-center text-center p-8 ${mobileView === "list" ? "hidden sm:flex" : "flex"}`}>
          <div>
            <Send className="w-10 h-10 text-muted-foreground/20 mx-auto mb-3" />
            <p className="text-muted-foreground text-sm">Select a conversation</p>
          </div>
        </div>
      )}
    </div>
  );
}
