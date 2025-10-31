export default function Ranks() {
  return (
    <section className="relative w-full bg-white py-12 md:py-16">
      <div className="relative mx-auto max-w-7xl px-4">
        {/* Center divider on desktop */}
        <div className="pointer-events-none absolute left-1/2 top-0 hidden h-full w-px -translate-x-1/2 bg-black md:block" />

        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 md:gap-16">
          {/* Left: World Record */}
          <div className="flex flex-col items-center text-center md:text-left md:items-start">
            <h2 className="text-3xl font-extrabold leading-tight text-zinc-900">
              Be a part of World Record
              <br />
              Setting School!
            </h2>

            <img
              src="/ranks/unitedKingdom-logo.png"
              alt="World Book of Records UK"
              className="mt-8 h-auto max-w-full select-none transition-transform duration-300 hover:scale-[1.02]"
              draggable={false}
              loading="lazy"
            />

            <p className="mt-8 max-w-2xl text-lg leading-8 text-zinc-700">
              Brookfield set a world record with its virtual Enviro Tiger Fest 2020 and
              was awarded a certificate by World Book of Records, United Kingdom.
            </p>
          </div>

          {/* Right: Rank + Times of India */}
          <div className="flex flex-col items-center text-center md:text-left md:items-start">
            <h2 className="text-3xl font-extrabold leading-tight text-zinc-900">
              Brookfield International School
              <br />
              <span className="font-semibold">has marked its</span>
            </h2>

            <div className="mt-8 flex flex-col gap-6">
              <div className="flex flex-col items-start gap-4 md:flex-row md:items-center">
                <img
                  src="/ranks/rank1.png"
                  alt="1st Position"
                  className="h-auto max-w-full select-none transition-transform duration-300 hover:scale-[1.02]"
                  draggable={false}
                  loading="lazy"
                />
              </div>

              <div className="flex items-center gap-6">
                <img
                  src="/ranks/times_of_india.png"
                  alt="The Times of India"
                  className="h-auto max-w-full select-none opacity-90 transition-opacity duration-300 hover:opacity-100"
                  draggable={false}
                  loading="lazy"
                />
                {/* Optional: If you later add survey badge, place it here */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}