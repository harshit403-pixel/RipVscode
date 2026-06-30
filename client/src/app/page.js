import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import HowItWorks from "@/components/HowItWorks";
import Footer from "@/components/Footer";
import AppLoader from "@/components/AppLoader";

export default function Home() {
  return (
    <>
    <AppLoader/>
      <Navbar />
      <Hero />
      <Features />
      <HowItWorks/>
      <Footer/>
    </>
  );
}