import Hero from "@/components/Hero";
import HigherEducation from "@/components/HigherEducation";
import Curriculum from "@/components/Curriculum";
import Why from "@/components/Why";
import WhyChoose from "@/components/WhyChoose";
import Legacy from "@/components/Legacy";
import Stats from "@/components/Stats";
import Highlights from "@/components/Highlights";
import Contact from "@/components/Contact";

export default function Home() {
  return (
    <>
      <Hero />
      <WhyChoose />
      <HigherEducation />
      <Curriculum />
      <Why />
      <Legacy />
      <Stats />
      <Highlights />
      <Contact />
    </>
  );
}
