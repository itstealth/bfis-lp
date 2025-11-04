"use client";

import { useEffect, useState } from "react";
import { Phone } from "lucide-react";

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
        (scrolled ? "bg-black shadow-md" : "bg-black/50 sm:bg-transparent")
      }
    >
      <div className="mx-auto flex h-16 items-center justify-between px-4 sm:h-20 sm:px-6 lg:px-10 max-w-[1400px]">
        {/* Left: Logo */}
        <div className="flex items-center gap-4 sm:gap-6">
          <img
            src="/logo.png"
            alt="Brookfield International School"
            className={`w-auto h-12 block sm:h-16 select-none block sm:hidden`}
            draggable={false}
          />
        </div>

        {/* Right: Phone */}
        <a
          href="tel:+919066790662"
          className={`flex items-center gap-2 text-lg font-medium ${
            scrolled ? "text-white" : "text-black"
          }`}
        >
          <Phone className="h-5 w-5" />
          <span>90667 90662</span>
        </a>
      </div>
    </header>
  );
}
