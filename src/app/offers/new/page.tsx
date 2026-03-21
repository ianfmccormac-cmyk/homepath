"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  MapPin,
  ArrowLeft,
  ArrowRight,
  Info,
  CheckCircle2,
  ShieldCheck,
  Banknote,
  Calendar,
  FileText,
  PartyPopper,
} from "lucide-react";
import { JargonTip } from "@/components/jargon-tip";

// ─── Types ──────────────────────────────────────────────────────────────────
type OfferState = {
  propertyId: number | null;
  offerPrice: string;
  earnestMoney: string;
  contingencies: {
    inspection: boolean;
    financing: boolean;
    appraisal: boolean;
  };
  closeDate: string;
  possessionDate: string;
  agentNote: string;
};

// ─── Mock saved homes ────────────────────────────────────────────────────────
const PROPERTIES = [
  { id: 1, address: "124 Oak Street", city: "Austin, TX 78701", price: 485000, beds: 3, baths: 2, gradient: "from-emerald-100 to-teal-200" },
  { id: 2, address: "55 Maple Avenue", city: "Austin, TX 78704", price: 672000, beds: 4, baths: 3, gradient: "from-sky-100 to-blue-200" },
  { id: 3, address: "712 Pine Street", city: "Austin, TX 78702", price: 525000, beds: 3, baths: 2, gradient: "from-violet-100 to-purple-200" },
];

const STEP_LABELS = ["Property", "Price", "Contingencies", "Timeline", "Review"];

function Callout({ text }: { text: string }) {
  return (
    <div className="flex gap-3 bg-sky-50 border border-sky-200 rounded-xl px-4 py-3 text-sm text-sky-800 leading-relaxed">
      <Info className="w-4 h-4 text-sky-500 shrink-0 mt-0.5" />
      <p>{text}</p>
    </div>
  );
}

function ToggleCard({
  icon: Icon,
  title,
  description,
  callout,
  checked,
  onToggle,
  recommended,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  callout: string;
  checked: boolean;
  onToggle: () => void;
  recommended?: boolean;
}) {
  return (
    <button
      onClick={onToggle}
      className={`w-full text-left p-5 rounded-xl border-2 transition-all ${
        checked
          ? "border-primary bg-primary/5"
          : "border-border bg-card hover:border-primary/40"
      }`}
    >
      <div className="flex items-start gap-3">
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
            checked ? "bg-primary text-white" : "bg-secondary text-muted-foreground"
          }`}
        >
          <Icon className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="font-semibold text-foreground">{title}</p>
            {recommended && (
              <span className="text-[10px] font-bold bg-gold-light text-gold-dark px-2 py-0.5 rounded-full uppercase tracking-wide">
                Recommended
              </span>
            )}
          </div>
          <p className="text-sm text-muted-foreground mt-1 leading-snug">
            {description}
          </p>
          <p className="text-xs text-sky-700 mt-2 bg-sky-50 px-3 py-2 rounded-lg border border-sky-100">
            💡 {callout}
          </p>
        </div>
        <div
          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
            checked ? "bg-primary border-primary" : "border-muted-foreground/40"
          }`}
        >
          {checked && <CheckCircle2 className="w-4 h-4 text-white fill-white" />}
        </div>
      </div>
    </button>
  );
}

function formatPrice(n: number) {
  return `$${n.toLocaleString()}`;
}

