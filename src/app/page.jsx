import Header from "@/components/Header";
import Hero from "@/components/Hero";
import HigherEducation from "@/components/HigherEducation";
import Curriculum from "@/components/Curriculum";
import Why from "@/components/Why";
import WhyChoose from "@/components/WhyChoose";
import Legacy from "@/components/Legacy";
import Ranks from "@/components/Ranks";
import Stats from "@/components/Stats";
import Highlights from "@/components/Highlights";
import Contact from "@/components/Contact";

export default function Home() {
  return (
    <>
      <Header />
      <Hero />
      <WhyChoose />
      <Ranks />
      <HigherEducation />
      <Legacy />
      <Highlights />
      <Stats />
      <Curriculum />
      <Why />
      <Contact />
    </>
  );
}
