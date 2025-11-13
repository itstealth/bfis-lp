import Gallery from "@/components/Gallery";

export default function Legacy() {
  return (
    <section className="bg-[#e0f2f1] sm:py-20 py-10">
      <div className="container max-w-[1350px] mx-auto px-4">
        <div className="flex flex-col items-center justify-center">
          <div className="mb-1 sm:mb-12 inline-block rounded-full sm:bg-gradient-to-r from-teal-400 to-green-500 sm:px-8 sm:py-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-black sm:text-white">
              Continuing the Legacy of Academic Excellence
            </h2>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
          <div className="flex flex-col max-w-[600px] justify-center">
            <h3 className="text-[28px] hidden sm:block sm:text-5xl font-bold text-zinc-800">
              One Way. Our Methods. Our Difference.
            </h3>
            <p className="mt-6 sm:text-xl text-base text-black">
              Holistic Education at BFIS
            </p>
            <p className="mt-4 sm:text-xl text-base text-black">
              Adding that holistic perspective of the child as the core essence
              of our academic system, we provide a comprehensive learning
              experience through Academics, Events, Facilities, and more.
            </p>
          </div>
          <Gallery />
        </div>
        <div className="hidden sm:grid lg:grid-cols-3 sm:grid-cols-2 gap-8 mt-12">
          <div className="h-[330px] w-full rounded-3xl">
            <img
              src="/info/admissions/legacy/legacy1.webp"
              alt="Gallery image"
              className="gallery-image object-cover rounded-3xl hover:scale-105 transition-all duration-700 ease-in-out mx-auto w-full h-full"
            />
          </div>
          <div className="h-[330px] w-full rounded-3xl">
            <img
              src="/info/admissions/legacy/legacy2.webp"
              alt="Gallery image"
              className="gallery-image object-cover rounded-3xl hover:scale-105 transition-all duration-700 ease-in-out mx-auto w-full h-full"
            />
          </div>
          <div className="h-[330px] w-full rounded-3xl">
            <img
              src="/info/admissions/legacy/legacy3.webp"
              alt="Gallery image"
              className="gallery-image object-cover rounded-3xl hover:scale-105 transition-all duration-700 ease-in-out mx-auto w-full h-full"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
