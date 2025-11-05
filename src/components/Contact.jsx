"use client";
import { MapPin, Mail, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Contact() {

  const scrollToForm = () => {
    const heroSection = document.getElementById("hero");
    if (heroSection) {
      heroSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <section className="w-full bg-[#0c0c0c] py-5">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-10 items-stretch">
        {/* Left panel */}
        <div className="bg-black/60 text-white p-8 md:p-12 shadow-[0_0_0_1px_rgba(255,255,255,0.06)]">
          <h2 className="text-4xl md:text-5xl font-extrabold">Contact</h2>
          <div className="mt-4 h-[2px] bg-red-600 relative">
            <span className="absolute -right-2 -top-1 inline-block h-2 w-2 rounded-full bg-red-600" />
          </div>

          <ul className="mt-10 space-y-8 md:space-y-10 text-zinc-200">
            <li className="flex items-start gap-4">
              <span className="mt-1 shrink-0 rounded-full bg-white/10 p-2 ring-1 ring-white/10">
                <MapPin className="h-6 w-6" />
              </span>
              <p className="text-xl md:text-2xl leading-snug">
                Sheikhpura, New Chandigarh, Kurali, Dist. SAS Nagar, Mohali, Pin
                140110
              </p>
            </li>
            <li className="flex items-start gap-4">
              <span className="mt-1 shrink-0 rounded-full bg-white/10 p-2 ring-1 ring-white/10">
                <Mail className="h-6 w-6" />
              </span>
              <a
                href="mailto:info@bfis.in"
                className="text-xl md:text-2xl leading-snug hover:text-white transition-colors"
              >
                info@bfis.in
              </a>
            </li>
            <li className="flex items-start gap-4">
              <span className="mt-1 shrink-0 rounded-full bg-white/10 p-2 ring-1 ring-white/10">
                <Phone className="h-6 w-6" />
              </span>
              <a
                href="tel:+919066790662"
                className="text-xl md:text-2xl leading-snug hover:text-white transition-colors"
              >
                +91 90667 90662
              </a>
            </li>
            <li className="flex sm:hidden items-start gap-4">
              <Button
                onClick={scrollToForm}
                className="bg-[#acf15c] text-black hover:bg-[#abf15cc3] font-bold shadow-lg px-6 py-3 text-base transition-all duration-300 hover:scale-105"
              >
                Book Your Campus Tour
              </Button>
            </li>
          </ul>
        </div>

        {/* Map */}
        <div className="overflow-hidden shadow-2xl bg-white/5 ring-1 ring-white/10">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3425.9442335015347!2d76.62170689999999!3d30.8322287!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ff17915555555%3A0x742607647b86d7b9!2sBrookfield%20International%20School!5e0!3m2!1sen!2sin!4v1761832523479!5m2!1sen!2sin"
            width="600"
            height="450"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </section>
  );
}
