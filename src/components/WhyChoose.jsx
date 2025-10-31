"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Play, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const SLIDES = [
  { id: 1, src: "/legacy/1.webp", alt: "Campus" },
  { id: 2, src: "/Hero-Banner.png", alt: "Library" },
  { id: 3, src: "/legacy/2.webp", alt: "Outdoors" },
];

function mod(n, m) {
  return ((n % m) + m) % m;
}

export default function WhyChoose() {
  const [activeSlide, setActiveSlide] = useState(0);
  const slideCount = SLIDES.length;

  // Positions for previous, center, next
  const getCardProps = (idx) => {
    // idx: slide index in SLIDES
    // activeSlide: current center slide
    const offset = mod(idx - activeSlide, slideCount);
    // 0 = center, 1 = right, 2 = far right, slideCount-1 = left, slideCount-2 = far left, etc
    let style = {
      opacity: 0,
      zIndex: 7,
      pointerEvents: "none",
      transform: "translateX(0) scale(.92)",
    };
    if (offset === 0) {
      // Center card
      style = {
        opacity: 1,
        zIndex: 12,
        pointerEvents: "auto",
        transform:
          "translateX(0) scale(1) translateZ(0px) rotateY(0deg)",
        boxShadow: "0 10px 48px 0 rgba(0,0,0,.18)",
      };
    } else if (offset === 1 || (slideCount > 2 && offset === -(slideCount - 1))) {
      // Right card (1), or looping leftmost
      style = {
        opacity: 1,
        zIndex: 10,
        pointerEvents: "auto",
        transform:
          "translateX(52%) scale(.96) translateZ(-180px) rotateY(-24deg)",
        boxShadow: "0 5px 20px 0 rgba(0,0,0,.1)",
      };
    } else if (offset === slideCount - 1 || (slideCount > 2 && offset === -1)) {
      // Left card (last), or looping rightmost
      style = {
        opacity: 1,
        zIndex: 10,
        pointerEvents: "auto",
        transform:
          "translateX(-52%) scale(.96) translateZ(-180px) rotateY(24deg)",
        boxShadow: "0 5px 20px 0 rgba(0,0,0,.1)",
      };
    }
    return style;
  };

  const next = () => setActiveSlide((prev) => mod(prev + 1, slideCount));
  const prev = () => setActiveSlide((prev) => mod(prev - 1, slideCount));

  // Spacing: keep container large, cards 66% wide
  return (
    <section className="w-full py-10 md:pb-20 overflow-hidden">
      <div className="mx-auto max-w-none px-0">
        <h2 className="text-center text-3xl md:text-5xl font-extrabold tracking-tight italic leading-tight mb-8 md:mb-10">
          Why Parents Choose BFIS?
        </h2>
        <div className="relative flex items-center justify-center" style={{ minHeight: 440 }}>
          {/* Left Arrow */}
          <Button
            size="icon-lg"
            variant="ghost"
            className="absolute left-1 md:left-3 top-1/2 z-50 -translate-y-1/2 bg-white/90 hover:bg-white focus:bg-white rounded-full shadow"
            onClick={prev}
            aria-label="Previous"
          >
            <ChevronLeft className="w-7 h-7 text-black" />
          </Button>

          {/* 3D Overlapping Stack */}
          <div
            className="relative w-full flex items-center justify-center"
            style={{ perspective: 1500, minHeight: 420, height: "28vw", maxHeight: 480 }}
          >
            {SLIDES.map((item, i) => (
              <div
                key={item.id}
                style={{
                  ...getCardProps(i),
                  position: "absolute",
                  top: 0,
                  left: "50%",
                  width: "66vw",
                  maxWidth: 850,
                  minWidth: 260,
                  height: "100%",
                  borderRadius: 32,
                  background: "#fff",
                  transition:
                    "all 0.65s cubic-bezier(.42,.16,.37,1.21)",
                  transform: `${getCardProps(i).transform} translateX(-50%)`,
                  overflow: "hidden",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  margin: 0,
                }}
              >
                <div className="relative w-full h-full">
                  <Image
                    src={item.src}
                    alt={item.alt}
                    fill
                    priority={i === activeSlide}
                    className="object-cover object-center w-full h-full select-none rounded-3xl"
                  />
                  {/* Play overlay */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <Button
                      variant="default"
                      className="h-14 w-14 md:h-16 md:w-16 rounded-full bg-red-500 hover:bg-red-500/90 shadow-lg text-white opacity-90 pointer-events-auto"
                      style={{ pointerEvents: "auto" }}
                      tabIndex={-1}
                      aria-label="Play"
                    >
                      <Play className="h-7 w-7 fill-white" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Right Arrow */}
          <Button
            size="icon-lg"
            variant="ghost"
            className="absolute right-1 md:right-3 top-1/2 z-50 -translate-y-1/2 bg-white/90 hover:bg-white focus:bg-white rounded-full shadow"
            onClick={next}
            aria-label="Next"
          >
            <ChevronRight className="w-7 h-7 text-black" />
          </Button>
        </div>
      </div>
    </section>
  );
}