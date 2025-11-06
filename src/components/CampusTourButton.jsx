"use client";

import { Button } from "@/components/ui/button";

export default function CampusTourButton() {
  const scrollToForm = () => {
    const heroSection = document.getElementById("hero");
    if (heroSection) {
      heroSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="fixed top-1/2 -translate-y-1/2 -rotate-90 -right-[86px] z-[9998] hidden sm:block">
      <Button
        onClick={scrollToForm}
        className="bg-[#acf15c] text-black hover:bg-[#abf15cc3] font-bold shadow-lg px-6 py-3 text-base transition-all duration-300 hover:scale-105"
      >
        Download Brochure
      </Button>
    </div>
  );
}

