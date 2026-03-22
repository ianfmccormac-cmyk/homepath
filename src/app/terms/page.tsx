import Link from "next/link";
import Navbar from "@/components/navbar";

export default function TermsPage() {
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

        <h1 className="text-3xl font-bold text-foreground mb-2">Terms of Service</h1>
        <p className="text-sm text-muted-foreground mb-10">Effective date: March 21, 2026</p>

        <div className="prose prose-sm max-w-none text-muted-foreground space-y-8">

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-2">1. Acceptance of Terms</h2>
            <p className="leading-relaxed">
              By accessing or using HomePath (&ldquo;the Service&rdquo;), you agree to be bound by these Terms of Service. If you do not agree, please do not use the Service.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-2">2. Description of Service</h2>
            <p className="leading-relaxed">
              HomePath is a real estate platform that connects home buyers with licensed real estate agents. The Service is free for buyers. Agents may subscribe to receive qualified buyer leads. HomePath does not provide real estate advice or act as a licensed brokerage.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-2">3. Accounts</h2>
            <p className="leading-relaxed">
              You must provide accurate, complete information when creating an account. You are responsible for maintaining the confidentiality of your credentials and for all activity under your account. Notify us immediately at support@homepath.app if you suspect unauthorised access.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-2">4. Buyer Use</h2>
            <p className="leading-relaxed">
              HomePath is free for home buyers. We match you with licensed agents based on your stated preferences. We do not guarantee any specific outcome, including the purchase of a property. The agent relationship is independent of HomePath.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-2">5. Agent Use</h2>
            <p className="leading-relaxed">
              Agents must hold a valid real estate licence in their state of operation. Agents are responsible for all communications with buyers and must comply with applicable laws. HomePath may remove agent accounts for violations of these terms or misrepresentation.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-2">6. Prohibited Conduct</h2>
            <p className="leading-relaxed">You agree not to:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Use the Service for unlawful purposes</li>
              <li>Misrepresent your identity or credentials</li>
              <li>Harass, spam, or abuse other users</li>
              <li>Attempt to gain unauthorised access to our systems</li>
              <li>Scrape or copy data from the Service without permission</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-2">7. Intellectual Property</h2>
            <p className="leading-relaxed">
              All content, trademarks, and software on HomePath are owned by or licensed to HomePath. You may not copy, modify, or distribute any part of the Service without our written consent.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-2">8. Limitation of Liability</h2>
            <p className="leading-relaxed">
              HomePath is provided &ldquo;as is&rdquo; without warranties of any kind. To the fullest extent permitted by law, HomePath is not liable for any indirect, incidental, or consequential damages arising from your use of the Service.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-2">9. Changes to These Terms</h2>
            <p className="leading-relaxed">
              We may update these Terms at any time. Continued use of the Service after changes constitutes acceptance of the new Terms. We will notify users of material changes by email or in-app notice.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-2">10. Contact</h2>
            <p className="leading-relaxed">
              Questions? Email us at{" "}
              <a href="mailto:support@homepath.app" className="text-primary hover:underline">
                support@homepath.app
              </a>.
            </p>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-border flex flex-wrap gap-4 text-sm text-muted-foreground">
          <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link>
          <Link href="/" className="hover:text-foreground transition-colors">Back to HomePath</Link>
        </div>
      </div>
    </div>
  );
}
