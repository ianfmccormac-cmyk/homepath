import Navbar from "@/components/navbar";
import Hero from "@/components/hero";
import FeaturedHomes from "@/components/featured-homes";
import HowItWorks from "@/components/how-it-works";
import AgentsSection from "@/components/agents-section";
import Testimonial from "@/components/testimonial";
import CtaBanner from "@/components/cta-banner";
import Footer from "@/components/footer";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Hero />
        <FeaturedHomes />
        <HowItWorks />
        <AgentsSection />
        <Testimonial />
        <CtaBanner />
      </main>
      <Footer />
    </>
  );
}
