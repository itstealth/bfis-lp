"use client";

import { useEffect, useState } from "react";
import { Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);


  return (
    <header
      className={
        "w-full fixed top-0 left-0 right-0 z-[1000] transition-colors duration-300 " +
        (scrolled ? "bg-black shadow-md" : "bg-black/50")
      }
    >
      <div className="mx-auto flex h-16 items-center justify-between px-4 sm:h-20 sm:px-6 lg:px-10 max-w-[1400px]">
        {/* Left: Logo */}
        <div className="flex items-center gap-4 sm:gap-6">
          <img
            src="/info/admissions/logo.png"
            alt="Brookfield International School"
            className={`w-auto h-12 block sm:h-16 select-none block`}
            draggable={false}
          />
        </div>

        <div className="flex items-center gap-6">
          <a href="#hero">
            <Button className={`${scrolled ? "bg-[#acf15c] text-black hover:bg-[abf15cc3]" : "bg-black text-white hover:bg-black/80"} font-bold shadow-lg hidden sm:block`}>Book Your Campus Tour</Button>
          </a>

          {/* Right: Phone */}
          <a
            href="tel:+919066790662"
            className={`flex items-center gap-2 sm:text-lg text-base font-medium ${
              scrolled ? "text-white" : "text-white"
            }`}
          >
            <Phone className="h-5 w-5" />
            <span>90667 90662</span>
          </a>
        </div>
      </div>
    </header>
  );
}
