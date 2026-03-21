import Link from "next/link";
import {
  Search,
  FileCheck,
  UserCheck,
  CalendarDays,
  FileSignature,
  MessageSquare,
  ClipboardCheck,
  PartyPopper,
} from "lucide-react";

const steps = [
  {
    num: 1,
    icon: Search,
    label: "Browse Homes",
    desc: "Explore listings that match your criteria",
    active: true,
  },
  {
    num: 2,
    icon: FileCheck,
    label: "Get Pre-Approved",
    desc: "Understand your buying power in minutes",
    active: false,
  },
  {
    num: 3,
    icon: UserCheck,
    label: "Match with Agent",
    desc: "Your expert guide through every step",
    active: false,
  },
  {
    num: 4,
    icon: CalendarDays,
    label: "Schedule Tours",
    desc: "See homes in person with your agent",
    active: false,
  },
  {
    num: 5,
    icon: FileSignature,
    label: "Submit Offer",
    desc: "Guided offer flow with plain-English help",
    active: false,
  },
  {
    num: 6,
    icon: MessageSquare,
    label: "Negotiate",
    desc: "Your agent handles all counteroffers",
    active: false,
  },
  {
    num: 7,
    icon: ClipboardCheck,
    label: "Inspection",
    desc: "Know exactly what you're buying",
    active: false,
  },
  {
    num: 8,
    icon: PartyPopper,
    label: "Close",
    desc: "Sign the papers. Get the keys.",
    active: false,
  },
];

export default function JourneyPreview() {
  return (
    <section className="bg-card py-20 md:py-28 border-y border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14">
          <p className="text-gold-dark font-semibold text-sm uppercase tracking-widest mb-3">
            Your roadmap
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight">
            Every step, <span className="text-primary">clearly mapped out</span>
          </h2>
          <p className="mt-4 text-muted-foreground text-lg max-w-xl mx-auto">
            HomePath guides you through all 8 stages of home buying. You always
            know exactly where you are and what comes next.
          </p>
        </div>

        {/* Steps grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.num}
                className={`relative flex flex-col items-center text-center gap-2 p-4 rounded-2xl border transition-all ${
                  step.active
                    ? "bg-primary border-primary text-white shadow-lg shadow-primary/20"
                    : "bg-secondary border-border text-foreground"
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    step.active ? "bg-white/15" : "bg-muted"
                  }`}
                >
                  <Icon
                    className={`w-5 h-5 ${step.active ? "text-white" : "text-primary"}`}
                  />
                </div>
                <span
                  className={`text-xs font-bold ${step.active ? "text-gold-text" : "text-muted-foreground"}`}
                >
                  Step {step.num}
                </span>
                <span
                  className={`text-xs font-semibold leading-tight ${step.active ? "text-white" : "text-foreground"}`}
                >
                  {step.label}
                </span>
                <p
                  className={`text-[11px] leading-relaxed hidden lg:block ${step.active ? "text-white/70" : "text-muted-foreground"}`}
                >
                  {step.desc}
                </p>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <p className="text-muted-foreground mb-5">
            We guide you through every one of these steps — together.
          </p>
          <Link
            href="/onboarding"
            className="inline-flex items-center justify-center bg-primary hover:bg-primary/90 text-white font-semibold px-8 py-3.5 rounded-xl transition-colors shadow-sm"
          >
            Start My Journey
          </Link>
        </div>
      </div>
    </section>
  );
}
