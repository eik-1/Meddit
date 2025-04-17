import CallToAction from "@/components/CallToAction";
import FeaturedIssues from "@/components/FeaturedIssues";
import Footer from "@/components/Footer";
import HeroSection from "@/components/hero-section";
import HowItWorks from "@/components/HowItWorks";
import Testimonials from "@/components/Testimonials";

export default async function Home() {
  return (
    <>
      <HeroSection />
      <HowItWorks />
      <FeaturedIssues />
      <Testimonials />
      <CallToAction />
      <Footer />
    </>
  );
}
