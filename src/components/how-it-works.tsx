import Link from "next/link";
import { ClipboardList, UserCheck, KeyRound, ArrowRight, PhoneOff, Wallet, Zap } from "lucide-react";

const steps = [
  {
    num: "01",
    icon: ClipboardList,
    title: "Tell us what you're looking for",
    description:
      "Answer 5 quick questions about your budget, timeline, and how you like to communicate. Takes under 5 minutes, zero commitment.",
    note: null,
  },
  {
    num: "02",
    icon: UserCheck,
    title: "Meet your matched agent",
    description:
      "We pair you with a vetted local agent who fits your needs. Review their profile, watch their 60-second intro, and message them whenever you're ready.",
    note: "Agents on HomePath are background-checked and reviewed by real buyers.",
  },
  {
    num: "03",
    icon: KeyRound,
    title: "Get the keys — step by step",
    description:
      "Your dashboard guides you through every stage — from your lending letter to signing the final papers. Every term explained in plain English.",
    note: "Never heard of 'escrow' or 'contingency'? We explain every term before you hit it.",
  },
];

const WHY = [
  { icon: PhoneOff, title: "No cold calls, ever",     desc: "Your phone number stays private until you choose to share it." },
  { icon: Wallet,   title: "Always free for buyers",  desc: "We earn from agents — not from you. Zero hidden fees." },
  { icon: Zap,      title: "Matched, not browsed",    desc: "We find the right agent for you — you don't have to search." },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-secondary py-24 md:py-32 lg:py-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-16 md:mb-20">
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-3.5 py-1.5 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span className="text-emerald-700 text-[11px] font-bold tracking-widest uppercase">How it works</span>
          </div>
          <h2 className="text-[32px] md:text-[44px] font-extrabold text-foreground tracking-tight leading-[1.08] mb-5">
            From first search to{" "}
            <span className="text-primary">keys in hand</span>
          </h2>
          <p className="text-muted-foreground text-[17px] max-w-[500px] mx-auto leading-relaxed">
            We take the guesswork — and the jargon — out of home buying, so
            you always know exactly what to do next.
          </p>
        </div>

        {/* Steps grid */}
        <div className="grid md:grid-cols-3 gap-4 lg:gap-6 relative">
          {/* Connector line */}
          <div className="hidden md:block absolute top-[52px] left-[calc(16.66%-12px)] right-[calc(16.66%-12px)] h-px bg-gradient-to-r from-transparent via-border to-transparent z-0" />

          {steps.map(({ num, icon: Icon, title, description, note }) => (
            <div
              key={num}
              className="relative bg-card rounded-2xl p-7 sm:p-8 ring-1 ring-black/[0.05] shadow-[0_2px_16px_rgba(0,0,0,0.04)] z-10 flex flex-col gap-6 hover:shadow-[0_12px_40px_rgba(0,0,0,0.09)] hover:-translate-y-0.5 transition-all duration-300"
            >
              {/* Icon + step number */}
              <div className="flex items-start justify-between">
                <div className="w-12 h-12 bg-gradient-to-br from-primary/[0.08] to-primary/[0.04] rounded-[14px] flex items-center justify-center ring-1 ring-primary/[0.08]">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <span className="text-[80px] font-black text-muted-foreground/[0.06] leading-none select-none tabular-nums -mt-3 -mr-1">
                  {num}
                </span>
              </div>

              <div className="flex flex-col gap-3">
                <h3 className="text-[17px] font-bold text-foreground leading-snug tracking-tight">{title}</h3>
                <p className="text-muted-foreground text-[14px] leading-relaxed">{description}</p>
              </div>

              {note && (
                <p className="text-[13px] text-gold-dark bg-gold-light border border-gold-subtle rounded-xl px-4 py-3 leading-relaxed mt-auto">
                  {note}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Link CTA */}
        <div className="text-center mt-12">
          <Link
            href="/onboarding"
            className="inline-flex items-center gap-2 text-primary font-semibold text-[15px] hover:gap-3 transition-all duration-200 group"
          >
            Start my journey
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* Why HomePath */}
        <div className="mt-20 pt-14 border-t border-border grid sm:grid-cols-3 gap-8 lg:gap-12">
          {WHY.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex flex-col items-center sm:items-start gap-4 text-center sm:text-left">
              <div className="w-11 h-11 bg-primary/[0.07] rounded-[14px] flex items-center justify-center ring-1 ring-primary/[0.07]">
                <Icon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-bold text-foreground text-[15px] tracking-tight">{title}</p>
                <p className="text-muted-foreground text-[13px] mt-1.5 leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
