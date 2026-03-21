import Link from "next/link";
import { MapPin } from "lucide-react";

const links = {
  Buyers: [
    { label: "How It Works", href: "/#how-it-works" },
    { label: "Browse Homes", href: "/search" },
    { label: "Get Started", href: "/onboarding" },
    { label: "Sign Up", href: "/signup" },
  ],
  Agents: [
    { label: "For Realtors", href: "/signup?role=agent" },
    { label: "Agent Login", href: "/login" },
    { label: "Join as Agent", href: "/signup?role=agent" },
  ],
  Company: [
    { label: "Home", href: "/" },
    { label: "Sign Up", href: "/signup" },
    { label: "Log In", href: "/login" },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-white">
      {/* Top gradient separator */}
      <div className="h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-14">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 mb-5">
              <div className="w-8 h-8 bg-gold rounded-[10px] flex items-center justify-center shadow-[0_1px_3px_rgba(0,0,0,0.3)]">
                <MapPin className="w-4 h-4 text-white" strokeWidth={2.5} />
              </div>
              <span className="text-white font-bold text-[17px] tracking-tight">HomePath</span>
            </Link>
            <p className="text-slate-500 text-[13px] leading-relaxed max-w-[190px]">
              The guided path to buying your home with confidence — and without the jargon.
            </p>
          </div>

          {/* Link columns */}
          {Object.entries(links).map(([group, items]) => (
            <div key={group}>
              <p className="text-white/80 font-semibold text-[13px] mb-5 tracking-wide">{group}</p>
              <ul className="flex flex-col gap-3.5">
                {items.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-slate-500 hover:text-slate-300 text-[13px] transition-colors"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/[0.07] pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-slate-600 text-[13px]">
            © {new Date().getFullYear()} HomePath, Inc. All rights reserved.
          </p>
          <div className="flex gap-6">
            {["Privacy Policy", "Terms of Service", "Cookie Policy"].map((label) => (
              <Link
                key={label}
                href="#"
                className="text-slate-600 hover:text-slate-400 text-[13px] transition-colors"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
