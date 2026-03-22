"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { MapPin, Eye, EyeOff, ArrowRight, Home, Briefcase, CheckCircle2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type Role = "buyer" | "agent" | null;

const BUYER_PERKS = [
  "Guided step-by-step home buying journey",
  "Instant agent matching based on your goals",
  "In-app chat with your dedicated agent",
  "Tour scheduling & offer management",
];

const AGENT_PERKS = [
  "Receive qualified, pre-matched buyer leads",
  "Pipeline CRM to manage all your buyers",
  "Professional profile with reviews & stats",
  "Flexible subscription — cancel anytime",
];

function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultRole: Role = searchParams.get("role") === "agent" ? "agent" : null;

  const [role, setRole] = useState<Role>(defaultRole);
  const [step, setStep] = useState<"role" | "details" | "confirm">(defaultRole ? "details" : "role");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRoleSelect = (r: Role) => { setRole(r); setStep("details"); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!name || !email || !password) { setError("Please fill in all fields."); return; }
    if (password.length < 8) { setError("Password must be at least 8 characters."); return; }
    if (!agreed) { setError("Please agree to the Terms of Service to continue."); return; }

    setLoading(true);
    const supabase = createClient();
    if (!supabase) {
      setError("Supabase is not configured. Add your credentials to .env.local.");
      setLoading(false);
      return;
    }

    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
          role: role === "agent" ? "realtor" : "buyer",
        },
      },
    });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }

    // Show email confirmation screen instead of immediately redirecting.
    // Supabase sends a confirmation email; the user must click it before logging in.
    setStep("confirm");
    setLoading(false);
  };

  const handleGoogleSignup = async () => {
    const supabase = createClient();
    if (!supabase) return;
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${location.origin}/auth/callback`,
        queryParams: {
          access_type: "offline",
          prompt: "consent",
        },
      },
    });
  };

  const GoogleButton = () => (
    <button
      type="button"
      onClick={handleGoogleSignup}
      className="w-full flex items-center justify-center gap-3 border border-border rounded-xl py-3 text-sm font-semibold text-foreground hover:bg-secondary transition-colors mb-4"
    >
      <svg viewBox="0 0 24 24" className="w-4 h-4" aria-hidden="true">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
      </svg>
      Continue with Google
    </button>
  );

  return (
    <div className="w-full max-w-sm">
      {step === "role" && (
        <div>
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-foreground">Create your free account</h1>
            <p className="text-muted-foreground text-sm mt-1">First, tell us who you are</p>
          </div>
          <div className="flex flex-col gap-3">
            {([
              { r: "buyer" as Role, icon: Home, color: "bg-primary/10 group-hover:bg-primary/15", iconColor: "text-primary", title: "I'm a Home Buyer", sub: "I want guidance and a matched agent", perks: BUYER_PERKS },
              { r: "agent" as Role, icon: Briefcase, color: "bg-gold/10 group-hover:bg-gold/15", iconColor: "text-gold-dark", title: "I'm a Real Estate Agent", sub: "I want qualified buyer leads", perks: AGENT_PERKS },
            ]).map(({ r, icon: Icon, color, iconColor, title, sub, perks }) => (
              <button key={r} onClick={() => handleRoleSelect(r)} className="w-full text-left p-5 bg-card border-2 border-border rounded-2xl hover:border-primary/50 transition-all group">
                <div className="flex items-start gap-4">
                  <div className={`w-11 h-11 ${color} rounded-xl flex items-center justify-center transition-colors`}>
                    <Icon className={`w-5 h-5 ${iconColor}`} />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-foreground">{title}</p>
                    <p className="text-xs text-muted-foreground mt-1 mb-3">{sub}</p>
                    <ul className="flex flex-col gap-1.5">
                      {perks.map((perk) => (
                        <li key={perk} className="flex items-start gap-2 text-xs text-muted-foreground">
                          <CheckCircle2 className="w-3.5 h-3.5 text-gold shrink-0 mt-0.5" />{perk}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground/40 group-hover:text-primary transition-colors mt-1 shrink-0" />
                </div>
              </button>
            ))}
          </div>
          <p className="text-center text-sm text-muted-foreground mt-6">
            Already have an account?{" "}
            <Link href="/login" className="text-primary font-semibold hover:underline">Sign in</Link>
          </p>
        </div>
      )}

      {step === "details" && (
        <div>
          <button onClick={() => setStep("role")} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
            ← Back
          </button>
          <div className="bg-card border border-border rounded-2xl p-8 shadow-sm">
            <div className="text-center mb-6">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3 ${role === "agent" ? "bg-gold-light" : "bg-primary/10"}`}>
                {role === "agent" ? <Briefcase className="w-6 h-6 text-gold-dark" /> : <Home className="w-6 h-6 text-primary" />}
              </div>
              <h1 className="text-xl font-bold text-foreground">
                {role === "agent" ? "Join as an Agent" : "Create your account"}
              </h1>
              <p className="text-muted-foreground text-sm mt-1">
                {role === "agent" ? "Start connecting with qualified buyers" : "Start your home-buying journey today"}
              </p>
            </div>

            <GoogleButton />

            <div className="flex items-center gap-3 mb-4">
              <div className="flex-1 h-px bg-border" />
              <span className="text-xs text-muted-foreground font-medium">or</span>
              <div className="flex-1 h-px bg-border" />
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-1.5">
                  {role === "agent" ? "Full Name" : "Your Name"}
                </label>
                <input type="text" autoComplete="name"
                  placeholder={role === "agent" ? "Paloma Aguilar" : "Marcus Johnson"}
                  value={name} onChange={(e) => setName(e.target.value)}
                  className="w-full border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 bg-background text-foreground placeholder:text-muted-foreground"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-1.5">Email address</label>
                <input type="email" autoComplete="email" placeholder="you@example.com"
                  value={email} onChange={(e) => setEmail(e.target.value)}
                  className="w-full border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 bg-background text-foreground placeholder:text-muted-foreground"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-1.5">Password</label>
                <div className="relative">
                  <input type={showPassword ? "text" : "password"} autoComplete="new-password"
                    placeholder="Min. 8 characters" value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full border border-border rounded-xl px-4 py-3 pr-11 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 bg-background text-foreground placeholder:text-muted-foreground"
                  />
                  <button type="button" onClick={() => setShowPassword((s) => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <label className="flex items-start gap-3 cursor-pointer">
                <div onClick={() => setAgreed((a) => !a)}
                  className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 mt-0.5 transition-colors ${agreed ? "bg-primary border-primary" : "border-muted-foreground/40"}`}>
                  {agreed && <CheckCircle2 className="w-4 h-4 text-white" />}
                </div>
                <span className="text-xs text-muted-foreground leading-relaxed">
                  I agree to the{" "}
                  <Link href="/terms" target="_blank" className="text-primary hover:underline">Terms of Service</Link>
                  {" "}and{" "}
                  <Link href="/privacy" target="_blank" className="text-primary hover:underline">Privacy Policy</Link>
                </span>
              </label>

              {error && (
                <p className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-xl px-4 py-3">{error}</p>
              )}

              <button type="submit" disabled={loading}
                className={`w-full flex items-center justify-center gap-2 font-semibold text-sm py-3.5 rounded-xl transition-all ${loading ? "bg-muted text-muted-foreground cursor-not-allowed" : "bg-primary text-white hover:bg-primary/90 shadow-sm"}`}>
                {loading ? (
                  <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Creating account...</>
                ) : (
                  <>Create Free Account<ArrowRight className="w-4 h-4" /></>
                )}
              </button>
            </form>
          </div>
          <p className="text-center text-sm text-muted-foreground mt-6">
            Already have an account?{" "}
            <Link href="/login" className="text-primary font-semibold hover:underline">Sign in</Link>
          </p>
        </div>
      )}

      {step === "confirm" && (
        <div className="bg-card border border-border rounded-2xl p-8 shadow-sm text-center">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-5">
            <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25H4.5a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5H4.5a2.25 2.25 0 00-2.25 2.25m19.5 0l-9.75 6.75L2.25 6.75" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-foreground mb-2">
            Check your inbox
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed mb-2">
            We sent a confirmation link to{" "}
            <span className="font-semibold text-foreground">{email}</span>.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed mb-6">
            Click the link in that email to activate your account, then come back and sign in.
          </p>
          <div className="bg-amber-50 border border-amber-200/60 rounded-xl px-4 py-3 text-left mb-6">
            <p className="text-xs text-amber-800 leading-relaxed">
              <span className="font-semibold">No email?</span> Check your spam folder or{" "}
              <button
                onClick={() => setStep("details")}
                className="underline font-semibold hover:text-amber-900"
              >
                try a different email address
              </button>.
            </p>
          </div>
          <Link
            href="/login"
            className="inline-flex items-center justify-center w-full bg-primary text-white font-semibold text-sm py-3.5 rounded-xl hover:bg-primary/90 transition-all"
          >
            Go to sign in
          </Link>
        </div>
      )}
    </div>
  );
}

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="bg-primary h-16 flex items-center px-6 shrink-0">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
            <MapPin className="w-4 h-4 text-white" strokeWidth={2.5} />
          </div>
          <span className="text-white font-semibold text-lg">HomePath</span>
        </Link>
      </header>
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <Suspense fallback={
          <div className="w-full max-w-sm flex items-center justify-center py-20">
            <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
          </div>
        }>
          <SignupForm />
        </Suspense>
      </div>
    </div>
  );
}
