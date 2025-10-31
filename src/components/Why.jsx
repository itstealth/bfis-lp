"use client"

import { useEffect, useState } from "react"

const features = [
  {
    title: "Personalized Education",
    description: "Holistic development with individualized focus for every child.",
    icon: "/why/1.png",
    gradient: "from-yellow-400 to-orange-500",
  },
  {
    title: "Innovative Learning",
    description: "Smart Classes integrating cutting-edge technology and virtual labs across all grades (Pre-Nursery to Class 12th).",
    icon: "/why/2.png",
    gradient: "from-teal-400 to-cyan-500",
    bgColor: "bg-gradient-to-b from-teal-500 to-green-500",
    isFeatured: true,
  },
  {
    title: "Co-Curricular Excellence",
    description: "15+ Sports Activities and 10+ Cultural Events, supported by dedicated facilities.",
    icon: "/why/3.png",
    gradient: "from-red-400 to-orange-500",
  },
  {
    title: "World-Class Facilities",
    description: "State-of-the-art campus, 6 Advanced Science Labs, and a modern library with 20,000+ books.",
    icon: "/why/4.png",
    gradient: "from-blue-400 to-cyan-400",
  },
  {
    title: "Future-Ready Skills",
    description: "Active clubs for Robotics, Coding, Debate, and guaranteed exposure to 21st-century competencies.",
    icon: "/why/5.png",
    gradient: "from-pink-400 to-red-500",
  },
];

const FeatureCard = ({ feature, colored }) => (
  <div
    className={
      `relative overflow-hidden rounded-2xl text-center border border-black/80 bg-white ` +
      `h-[290px] md:h-full flex flex-col justify-center p-6 transition-transform duration-300 ` +
      `hover:scale-[1.04] focus-visible:scale-[1.04] focus:outline-none`
    }
    tabIndex={0}
    style={{ cursor: 'pointer' }}
  >
    {/* Absolute gradient fade bg */}
    <div
      className={
        `absolute inset-0 rounded-2xl z-0 bg-gradient-to-b ${feature.gradient} pointer-events-none` +
        ` transition-opacity duration-500 ease-[cubic-bezier(.5,0,.2,1)] ` +
        `${colored ? ' opacity-100' : ' opacity-0'}`
      }
    />
    <div className="relative z-10">
      <img
        src={feature.icon}
        alt={feature.title}
        className={
          `w-20 h-20 md:w-24 md:h-24 mx-auto mb-4 md:mb-6 rounded-full shadow transition-transform duration-300` +
          `${colored ? ' scale-110' : ' scale-100'} `
        }
      />
      <h3 className={
        `text-xl md:text-2xl font-bold transition-colors duration-400 ease-[cubic-bezier(.7,0,.26,1)] ` +
        `${colored ? 'text-white' : 'text-zinc-800'}`
      }>{feature.title}</h3>
      <p className={
        `mt-3 md:mt-4 text-base md:text-lg transition-colors duration-400 ease-[cubic-bezier(.7,0,.26,1)] ` +
        `${colored ? 'text-gray-100' : 'text-gray-600'}`
      }>{feature.description}</p>
    </div>
  </div>
);

export default function Why() {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);

  // Restore last active card on mount; default to first card
  useEffect(() => {
    try {
      const saved = localStorage.getItem("why-active-index");
      if (saved !== null) setActiveIndex(Number(saved));
    } catch {}
  }, []);

  return (
    <section className="bg-grid-pattern py-20">
      <div className="container max-w-[1400px] mx-auto px-4">
        <h2 className="text-center text-4xl font-bold md:text-5xl">
          Why Brookfield?
        </h2>
        <div className="mt-16 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-5">
          {features.map((feature, index) => {
            const colored = hoveredIndex !== null ? hoveredIndex === index : activeIndex === index;
            return (
              <div
                key={index}
                onMouseEnter={() => {
                  setHoveredIndex(index);
                  setActiveIndex(index);
                  try { localStorage.setItem("why-active-index", String(index)); } catch {}
                }}
                onMouseLeave={() => setHoveredIndex(null)}
                onFocus={() => {
                  setHoveredIndex(index);
                  setActiveIndex(index);
                  try { localStorage.setItem("why-active-index", String(index)); } catch {}
                }}
                onBlur={() => setHoveredIndex(null)}
              >
                <FeatureCard feature={feature} colored={colored} />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
