"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Play, ChevronLeft, ChevronRight } from "lucide-react";

// Updated SLIDES array with YouTube video IDs
const SLIDES = [
  {
    id: 1,
    videoId: "WVk8IWX0JT4",
    alt: "Campus Video",
    description:
      "Parents who trust BFIS Kindergarten for their child's foundational learning and growth",
  },
  {
    id: 2,
    videoId: "oBTVCILwfTU",
    alt: "Library Video",
    description:
      "Parent Satisfaction for a child's academic growth and performance is an essential part of BFIS.",
  },
  {
    id: 3,
    videoId: "bpzcyAoUaUg",
    alt: "Outdoors Video",
    description:
      "Our unique learning process let students dive into a diverse set of stimulating academic, cultural, and co-scholastic programmes.",
  },
  {
    id: 4,
    videoId: "02B4q-0vLWs",
    alt: "Smart Class Video",
    description:
      "Our dedicated school infirmary doctor ensures the health and fitness of our students.",
  },
  {
    id: 5,
    videoId: "kGOOf9Y6EBs",
    alt: "Smart Class Video",
    description:
      "How teachers help students to unlock their true potential and encourage them to discover their unique talent.",
  },
];

function mod(n, m) {
  return ((n % m) + m) % m;
}

export default function WhyChoose() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [currentVideoId, setCurrentVideoId] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const slideCount = SLIDES.length;

  // Detect mobile screen size (md breakpoint is 768px in Tailwind)
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleCardClick = (videoId) => {
    setCurrentVideoId(videoId);
    setIsVideoOpen(true);
  };

  const handleDialogClose = () => {
    setIsVideoOpen(false);
    setCurrentVideoId(null); // Stop video by removing the ID
  };

  // Restored 3D transforms with adjusted spacing
  const getCardProps = (idx) => {
    const offset = mod(idx - activeSlide, slideCount);
    let style = {
      opacity: 0,
      zIndex: 7,
      pointerEvents: "none",
      transform: "translateX(0) scale(.92)",
    };

    if (offset === 0) {
      style = {
        opacity: 1,
        zIndex: 12,
        pointerEvents: "auto",
        transform: "translateX(0) scale(1) translateZ(0px) rotateY(0deg)",
        boxShadow: "0 10px 48px 0 rgba(0,0,0,.18)",
      };
    } else if (
      offset === 1 ||
      (slideCount > 2 && offset === -(slideCount - 1))
    ) {
      // On mobile, hide side cards; on desktop, show them with 3D effect
      style = {
        opacity: isMobile ? 0 : 1,
        zIndex: 10,
        pointerEvents: isMobile ? "none" : "auto",
        transform:
          "translateX(60%) scale(.96) translateZ(-180px) rotateY(-24deg)",
        boxShadow: "0 5px 20px 0 rgba(0,0,0,.1)",
      };
    } else if (offset === slideCount - 1 || (slideCount > 2 && offset === -1)) {
      // On mobile, hide side cards; on desktop, show them with 3D effect
      style = {
        opacity: isMobile ? 0 : 1,
        zIndex: 10,
        pointerEvents: isMobile ? "none" : "auto",
        transform:
          "translateX(-60%) scale(.96) translateZ(-180px) rotateY(24deg)",
        boxShadow: "0 5px 20px 0 rgba(0,0,0,.1)",
      };
    }
    return style;
  };

  const next = () => setActiveSlide((prev) => mod(prev + 1, slideCount));
  const prev = () => setActiveSlide((prev) => mod(prev - 1, slideCount));

  return (
    <>
      <section className="w-full bg-gray-100 py-10 md:py-14 overflow-hidden">
        <div className="mx-auto max-w-none px-0">
          <h2 className="text-center text-2xl sm:text-3xl font-extrabold tracking-tight italic leading-tight mb-8 md:mb-10">
            Why Parents Choose BFIS?
          </h2>
          <div
            className="relative flex items-center justify-center"
            style={{ minHeight: 440 }}
          >
            <Button
              size="icon-lg"
              variant="ghost"
              className="absolute left-1 md:left-3 top-1/2 z-50 -translate-y-1/2 bg-white/90 hover:bg-white focus:bg-white rounded-full shadow"
              onClick={prev}
              aria-label="Previous"
            >
              <ChevronLeft className="w-7 h-7 text-black" />
            </Button>

            <div
              className="relative flex items-center justify-center"
              style={{
                perspective: 1500,
                minHeight: 420,
                height: "28vw",
                maxHeight: 480,
              }}
            >
              {SLIDES.map((item, i) => {
                const isCenter = i === activeSlide;
                return (
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
                      transition: "all 0.65s cubic-bezier(.42,.16,.37,1.21)",
                      transform: `${
                        getCardProps(i).transform
                      } translateX(-50%)`,
                      overflow: "hidden",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      margin: 0,
                      cursor: "pointer",
                    }}
                    onClick={() => handleCardClick(item.videoId)}
                  >
                    <div className="relative w-full h-full">
                      <YouTubeThumbnail
                        videoId={item.videoId}
                        alt={item.alt}
                        priority={isCenter}
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                        <Button
                          variant="default"
                          className="h-14 w-14 md:h-16 md:w-16 rounded-full bg-red-500 hover:bg-red-500/90 shadow-lg text-white opacity-90"
                          tabIndex={-1}
                          aria-label="Play"
                        >
                          <Play className="h-7 w-7 fill-white" />
                        </Button>
                      </div>
                      {/* Caption overlay with enhanced styling */}
                      <div className="absolute bottom-0 left-0 right-0 rounded-b-3xl overflow-hidden">
                        <div className="relative px-5 py-4 md:px-8 md:py-6 bg-gradient-to-t from-black/90 via-black/75 to-black/50 backdrop-blur-md">
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/50 to-transparent pointer-events-none"></div>
                          <p className="relative text-white text-sm sm:text-base md:text-lg font-semibold leading-relaxed md:leading-relaxed text-center drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] tracking-wide">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

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

      {/* Shadcn Dialog for Video Playback */}
      <Dialog open={isVideoOpen} onOpenChange={handleDialogClose}>
        <DialogContent className="max-w-4xl w-full p-0 bg-transparent border-0">
          <div className="aspect-video">
            {currentVideoId && (
              <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${currentVideoId}?autoplay=1`}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

function YouTubeThumbnail({ videoId, alt, priority = false }) {
  const candidates = [
    `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`,
    `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
    `https://i.ytimg.com/vi/${videoId}/sddefault.jpg`,
    `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
    `https://i.ytimg.com/vi/${videoId}/mqdefault.jpg`,
    `https://i.ytimg.com/vi/${videoId}/default.jpg`,
  ];

  const [idx, setIdx] = React.useState(0);

  return (
    <Image
      src={candidates[idx]}
      alt={alt}
      fill
      priority={priority}
      onError={() =>
        setIdx((prev) => (prev < candidates.length - 1 ? prev + 1 : prev))
      }
      className="object-cover object-center w-full h-full select-none rounded-3xl"
    />
  );
}
