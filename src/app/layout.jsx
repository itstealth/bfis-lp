import { Poppins, Roboto_Slab } from "next/font/google";
import "./globals.css";
import DockButtons from "@/components/DockButtons";
import WhatsAppButton from "@/components/WhatsAppButton";
import CampusTourButton from "@/components/CampusTourButton";
import CallButton from "@/components/CallButton";
import { GoogleTagManager } from "@next/third-parties/google";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

const robotoSlab = Roboto_Slab({
  variable: "--font-roboto-slab",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

export const metadata = {
  title: "Brookfield International School",
  description: "Brookfield International School - Excellence in Education",
  icons: {
    icon: "https://www.bfis.in/assets/favicon.png",
    apple: "https://www.bfis.in/assets/favicon.png",
    other: {
      rel: "icon",
      url: "https://www.bfis.in/assets/favicon.png",
    },
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <GoogleTagManager gtmId="GTM-KRDJLKL" />
      <body
        className={`${poppins.variable} ${robotoSlab.variable} font-sans antialiased`}
        style={{ fontFamily: "var(--font-poppins), sans-serif" }}
      >
        {children}
        {/* <CallButton /> */}
        <WhatsAppButton />
        <CampusTourButton />
        <DockButtons />
      </body>
    </html>
  );
}
