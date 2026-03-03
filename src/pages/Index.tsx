import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import StatsBar from "@/components/StatsBar";
import Integrations from "@/components/Integrations";
import Highlights from "@/components/Highlights";
import HowItWorks from "@/components/HowItWorks";
import DetailedFeatures from "@/components/DetailedFeatures";
import Platform from "@/components/Platform";
import Benefits from "@/components/Benefits";
import Advantages from "@/components/Advantages";
import Security from "@/components/Security";
import Pricing from "@/components/Pricing";
import Testimonials from "@/components/Testimonials";
import Footer from "@/components/Footer";
import ChatWidget from "@/components/ChatWidget";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <StatsBar />
      <Integrations />
      <Highlights />
      <HowItWorks />
      <DetailedFeatures />
      <Platform />
      <Benefits />
      <Advantages />
      <Security />
      <Pricing />
      <Testimonials />
      <Footer />
      <ChatWidget />
    </div>
  );
};

export default Index;
