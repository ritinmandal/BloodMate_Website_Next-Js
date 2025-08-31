import AboutUsBloodBank from "@/components/about";
import WhyChooseUs from "@/components/choose";
import HeroSwiper from "@/components/hero";
import HowItWorks from "@/components/howitworks";
import NavBar from "@/components/navbar";
import PartnersHub from "@/components/partner";
import Loader from "@/components/loader";
import PartnersMarquee from "@/components/partnersmarq";
import BloodCompatibilitySection from "@/components/compatibility";
import WaveSeparator from "@/components/divider";
import WaveSeparatorflip from "@/components/divider2";
import StatsCounterSection from "@/components/stats";

import VolunteersSlider from "@/components/OurVolunteers";
import { TestimonialsMosaic } from "@/components/testimonial";

export default function Home() {
  return (
    <div>
      <Loader/>
      <NavBar />
      <HeroSwiper />
      <WaveSeparator />


      <WhyChooseUs />
      <AboutUsBloodBank />
      <BloodCompatibilitySection />

      <HowItWorks />
      <StatsCounterSection />
  
      <PartnersMarquee />

      <PartnersHub />
      <VolunteersSlider />
      <TestimonialsMosaic />
  
      <WaveSeparatorflip />
    
    </div>
  );
}
