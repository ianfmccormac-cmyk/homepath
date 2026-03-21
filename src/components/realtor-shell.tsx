"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  UserPlus,
  CalendarDays,
  MessageSquare,
  BarChart2,
  Settings,
  MapPin,
  Menu,
  X,
  ChevronRight,
  Star,
} from "lucide-react";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/realtor/dashboard", icon: LayoutDashboard },
  { label: "My Buyers", href: "/realtor/dashboard", icon: Users },
  { label: "New Leads", href: "/realtor/dashboard", icon: UserPlus },
  { label: "Calendar", href: "/realtor/dashboard", icon: CalendarDays },
  { label: "Messages", href: "/realtor/messages", icon: MessageSquare },
  { label: "Analytics", href: "/realtor/dashboard", icon: BarChart2 },
  { label: "Settings", href: "/realtor/dashboard", icon: Settings },
];

function SidebarContent({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="h-16 flex items-center justify-between px-5 border-b border-white/10 shrink-0">
        <Link href="/" className="flex items-center gap-2" onClick={onClose}>
          <div className="w-8 h-8 bg-gold rounded-lg flex items-center justify-center">
            <MapPin className="w-4 h-4 text-white" strokeWidth={2.5} />
          </div>
          <div>
            <span className="text-white font-semibold text-base leading-none">
              HomePath
            </span>
            <span className="block text-white/40 text-[10px] leading-none mt-0.5 font-medium uppercase tracking-wider">
              Agent Portal
            </span>
          </div>
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

      {/* Nav */}
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
              <Icon className="w-4 h-4 shrink-0" />
              <span className="flex-1">{label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Agent profile strip */}
      <div className="px-3 pb-4 shrink-0">
        <div className="flex items-center gap-3 bg-white/8 rounded-xl px-3 py-3 border border-white/10">
          <div className="w-9 h-9 bg-violet-500 rounded-xl flex items-center justify-center text-white font-bold text-sm shrink-0">
            PA
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-xs font-semibold truncate">
              Paloma Aguilar
            </p>
            <div className="flex items-center gap-1 mt-0.5">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span className="text-white/50 text-[11px]">4.9 · Austin, TX</span>
            </div>
          </div>
          <Link href="/realtor/settings" onClick={onClose}>
            <ChevronRight className="w-3.5 h-3.5 text-white/30" />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function RealtorShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-background">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-60 bg-primary flex-col fixed inset-y-0 left-0 z-30">
        <SidebarContent />
      </aside>

      {/* Mobile overlay */}
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

      {/* Main */}
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
            <span className="text-white font-semibold text-sm">
              HomePath Agent
            </span>
          </div>
        </div>

        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