export default function MakeOfferPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [offer, setOffer] = useState<OfferState>({
    propertyId: null,
    offerPrice: "",
    earnestMoney: "",
    contingencies: { inspection: true, financing: true, appraisal: false },
    closeDate: "",
    possessionDate: "",
    agentNote: "",
  });

  const TOTAL_STEPS = STEP_LABELS.length;
  const progress = Math.round((step / TOTAL_STEPS) * 100);
  const selectedProperty = PROPERTIES.find((p) => p.id === offer.propertyId);

  const canProceed =
    (step === 1 && offer.propertyId !== null) ||
    (step === 2 && offer.offerPrice.length > 0) ||
    step === 3 ||
    (step === 4 && offer.closeDate.length > 0) ||
    step === 5;

  const handleNext = () => {
    if (step < TOTAL_STEPS) setStep((s) => s + 1);
    else handleSubmit();
  };

  const handleSubmit = () => setSubmitted(true);

  const toggleContingency = (key: keyof OfferState["contingencies"]) =>
    setOffer((o) => ({
      ...o,
      contingencies: { ...o.contingencies, [key]: !o.contingencies[key] },
    }));

  // ── Success screen ──────────────────────────────────────────────────────
  if (submitted) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 text-center">
        <div className="w-20 h-20 bg-gold-light rounded-full flex items-center justify-center mb-6">
          <PartyPopper className="w-10 h-10 text-gold-dark" />
        </div>
        <h1 className="text-3xl font-bold text-foreground mb-3">
          Offer submitted! 🎉
        </h1>
        <p className="text-muted-foreground max-w-sm mb-8 leading-relaxed">
          Your offer on{" "}
          <span className="font-semibold text-foreground">
            {selectedProperty?.address}
          </span>{" "}
          has been sent to Paloma Aguilar. She&apos;ll be in touch within the hour.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center gap-2 bg-primary text-white font-semibold px-8 py-3.5 rounded-xl hover:bg-primary/90 transition-colors"
          >
            Back to Dashboard
          </Link>
          <Link
            href="/dashboard/messages"
            className="inline-flex items-center justify-center gap-2 border border-border text-foreground font-semibold px-8 py-3.5 rounded-xl hover:bg-secondary transition-colors"
          >
            Message Paloma
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="bg-primary h-16 flex items-center px-6 shrink-0">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gold rounded-lg flex items-center justify-center">
            <MapPin className="w-4 h-4 text-white" strokeWidth={2.5} />
          </div>
          <span className="text-white font-semibold text-lg">HomePath</span>
        </Link>
      </header>

      {/* Progress */}
      <div className="bg-card border-b border-border shrink-0">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex justify-between mb-2">
            {STEP_LABELS.map((label, i) => (
              <span
                key={label}
                className={`text-xs font-semibold transition-colors ${
                  i + 1 < step
                    ? "text-gold-dark"
                    : i + 1 === step
                      ? "text-primary"
                      : "text-muted-foreground/50"
                }`}
              >
                {i + 1 < step ? `✓ ${label}` : label}
              </span>
            ))}
          </div>
          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-gold rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-1.5">
            Step {step} of {TOTAL_STEPS} — Making an offer
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex items-start justify-center px-4 py-10">
        <div className="w-full max-w-xl flex flex-col gap-6">

          {/* ── Step 1: Property ── */}
          {step === 1 && (
            <div>
              <p className="text-gold-dark font-semibold text-sm uppercase tracking-widest mb-3">
                Step 1 — Choose Property
              </p>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Which home are you making an offer on?
              </h1>
              <p className="text-muted-foreground mb-6">
                Select from your saved homes below.
              </p>
              <div className="flex flex-col gap-3">
                {PROPERTIES.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setOffer((o) => ({ ...o, propertyId: p.id }))}
                    className={`flex items-center gap-4 p-4 rounded-2xl border-2 text-left transition-all ${
                      offer.propertyId === p.id
                        ? "border-primary bg-primary/5"
                        : "border-border bg-card hover:border-primary/40"
                    }`}
                  >
                    <div
                      className={`w-16 h-16 rounded-xl bg-gradient-to-br ${p.gradient} shrink-0`}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-foreground">
                        {p.address}
                      </p>
                      <p className="text-xs text-muted-foreground">{p.city}</p>
                      <p className="text-sm font-bold text-primary mt-1">
                        {formatPrice(p.price)}{" "}
                        <span className="font-normal text-muted-foreground">
                          · {p.beds}bd/{p.baths}ba
                        </span>
                      </p>
                    </div>
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                        offer.propertyId === p.id
                          ? "bg-primary border-primary"
                          : "border-muted-foreground/40"
                      }`}
                    >
                      {offer.propertyId === p.id && (
                        <div className="w-2.5 h-2.5 rounded-full bg-white" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ── Step 2: Price ── */}
          {step === 2 && selectedProperty && (
            <div>
              <p className="text-gold-dark font-semibold text-sm uppercase tracking-widest mb-3">
                Step 2 — Set Your Price
              </p>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                What&apos;s your offer?
              </h1>
              <p className="text-muted-foreground mb-6">
                The asking price is{" "}
                <span className="font-semibold text-foreground">
                  {formatPrice(selectedProperty.price)}
                </span>
                . Your agent will advise on the right strategy.
              </p>

              <div className="flex flex-col gap-5">
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Offer Price
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-semibold">
                      $
                    </span>
                    <input
                      type="number"
                      placeholder={String(selectedProperty.price)}
                      value={offer.offerPrice}
                      onChange={(e) =>
                        setOffer((o) => ({ ...o, offerPrice: e.target.value }))
                      }
                      className="w-full border border-border rounded-xl pl-8 pr-4 py-3.5 text-base font-semibold focus:outline-none focus:ring-2 focus:ring-primary/40 bg-card text-foreground"
                    />
                  </div>
                  {offer.offerPrice && (
                    <p
                      className={`text-xs mt-1.5 font-medium ${
                        Number(offer.offerPrice) < selectedProperty.price
                          ? "text-amber-600"
                          : Number(offer.offerPrice) > selectedProperty.price
                            ? "text-gold-dark"
                            : "text-muted-foreground"
                      }`}
                    >
                      {Number(offer.offerPrice) < selectedProperty.price
                        ? `$${(selectedProperty.price - Number(offer.offerPrice)).toLocaleString()} below asking`
                        : Number(offer.offerPrice) > selectedProperty.price
                          ? `$${(Number(offer.offerPrice) - selectedProperty.price).toLocaleString()} above asking`
                          : "Matching asking price"}
                    </p>
                  )}
                </div>

                <Callout text="In a competitive market like Austin, offering at or slightly above asking price improves your chances. Your agent can pull comparable sales to advise you." />

                <div>
                  <label className="block text-sm font-semibold text-foreground mb-1">
                    <JargonTip
                      term="Earnest Money Deposit"
                      definition="A good-faith deposit you pay upfront to show the seller you're serious. Usually 1–3% of the home price. The good news: if the deal falls through under your contingency conditions, you get it back."
                    >
                      Earnest Money Deposit
                    </JargonTip>
                  </label>
                  <p className="text-xs text-muted-foreground mb-2">
                    Typically 1–2% of your offer price (
                    {offer.offerPrice
                      ? formatPrice(Math.round(Number(offer.offerPrice) * 0.01))
                      : "$4,800–$9,700"}
                    )
                  </p>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-semibold">
                      $
                    </span>
                    <input
                      type="number"
                      placeholder="5000"
                      value={offer.earnestMoney}
                      onChange={(e) =>
                        setOffer((o) => ({
                          ...o,
                          earnestMoney: e.target.value,
                        }))
                      }
                      className="w-full border border-border rounded-xl pl-8 pr-4 py-3.5 text-base font-semibold focus:outline-none focus:ring-2 focus:ring-primary/40 bg-card text-foreground"
                    />
                  </div>
                </div>

                <Callout text='Earnest money is like a handshake in dollars — it tells the seller you&apos;re serious. The good news: you get it back if the deal falls through under your contingency conditions.' />
              </div>
            </div>
          )}

          {/* ── Step 3: Contingencies ── */}
          {step === 3 && (
            <div>
              <p className="text-gold-dark font-semibold text-sm uppercase tracking-widest mb-3">
                Step 3 — Protections
              </p>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Choose your contingencies
              </h1>
              <p className="text-muted-foreground mb-6">
                Contingencies protect you. Toggle each one to understand what
                it does and decide if you want it.
              </p>
              <div className="flex flex-col gap-3">
                <ToggleCard
                  icon={ShieldCheck}
                  title="Inspection Contingency"
                  description="Lets you hire an expert to inspect the home for problems before finalizing."
                  callout="If the inspector finds major issues, you can request repairs, renegotiate, or walk away with your deposit. Highly recommended for first-time buyers."
                  checked={offer.contingencies.inspection}
                  onToggle={() => toggleContingency("inspection")}
                  recommended
                />
                <ToggleCard
                  icon={Banknote}
                  title="Financing Contingency"
                  description="Protects you if your mortgage loan falls through before closing."
                  callout="Essential if you're not paying cash. If your lender backs out for any reason, you can cancel the deal without losing your earnest money."
                  checked={offer.contingencies.financing}
                  onToggle={() => toggleContingency("financing")}
                  recommended
                />
                <ToggleCard
                  icon={FileText}
                  title="Appraisal Contingency"
                  description="Protects you if the home appraises for less than your offer price."
                  callout="If the appraised value comes in low, you can renegotiate the price or walk away. Without this, you'd have to pay the difference out-of-pocket."
                  checked={offer.contingencies.appraisal}
                  onToggle={() => toggleContingency("appraisal")}
                />
              </div>
            </div>
          )}

          {/* ── Step 4: Timeline ── */}
          {step === 4 && (
            <div>
              <p className="text-gold-dark font-semibold text-sm uppercase tracking-widest mb-3">
                Step 4 — Timeline
              </p>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                When do you want to close?
              </h1>
              <p className="text-muted-foreground mb-6">
                A typical closing takes 30–45 days from offer acceptance.
              </p>
              <div className="flex flex-col gap-5">
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-1">
                    <JargonTip
                      term="Closing Date"
                      definition="This is the day you officially become the owner. You'll sign the final paperwork, the money changes hands, and you get your keys. It typically happens 30–45 days after your offer is accepted."
                    >
                      Proposed Closing Date
                    </JargonTip>
                  </label>
                  <p className="text-xs text-muted-foreground mb-2">
                    = the day you get your keys 🗝️ · Typically 30–45 days from today
                  </p>
                  <input
                    type="date"
                    value={offer.closeDate}
                    min={new Date().toISOString().split("T")[0]}
                    onChange={(e) =>
                      setOffer((o) => ({ ...o, closeDate: e.target.value }))
                    }
                    className="w-full border border-border rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 bg-card text-foreground"
                  />
                </div>

                <Callout text="Sellers often prefer a faster closing. If you're flexible on the date, it can make your offer more attractive — especially in a competitive market." />

                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Possession Date{" "}
                    <span className="font-normal text-muted-foreground">
                      (optional)
                    </span>
                  </label>
                  <input
                    type="date"
                    value={offer.possessionDate}
                    min={offer.closeDate || new Date().toISOString().split("T")[0]}
                    onChange={(e) =>
                      setOffer((o) => ({
                        ...o,
                        possessionDate: e.target.value,
                      }))
                    }
                    className="w-full border border-border rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 bg-card text-foreground"
                  />
                  <p className="text-xs text-muted-foreground mt-1.5">
                    Leave blank to take possession on closing day
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Note to Your Agent{" "}
                    <span className="font-normal text-muted-foreground">
                      (optional)
                    </span>
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Any special requests or context for Paloma..."
                    value={offer.agentNote}
                    onChange={(e) =>
                      setOffer((o) => ({ ...o, agentNote: e.target.value }))
                    }
                    className="w-full border border-border rounded-xl px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/40 bg-card text-foreground placeholder:text-muted-foreground"
                  />
                </div>
              </div>
            </div>
          )}

          {/* ── Step 5: Review ── */}
          {step === 5 && selectedProperty && (
            <div>
              <p className="text-gold-dark font-semibold text-sm uppercase tracking-widest mb-3">
                Step 5 — Review & Submit
              </p>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Review your offer
              </h1>
              <p className="text-muted-foreground mb-6">
                Look everything over before sending to Paloma for submission.
              </p>

              <div className="bg-card border border-border rounded-2xl overflow-hidden mb-4">
                {/* Property */}
                <div className="p-5 border-b border-border">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                    Property
                  </p>
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-14 h-14 rounded-xl bg-gradient-to-br ${selectedProperty.gradient} shrink-0`}
                    />
                    <div>
                      <p className="font-semibold text-foreground">
                        {selectedProperty.address}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {selectedProperty.city}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Asking:{" "}
                        <span className="font-semibold">
                          {formatPrice(selectedProperty.price)}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Offer details */}
                <div className="p-5 border-b border-border grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">
                      Your Offer
                    </p>
                    <p className="text-xl font-bold text-primary">
                      {offer.offerPrice
                        ? formatPrice(Number(offer.offerPrice))
                        : "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">
                      Earnest Money
                    </p>
                    <p className="text-xl font-bold text-foreground">
                      {offer.earnestMoney
                        ? formatPrice(Number(offer.earnestMoney))
                        : "—"}
                    </p>
                  </div>
                </div>

                {/* Contingencies */}
                <div className="p-5 border-b border-border">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                    Contingencies
                  </p>
                  <div className="flex flex-col gap-2">
                    {[
                      { key: "inspection", label: "Inspection" },
                      { key: "financing", label: "Financing" },
                      { key: "appraisal", label: "Appraisal" },
                    ].map(({ key, label }) => (
                      <div key={key} className="flex items-center gap-2">
                        {offer.contingencies[
                          key as keyof OfferState["contingencies"]
                        ] ? (
                          <CheckCircle2 className="w-4 h-4 text-gold" />
                        ) : (
                          <div className="w-4 h-4 rounded-full border-2 border-muted-foreground/30" />
                        )}
                        <span className="text-sm text-foreground">{label}</span>
                        <span
                          className={`text-xs ml-auto ${
                            offer.contingencies[
                              key as keyof OfferState["contingencies"]
                            ]
                              ? "text-gold-dark font-medium"
                              : "text-muted-foreground"
                          }`}
                        >
                          {offer.contingencies[
                            key as keyof OfferState["contingencies"]
                          ]
                            ? "Included"
                            : "Waived"}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Timeline */}
                <div className="p-5">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                    Timeline
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs text-muted-foreground">
                        Closing Date
                      </p>
                      <p className="text-sm font-semibold text-foreground mt-0.5">
                        {offer.closeDate || "Not set"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">
                        Possession
                      </p>
                      <p className="text-sm font-semibold text-foreground mt-0.5">
                        {offer.possessionDate || "On closing day"}
                      </p>
                    </div>
                  </div>
                  {offer.agentNote && (
                    <div className="mt-3 pt-3 border-t border-border">
                      <p className="text-xs text-muted-foreground mb-1">
                        Note to Paloma
                      </p>
                      <p className="text-sm text-foreground">
                        {offer.agentNote}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <Callout text="Once you submit, Paloma will review and formally present your offer to the seller's agent. She'll keep you posted every step of the way." />
            </div>
          )}

          {/* ── Navigation ── */}
          <div className="flex items-center justify-between pt-2">
            {step > 1 ? (
              <button
                onClick={() => setStep((s) => s - 1)}
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground text-sm font-medium transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>
            ) : (
              <Link
                href="/dashboard"
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground text-sm font-medium transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Cancel
              </Link>
            )}
            <button
              onClick={handleNext}
              disabled={!canProceed}
              className={`flex items-center gap-2 font-semibold text-sm px-8 py-3.5 rounded-xl transition-all ${
                canProceed
                  ? "bg-primary text-white hover:bg-primary/90 shadow-sm"
                  : "bg-muted text-muted-foreground cursor-not-allowed"
              }`}
            >
              {step === TOTAL_STEPS ? "Submit Offer" : "Continue"}
              {step < TOTAL_STEPS ? (
                <ArrowRight className="w-4 h-4" />
              ) : (
                <Calendar className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
