import Link from "next/link";
import { ClipboardList, UserCheck, KeyRound, ArrowRight } from "lucide-react";

const steps = [
  {
    num: 1,
    icon: ClipboardList,
    title: "Tell us what you're looking for",
    description:
      "Answer 5 questions about your budget, timeline, and communication style. Under 5 minutes, no commitment.",
    note: null,
  },
  {
    num: 2,
    icon: UserCheck,
    title: "Meet your matched agent",
    description:
      "We pair you with a vetted local agent who fits your needs. Review their profile and message them when you're ready.",
    note: "Every agent is background-checked and reviewed by real buyers.",
  },
  {
    num: 3,
    icon: KeyRound,
    title: "Get the keys — step by step",
    description:
      "Your dashboard guides you from your lending letter to signing day. Every term explained in plain English before you need it.",
    note: "Never heard of 'escrow'? We explain every term before you hit it.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-secondary py-24 md:py-32 lg:py-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="max-w-xl mb-16 md:mb-20">
          <p className="text-gold-dark text-[12px] font-bold uppercase tracking-[0.14em] mb-4">
            How it works
          </p>
          <h2 className="text-[32px] md:text-[44px] font-extrabold text-foreground tracking-tight leading-[1.06] mb-5">
            From first search to keys in hand
          </h2>
          <p className="text-muted-foreground text-[17px] leading-relaxed">
            No guesswork. No jargon. Just a clear path from where you are now
            to the day you pick up your keys.
          </p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-4 lg:gap-5">
          {steps.map(({ num, icon: Icon, title, description, note }) => (
            <div
              key={num}
              className="bg-card rounded-2xl p-7 ring-1 ring-black/[0.05] shadow-[0_1px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.09)] hover:-translate-y-0.5 transition-all duration-300 flex flex-col gap-6"
            >
              {/* Step indicator + icon */}
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-full bg-primary/[0.08] border border-primary/[0.12] flex items-center justify-center shrink-0">
                  <span className="text-primary font-bold text-[12px]">{num}</span>
                </div>
                <div className="w-9 h-9 bg-primary/[0.06] rounded-[11px] flex items-center justify-center">
                  <Icon className="w-4.5 h-4.5 text-primary" strokeWidth={1.75} />
                </div>
              </div>

              {/* Copy */}
              <div className="flex flex-col gap-2.5">
                <h3 className="text-[16px] font-bold text-foreground leading-snug tracking-tight">
                  {title}
                </h3>
                <p className="text-muted-foreground text-[14px] leading-relaxed">
                  {description}
                </p>
              </div>

              {/* Reassurance note */}
              {note && (
                <p className="text-[12.5px] text-gold-dark bg-gold-light border border-gold-subtle rounded-xl px-4 py-3 leading-relaxed mt-auto">
                  {note}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12">
          <Link
            href="/onboarding"
            className="inline-flex items-center gap-2 text-primary font-semibold text-[15px] hover:gap-3 transition-all duration-200 group"
          >
            Start my journey
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}
