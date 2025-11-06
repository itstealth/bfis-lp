"use client";

import { Phone } from "lucide-react";

export default function CallButton() {
  const phoneNumber = "+919066790662"; // School phone number

  return (
    <a
      href={`tel:${phoneNumber}`}
      className="fixed hidden md:block bottom-6 left-6 z-[9999] group"
      aria-label="Call us"
    >
      <div className="relative">
        {/* Pulse animation */}
        <div className="absolute inset-0 bg-blue-600 rounded-full animate-ping opacity-75" />
        
        {/* Main button */}
        <div className="relative bg-blue-600 hover:bg-blue-700 rounded-full p-4 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110">
          <Phone className="w-7 h-7 text-white" />
        </div>
      </div>
    </a>
  );
}
