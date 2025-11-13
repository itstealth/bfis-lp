import Image from 'next/image';

export default function Curriculum() {
  return (
    <section className="py-5 bg-[#fbfaf3]">
      <div className="container mx-auto px-4">
        {/* Desktop Image */}
        <div className="hidden md:block">
          <Image
            src="/info/admissions/curriculum.png"
            alt="BFIS Curriculum for desktop"
            width={1920}
            height={1080}
            className="h-auto w-full"
          />
        </div>
        {/* Mobile Image (using desktop image as a placeholder) */}
        {/* TODO: Replace with '/bfis-curriculum-mobile.png' when provided */}
        <div className="block md:hidden">
          <Image
            src="/info/admissions/curriculum-sm.png" // Placeholder, user will provide a mobile version
            alt="BFIS Curriculum for mobile"
            width={1920} // Using desktop width, this will be scaled down
            height={1080}
            className="h-auto w-full"
          />
        </div>
      </div>
    </section>
  );
}