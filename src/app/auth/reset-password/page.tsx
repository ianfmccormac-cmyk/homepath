"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MapPin, Eye, EyeOff, CheckCircle2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    const supabase = createClient();
    if (!supabase) {
      setError("Supabase is not configured.");
      setLoading(false);
      return;
    }

    const { error: updateError } = await supabase.auth.updateUser({ password });

    if (updateError) {
      setError(updateError.message);
      setLoading(false);
      return;
    }

    setDone(true);
    setLoading(false);
    // Give the user a moment to read the success message, then redirect.
    setTimeout(() => router.push("/dashboard"), 2500);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top bar */}
      <header className="bg-primary h-16 flex items-center px-6 shrink-0">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gold rounded-lg flex items-center justify-center">
            <MapPin className="w-4 h-4 text-white" strokeWidth={2.5} />
          </div>
          <span className="text-white font-semibold text-lg">HomePath</span>
        </Link>
      </header>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-sm">
          <div className="bg-card border border-border rounded-2xl p-8 shadow-sm">
            {done ? (
              <div className="text-center">
                <div className="w-14 h-14 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-7 h-7 text-emerald-500" />
                </div>
                <h1 className="text-xl font-bold text-foreground mb-2">
                  Password updated
                </h1>
                <p className="text-sm text-muted-foreground">
                  Your password has been changed. Taking you to your dashboard&hellip;
                </p>
              </div>
            ) : (
              <>
                <div className="text-center mb-8">
                  <h1 className="text-2xl font-bold text-foreground">
                    Set a new password
                  </h1>
                  <p className="text-muted-foreground text-sm mt-1">
                    Choose something strong and memorable
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  {/* New password */}
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-1.5">
                      New password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        autoComplete="new-password"
                        placeholder="Min. 8 characters"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full border border-border rounded-xl px-4 py-3 pr-11 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 bg-background text-foreground placeholder:text-muted-foreground"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((s) => !s)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {showPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Confirm password */}
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-1.5">
                      Confirm password
                    </label>
                    <input
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      placeholder="Re-enter your new password"
                      value={confirm}
                      onChange={(e) => setConfirm(e.target.value)}
                      className="w-full border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 bg-background text-foreground placeholder:text-muted-foreground"
                    />
                  </div>

                  {/* Password strength hint */}
                  {password.length > 0 && (
                    <div className="flex gap-1.5">
                      {[1, 2, 3, 4].map((level) => {
                        const strength =
                          password.length >= 12 ? 4
                          : password.length >= 10 ? 3
                          : password.length >= 8 ? 2
                          : 1;
                        return (
                          <div
                            key={level}
                            className={`flex-1 h-1 rounded-full transition-colors ${
                              level <= strength
                                ? strength === 4
                                  ? "bg-emerald-500"
                                  : strength === 3
                                  ? "bg-amber-400"
                                  : "bg-red-400"
                                : "bg-muted"
                            }`}
                          />
                        );
                      })}
                    </div>
                  )}

                  {error && (
                    <p className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                      {error}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className={`w-full flex items-center justify-center gap-2 font-semibold text-sm py-3.5 rounded-xl transition-all ${
                      loading
                        ? "bg-muted text-muted-foreground cursor-not-allowed"
                        : "bg-primary text-white hover:bg-primary/90 shadow-sm"
                    }`}
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Updating&hellip;
                      </>
                    ) : (
                      "Update password"
                    )}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
