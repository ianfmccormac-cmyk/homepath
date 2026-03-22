import Link from "next/link";
import { ClipboardList, UserCheck, KeyRound, ArrowRight, PhoneOff, Wallet, Zap } from "lucide-react";

const steps = [
  {
    num: "01",
    icon: ClipboardList,
    title: "Tell us what you're looking for",
    description:
      "Answer 5 quick questions — your budget, timeline, and how you like to communicate. Takes under 5 minutes and there's zero commitment required.",
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
      "Your personal dashboard guides you through every stage — from getting your lending letter to signing the final papers and picking up your keys. We explain everything in plain English along the way.",
    note: "Never heard of 'escrow' or 'contingency'? We explain every term before you hit it.",
  },
];

export default function HowItWorks() {
  return (
    <section className="bg-secondary py-16 sm:py-20 md:py-28 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10 md:mb-16">
          <p className="text-gold-dark font-semibold text-xs uppercase tracking-[0.12em] mb-3">
            How it works
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight">
            From first search to{" "}
            <span className="text-primary">keys in hand</span>
          </h2>
          <p className="mt-4 text-muted-foreground text-[17px] max-w-lg mx-auto leading-relaxed">
            We take the guesswork — and the jargon — out of home buying, so
            you always know exactly what to do next.
          </p>
        </div>

        {/* Steps grid */}
        <div className="grid md:grid-cols-3 gap-5 relative">
          {/* Connector line (desktop only) */}
          <div className="hidden md:block absolute top-11 left-[calc(16.66%-12px)] right-[calc(16.66%-12px)] h-px bg-gradient-to-r from-transparent via-border to-transparent z-0" />

          {steps.map(({ num, icon: Icon, title, description, note }) => (
            <div
              key={num}
              className="relative bg-card rounded-2xl p-6 sm:p-8 ring-1 ring-black/[0.06] shadow-[0_2px_20px_rgba(0,0,0,0.05),0_1px_4px_rgba(0,0,0,0.04)] z-10 flex flex-col gap-5"
            >
              {/* Step number + icon row */}
              <div className="flex items-start justify-between">
                <div className="w-11 h-11 bg-gradient-to-br from-primary/[0.09] to-primary/[0.05] rounded-[14px] flex items-center justify-center ring-1 ring-primary/[0.08]">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <span className="text-[72px] font-black text-muted-foreground/[0.07] leading-none select-none -mt-2 -mr-1 tabular-nums">
                  {num}
                </span>
              </div>

              <div className="flex flex-col gap-3">
                <h3 className="text-[17px] font-bold text-foreground leading-snug">{title}</h3>
                <p className="text-muted-foreground text-[14px] leading-relaxed">
                  {description}
                </p>
              </div>

              {/* First-timer reassurance note */}
              {note && (
                <p className="text-[13px] text-gold-dark bg-gold-light border border-gold-subtle rounded-xl px-3.5 py-3 leading-relaxed">
                  {note}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <Link
            href="/onboarding"
            className="inline-flex items-center gap-2 text-primary font-semibold text-[15px] hover:gap-3 transition-all group"
          >
            Start my journey
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* Why HomePath — competitor differentiation */}
        <div className="mt-16 pt-10 border-t border-border grid sm:grid-cols-3 gap-6">
          {[
            { icon: PhoneOff, title: "No cold calls, ever", desc: "Your phone number stays private until you choose to share it." },
            { icon: Wallet, title: "Always free for buyers", desc: "We earn from agents — not from you. Zero hidden fees." },
            { icon: Zap, title: "Matched, not browsed", desc: "We find the right agent for you — you don't have to search." },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex flex-col items-center sm:items-start gap-3 text-center sm:text-left">
              <div className="w-10 h-10 bg-primary/[0.07] rounded-[12px] flex items-center justify-center ring-1 ring-primary/[0.08]">
                <Icon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-foreground text-[15px]">{title}</p>
                <p className="text-muted-foreground text-[13px] mt-1 leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
