"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Search,
  Heart,
  CalendarDays,
  FileSignature,
  FileText,
  MessageSquare,
  Settings,
  MapPin,
  Menu,
  X,
  ChevronRight,
  LogOut,
  Sparkles,
} from "lucide-react";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "My Matches", href: "/dashboard/matches", icon: Sparkles },
  { label: "Search Homes", href: "/search", icon: Search },
  { label: "Saved", href: "/search", icon: Heart },
  { label: "Tours", href: "/dashboard", icon: CalendarDays },
  { label: "Offers", href: "/offers/new", icon: FileSignature },
  { label: "Documents", href: "/dashboard", icon: FileText },
  { label: "Messages", href: "/dashboard/messages", icon: MessageSquare },
  { label: "Settings", href: "/dashboard", icon: Settings },
];

function SidebarContent({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();
    if (!supabase) return;
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("full_name")
          .eq("id", user.id)
          .single();
        setUserName(profile?.full_name ?? null);
      }
    });
  }, []);

  const handleSignOut = async () => {
    const supabase = createClient();
    if (supabase) await supabase.auth.signOut();
    window.location.href = "/login";
  };

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="h-16 flex items-center justify-between px-5 border-b border-white/10 shrink-0">
        <Link
          href="/"
          className="flex items-center gap-2"
          onClick={onClose}
        >
          <div className="w-8 h-8 bg-gold rounded-lg flex items-center justify-center">
            <MapPin className="w-4 h-4 text-white" strokeWidth={2.5} />
          </div>
          <span className="text-white font-semibold text-lg">HomePath</span>
        </Link>
        {onClose && (
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Nav items */}
      <nav className="flex-1 px-3 py-4 flex flex-col gap-0.5 overflow-y-auto">
        {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={`${href}-${label}`}
              href={href}
              onClick={onClose}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                active
                  ? "bg-white/15 text-white"
                  : "text-white/60 hover:text-white hover:bg-white/8"
              }`}
            >
              <Icon className="w-4.5 h-4.5 shrink-0" />
              <span className="flex-1">{label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom: user card + sign out */}
      <div className="px-3 pb-4 shrink-0 flex flex-col gap-2">
        <Link
          href="/realtors/paloma-aguilar"
          className="flex items-center gap-3 bg-white/8 hover:bg-white/15 rounded-xl px-3 py-3 transition-colors border border-white/10"
          onClick={onClose}
        >
          <div className="w-9 h-9 bg-violet-500 rounded-xl flex items-center justify-center text-white font-bold text-sm shrink-0">
            PA
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-xs font-semibold truncate">Paloma Aguilar</p>
            <p className="text-white/50 text-[11px]">Your matched agent</p>
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-white/30 shrink-0" />
        </Link>
        {userName && (
          <div className="flex items-center justify-between px-3 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.06]">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 bg-primary/60 rounded-lg flex items-center justify-center text-white font-bold text-[11px] shrink-0">
                {userName.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
              </div>
              <p className="text-white/70 text-xs font-medium truncate">{userName}</p>
            </div>
            <button
              onClick={handleSignOut}
              className="text-white/30 hover:text-white/70 transition-colors p-1 rounded-lg hover:bg-white/[0.08]"
              title="Sign out"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-background">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-60 bg-primary flex-col fixed inset-y-0 left-0 z-30">
        <SidebarContent />
      </aside>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/40 z-40 lg:hidden"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="fixed inset-y-0 left-0 w-72 bg-primary z-50 flex flex-col lg:hidden">
            <SidebarContent onClose={() => setMobileOpen(false)} />
          </aside>
        </>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col lg:pl-60">
        {/* Mobile top bar */}
        <div className="lg:hidden bg-primary h-14 flex items-center gap-3 px-4 sticky top-0 z-20">
          <button
            onClick={() => setMobileOpen(true)}
            className="text-white/80 hover:text-white"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-gold rounded-lg flex items-center justify-center">
              <MapPin className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />
            </div>
            <span className="text-white font-semibold">HomePath</span>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
