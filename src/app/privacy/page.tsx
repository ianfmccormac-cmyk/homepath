import Link from "next/link";
import Navbar from "@/components/navbar";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          ← Back to HomePath
        </Link>

        <h1 className="text-3xl font-bold text-foreground mb-2">Privacy Policy</h1>
        <p className="text-sm text-muted-foreground mb-10">Effective date: March 21, 2026</p>

        <div className="prose prose-sm max-w-none text-muted-foreground space-y-8">

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-2">1. Information We Collect</h2>
            <p className="leading-relaxed">When you use HomePath we collect:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li><strong className="text-foreground">Account information</strong> — name, email address, and password (hashed, never stored in plain text)</li>
              <li><strong className="text-foreground">Profile data</strong> — your home-buying preferences, budget, location, and communication preferences</li>
              <li><strong className="text-foreground">Usage data</strong> — pages visited, searches performed, and features used</li>
              <li><strong className="text-foreground">Messages</strong> — in-app conversations between buyers and agents</li>
              <li><strong className="text-foreground">Device data</strong> — browser type, IP address, and device identifiers</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-2">2. How We Use Your Information</h2>
            <p className="leading-relaxed">We use your data to:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Match you with suitable real estate agents</li>
              <li>Provide and improve the HomePath platform</li>
              <li>Send transactional emails (account confirmation, password reset)</li>
              <li>Send service updates and feature announcements (you can opt out any time)</li>
              <li>Detect and prevent fraud or abuse</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-2">3. Sharing of Information</h2>
            <p className="leading-relaxed">
              We share your information only as necessary:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li><strong className="text-foreground">With matched agents</strong> — your name, preferences, and contact details are shared with agents you are matched with</li>
              <li><strong className="text-foreground">With service providers</strong> — we use Supabase for authentication and database storage, and Vercel for hosting. These providers process data on our behalf under strict data agreements</li>
              <li><strong className="text-foreground">Legal requirements</strong> — we may disclose data if required by law or to protect the rights of HomePath or its users</li>
              <li>We do <strong className="text-foreground">not</strong> sell your personal data to third parties</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-2">4. Cookies &amp; Tracking</h2>
            <p className="leading-relaxed">
              HomePath uses cookies and local storage for session management, authentication, and saving your preferences (such as saved home listings). We do not use advertising trackers or third-party analytics cookies.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-2">5. Data Retention</h2>
            <p className="leading-relaxed">
              We retain your account data for as long as your account is active. You may request deletion of your account and associated data at any time by emailing support@homepath.app. Deleted data is removed within 30 days.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-2">6. Security</h2>
            <p className="leading-relaxed">
              We use industry-standard security measures including HTTPS encryption, hashed passwords, and row-level security on our database. No method of transmission or storage is 100% secure; we encourage strong unique passwords.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-2">7. Your Rights</h2>
            <p className="leading-relaxed">
              Depending on your location, you may have rights to access, correct, or delete your personal data, and to object to certain processing. Contact us at support@homepath.app to exercise these rights.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-2">8. Children&apos;s Privacy</h2>
            <p className="leading-relaxed">
              HomePath is not intended for users under 18. We do not knowingly collect data from minors. If you believe a minor has created an account, contact us and we will remove it promptly.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-2">9. Changes to This Policy</h2>
            <p className="leading-relaxed">
              We may update this Privacy Policy periodically. We will notify you of material changes via email or in-app notice. Your continued use of HomePath after changes constitutes acceptance.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-2">10. Contact</h2>
            <p className="leading-relaxed">
              Questions about this policy? Email{" "}
              <a href="mailto:support@homepath.app" className="text-primary hover:underline">
                support@homepath.app
              </a>.
            </p>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-border flex flex-wrap gap-4 text-sm text-muted-foreground">
          <Link href="/terms" className="hover:text-foreground transition-colors">Terms of Service</Link>
          <Link href="/" className="hover:text-foreground transition-colors">Back to HomePath</Link>
        </div>
      </div>
    </div>
  );
}
