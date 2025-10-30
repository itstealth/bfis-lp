"use client";

import { useState } from "react";

const TABS = [
  {
    title: "Global Exposure",
    content: {
      img: "/academics.webp", // placeholder path, update to your real image path
      text: (
        <>
          <p className="text-3xl leading-normal font-medium text-black mb-4 md:mb-0 md:text-left text-center">
            We prepare our students to be global citizens with exchange
            programs, international interactions, and events featuring foreign
            dignitaries.
          </p>
        </>
      ),
    },
  },
  {
    title: "Award-Winning",
    content: {
      img: "/academics.webp",
      text: (
        <>
          <p className="text-3xl leading-normal font-medium text-black mb-4 md:mb-0 md:text-left text-center">
            {/* Replace this content with the actual "Award-Winning" description */}
            Our school consistently receives top academic, sports, and faculty
            awards nationally and internationally.
          </p>
        </>
      ),
    },
  },
  {
    title: "Global Exposure",
    content: {
      img: "/academics.webp",
      text: (
        <>
          <p className="text-3xl leading-normal font-medium text-black mb-4 md:mb-0 md:text-left text-center">
            Exchange programs empower our students to understand and collaborate
            with the world beyond the classroom.
          </p>
        </>
      ),
    },
  },
];

export default function Highlights() {
  const [tabIdx, setTabIdx] = useState(0);

  return (
    <section className="w-full border-t border-black/10 bg-white pt-8 pb-12 md:py-16">
      <div className="max-w-7xl mx-auto px-2 md:px-6">
        <h2 className="text-center text-black text-4xl font-bold md:text-5xl mb-9 mt-4 md:mt-0 md:mb-12">
          Highlights the global aspect
        </h2>
        {/* Tabs */}
        <div className="flex overflow-hidden shadow-sm mb-0 border-b border-gray-200">
          {TABS.map((tab, i) => (
            <button
              key={tab.title + i}
              onClick={() => setTabIdx(i)}
              className={
                `w-1/3 py-6 text-3xl font-medium outline-none transition-all duration-300` +
                (tabIdx === i
                  ? " bg-[#61912c] text-white font-semibold"
                  : " bg-gray-200 hover:bg-gray-300 text-black font-medium")
              }
            >
              {tab.title}
            </button>
          ))}
        </div>
        {/* Content: Image & Text */}
        <div className="flex flex-col md:flex-row mt-6 md:mt-10 items-center md:items-start gap-8 md:gap-20">
          <div className="flex-1 overflow-hidden shadow-md">
            <img
              src={TABS[tabIdx].content.img}
              alt="Highlight visual"
              className="w-full h-[340px] md:h-[350px] object-cover object-center transform transition-all duration-300 hover:scale-105 shadow"
              style={{ minWidth: 280 }}
            />
          </div>
          <div className="flex-1 md:pt-12 pt-8 pb-6 md:pb-0">
            {TABS[tabIdx].content.text}
          </div>
        </div>
      </div>
    </section>
  );
}
