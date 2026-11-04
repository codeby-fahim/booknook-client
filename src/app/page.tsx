import Hero from "@/components/home/Hero";
import HowItWorks from "@/components/home/HowItWorks";
import NewArrivals from "@/components/home/NewArrivals";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { absolute: "BookNook | Home" },
};

export default function Home() {
  return (
    <div>
      <Hero></Hero>
      <NewArrivals></NewArrivals>
      <HowItWorks></HowItWorks>
      <WhyChooseUs></WhyChooseUs>
    </div>
  );
}
