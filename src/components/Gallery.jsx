"use client";

import { useState } from "react";
import Image from "next/image";

const images = [
  "/info/admissions/legacy/1.webp", // infrastructure
  "/info/admissions/legacy/5.webp", // sports
  "/info/admissions/legacy/3.webp", // lab
  "/info/admissions/legacy/4.webp", // smartclass
  "/info/admissions/legacy/2.webp", // arts
  "/info/admissions/legacy/legacy1.webp", // legacy1
  "/info/admissions/legacy/legacy2.webp", // legacy2
  "/info/admissions/legacy/legacy3.webp", // legacy3
];

export default function Gallery() {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  return (
    <div className="grid grid-cols-2 gap-2 md:grid-cols-3 md:gap-4">
      {images.map((src, idx) => (
        <div
          key={src}
          className={
            "relative " +
            (idx === 1
              ? "aspect-square w-full md:row-span-2 md:aspect-auto md:h-full"
              : "aspect-square w-full") +
            (idx >= 5 ? " md:hidden" : "")
          }
          onMouseEnter={() => setHoveredIndex(idx)}
          onMouseLeave={() => setHoveredIndex(null)}
          style={{ cursor: "default" }}
          tabIndex={0}
          role="img"
        >
          <Image
            src={src}
            alt={`Image`}
            fill
            className={`w-full h-full object-cover object-top rounded-lg transition-transform duration-300
              ${
                hoveredIndex !== null && hoveredIndex !== idx
                  ? "blur-sm scale-95"
                  : "blur-0 scale-100"
              }
            `}
            sizes="(max-width: 768px) 100vw, 33vw"
            priority={idx === 0}
          />
        </div>
      ))}
    </div>
  );
}
