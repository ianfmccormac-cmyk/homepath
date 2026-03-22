"use client";

import { useState } from "react";
import Link from "next/link";
import { MapPin, Menu, X } from "lucide-react";

const navLinks = [
  { label: "How It Works", href: "/#how-it-works" },
  { label: "Browse Homes", href: "/search" },
  { label: "For Agents",   href: "/signup?role=agent" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-primary/[0.97] backdrop-blur-xl border-b border-white/[0.06]">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-[60px] flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0">
          <div className="w-8 h-8 bg-emerald-600 rounded-[10px] flex items-center justify-center shadow-[0_1px_3px_rgba(0,0,0,0.25),inset_0_1px_0_rgba(255,255,255,0.15)] transition-transform duration-200 hover:scale-[1.05] active:scale-[0.97]">
            <MapPin className="w-4 h-4 text-white" strokeWidth={2.5} />
          </div>
          <span className="text-white font-bold text-[17px] tracking-tight">HomePath</span>
        </Link>

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center gap-0.5">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-white/55 hover:text-white/90 text-[13px] font-medium transition-colors duration-150 px-3.5 py-2 rounded-lg hover:bg-white/[0.05]"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Desktop CTAs */}
        <div className="hidden md:flex items-center gap-1.5">
          <Link
            href="/login"
            className="text-white/55 hover:text-white text-[13px] font-medium transition-colors duration-150 px-4 py-2 rounded-lg hover:bg-white/[0.05]"
          >
            Log in
          </Link>
          <Link
            href="/onboarding"
            className="bg-gold hover:bg-gold-hover active:scale-[0.97] text-white text-[13px] font-semibold px-5 py-2 rounded-xl transition-all duration-150 shadow-[0_1px_3px_rgba(0,0,0,0.25),inset_0_1px_0_rgba(255,255,255,0.12),0_0_0_0_rgba(5,150,105,0)] hover:shadow-[0_1px_3px_rgba(0,0,0,0.25),inset_0_1px_0_rgba(255,255,255,0.12),0_0_20px_rgba(5,150,105,0.25)]"
          >
            Get Started
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-white/60 hover:text-white p-2 -mr-2 rounded-lg hover:bg-white/[0.05] transition-colors duration-150"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-primary/[0.98] backdrop-blur-xl border-t border-white/[0.06] px-4 py-4 flex flex-col gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-white/60 hover:text-white text-[13px] font-medium py-2.5 px-3 rounded-lg hover:bg-white/[0.05] transition-colors duration-150"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <div className="flex flex-col gap-2 pt-3 mt-1 border-t border-white/[0.06]">
            <Link
              href="/login"
              className="text-center text-white/65 hover:text-white text-[13px] font-medium py-2.5 rounded-xl border border-white/[0.12] hover:border-white/[0.25] transition-all duration-150"
              onClick={() => setMobileOpen(false)}
            >
              Log in
            </Link>
            <Link
              href="/onboarding"
              className="text-center bg-gold hover:bg-gold-hover active:scale-[0.98] text-white text-[13px] font-semibold py-3 rounded-xl transition-all duration-150 shadow-[0_1px_3px_rgba(0,0,0,0.3)]"
              onClick={() => setMobileOpen(false)}
            >
              Get Started — Free
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
