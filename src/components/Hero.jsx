import { CheckCircle } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative pt-16 sm:pt-0 min-h-screen w-full overflow-hidden flex items-center">
      {/* Mobile Background (below md) */}
      <div
        className="absolute inset-0 bg-cover bg-no-repeat bg-center md:hidden"
        style={{ backgroundImage: "url(/Banner-sm.png)" }}
      />
      {/* Desktop Background (md and above) */}
      <div
        className="hidden md:block absolute inset-0 bg-cover bg-no-repeat bg-center"
        style={{ backgroundImage: "url(/Hero-Banner.png)" }}
      />
      {/* Main Content Grid */}
      <div className="relative w-full max-w-[1400px] mx-auto flex flex-col lg:flex-row items-center justify-between px-4 lg:px-12 py-8 lg:py-0 z-10">
        {/* LEFT: Logo and Text */}
        <div className="flex-1 flex flex-col md:mt-20 items-start max-w-[610px]">
          {/* Admissions Badge */}
          <div className="flex flex-col gap-3 mb-6">
            <div className="inline-flex items-center gap-3 bg-linear-to-r from-green-600 to-green-500 px-6 py-3 rounded-full shadow-2xl border-2 border-white hover:shadow-2xl hover:scale-105 transition-all duration-300">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
              </span>
              <span className="text-white font-extrabold text-xl sm:text-2xl uppercase tracking-wider drop-shadow-lg">
                Admissions Open
              </span>
            </div>
            <div className="bg-white/95 backdrop-blur-sm border-2 border-green-600 rounded-lg px-5 py-2.5 shadow-lg inline-block">
              <span className="text-gray-900 font-bold text-lg sm:text-xl">
                Academic Year:{" "}
              </span>
              <span className="text-green-600 font-extrabold text-xl sm:text-2xl">
                2026-27
              </span>
            </div>
          </div>
          {/* Headline */}
          <h1 className="text-3xl sm:text-5xl md:text-[54px] font-extrabold text-black leading-[1.08] mb-4 drop-shadow-xl uppercase">
            Give your child <br className="hidden sm:inline" />
            Best Learning Experience at{" "}
          </h1>
          {/* Sub-headline Banner */}
          <div className="mb-6">
            <span className="inline-block bg-[#acf15c] pl-3 pr-7 py-1.5 text-black text-[30px] font-semibold drop-shadow-sm tracking-wider">
              Brookfield International School
            </span>
          </div>
          
          {/* Bullet List */}
          {/* <ul className="space-y-3 text-lg sm:text-3xl text-white font-semibold mb-2">
            <li className="flex items-center gap-2">
              <CheckCircle className="h-6 w-6" />A CBSE school with
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="h-6 w-6" />
              World-class infrastructure
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="h-6 w-6" />
              legacy of personalized learning
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="h-6 w-6" />
              99% results
            </li>
          </ul> */}
        </div>

        {/* RIGHT: Enquiry Form */}
        <div className="flex-1 flex justify-center items-center w-full max-w-md lg:pl-8 mt-12 lg:mt-0">
          <form
            className="w-full bg-white/95 scale-90 shadow-xl rounded-[2rem] px-10 pt-8 pb-8 flex flex-col gap-5 min-w-[340px] max-w-[400px]"
            style={{ boxShadow: "0 4px 32px 0 rgba(28,31,39,0.13)" }}
          >
            <h3 className="text-2xl font-medium text-center text-[#18181b] mb-2">
              Enquire Now
            </h3>
            <input
              type="text"
              placeholder="Parent's Name"
              className="px-5 py-3 border border-[#d7d7dc] rounded-md focus:ring-2 focus:ring-[#acf15c] focus:outline-none transition text-base"
              required
            />
            <input
              type="text"
              placeholder="Student's Name"
              className="px-5 py-3 border border-[#d7d7dc] rounded-md focus:ring-2 focus:ring-[#acf15c] focus:outline-none transition text-base"
              required
            />
            <input
              type="email"
              placeholder="Email"
              className="px-5 py-3 border border-[#d7d7dc] rounded-md focus:ring-2 focus:ring-[#acf15c] focus:outline-none transition text-base"
              required
            />
            <input
              type="tel"
              placeholder="Phone"
              className="px-5 py-3 border border-[#d7d7dc] rounded-md focus:ring-2 focus:ring-[#acf15c] focus:outline-none transition text-base"
              required
            />
            <select
              name="class"
              className="px-5 py-3 border border-[#d7d7dc] rounded-md focus:ring-2 focus:ring-[#acf15c] focus:outline-none transition text-base bg-white cursor-pointer"
              required
              defaultValue=""
            >
              <option value="" disabled>
                Class Applying For
              </option>
              <option value="pre-nursery">Pre-Nursery</option>
              <option value="nursery">Nursery</option>
              <option value="lkg">LKG (Lower Kindergarten)</option>
              <option value="ukg">UKG (Upper Kindergarten)</option>
              <option value="grade-i">Grade I</option>
              <option value="grade-ii">Grade II</option>
              <option value="grade-iii">Grade III</option>
              <option value="grade-iv">Grade IV</option>
              <option value="grade-v">Grade V</option>
              <option value="grade-vi">Grade VI</option>
              <option value="grade-vii">Grade VII</option>
              <option value="grade-viii">Grade VIII</option>
              <option value="grade-ix">Grade IX</option>
              <option value="grade-x">Grade X</option>
              <option value="grade-xi">Grade XI</option>
              <option value="grade-xii">Grade XII</option>
            </select>
            <button
              type="submit"
              className="w-full py-3 rounded-md bg-[#acf15c] text-black text-lg font-semibold mt-2 hover:bg-[#abf15cc3] transition"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
