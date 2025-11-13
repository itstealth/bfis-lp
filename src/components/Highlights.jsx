"use client";

import { useState } from "react";

const TABS = [
  {
    title: "Global Exposure",
    content: {
      img: "/info/admissions/academics.jpg", // placeholder path, update to your real image path
      text: (
        <>
          <p className="sm:text-xl text-base leading-normal font-normal text-black mb-4 md:mb-0 md:text-left text-center">
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
      img: "/info/admissions/award.jpg",
      text: (
        <>
          <p className="sm:text-xl text-base leading-normal font-normal text-black mb-4 md:mb-0 md:text-left text-center">
            {/* Replace this content with the actual "Award-Winning" description */}
            Brookfield International School has been awarded the Best Infrastructure School of the year at the prestigious Education Conclave - Schools of Excellence from Sh. Harjot Singh Bains, Education Minister of Punjab
          </p>
        </>
      ),
    },
  },
  {
    title: "Digital Classrooms",
    content: {
      img: "/info/admissions/digital-classrooms.jpg",
      text: (
        <>
          <p className="sm:text-xl text-base leading-normal font-normal text-black mb-4 md:mb-0 md:text-left text-center">
            Brookfield is equipped with award-winning interactive software to
            enhance student engagement in both online and in-class learning.
          </p>
        </>
      ),
    },
  },
];

export default function Highlights() {
  const [tabIdx, setTabIdx] = useState(0);

  return (
    <section className="w-full border-t border-black/10 bg-white pt-8 pb-0 md:py-16">
      <div className="max-w-7xl mx-auto px-2 md:px-6">
        <h2 className="text-center text-black text-2xl sm:text-3xl font-bold md:text-4xl mb-9 mt-4 md:mt-0 md:mb-12">
          BFIS Global Aspect
        </h2>
        {/* Tabs */}
        <div className="flex overflow-hidden shadow-sm mb-0 border-b border-gray-200">
          {TABS.map((tab, i) => (
            <button
              key={tab.title + i}
              onClick={() => setTabIdx(i)}
              className={
                `w-1/3 py-6 not-last:mr-3 text-sm sm:text-2xl font-normal sm:font-medium outline-none transition-all duration-300` +
                (tabIdx === i
                  ? " bg-[#61912c] text-white font-normal sm:font-semibold"
                  : " bg-gray-200 hover:bg-gray-300 text-black font-normal sm:font-medium")
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
              className="w-full md:w-[500px] mx-auto h-[340px] md:h-[500px] object-cover object-center transform transition-all duration-300 hover:scale-105 shadow"
              style={{ minWidth: 280 }}
            />
          </div>
          <div className="flex-1 md:pt-12 pt-0 pb-6 md:pb-0">
            {TABS[tabIdx].content.text}
          </div>
        </div>
      </div>
    </section>
  );
}
