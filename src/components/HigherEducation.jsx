// import Image from "next/image";

const educationData = [
  {
    title: "Pre-Primary",
    description: "for 3-5 Years",
    image: "/info/admissions/classes/pre-primary.webp",
  },
  {
    title: "Primary",
    description: "for Grade 1-5",
    image: "/info/admissions/classes/primary.webp",
  },
  {
    title: "Middle School",
    description: "for Grade 6-8",
    image: "/info/admissions/classes/middle.webp",
  },
  {
    title: "High School",
    description: "for Grade 9-10",
    image: "/info/admissions/classes/high.webp",
  },
  {
    title: "Higher Secondary",
    description: "for Grade 11-12",
    image: "/info/admissions/classes/senior.webp",
  },
];

const Card = ({ level }) => (
  <div className="group cursor-pointer rounded-xl transition-transform duration-300 hover:scale-105">
    <div className="h-60 border-5 border-white/90 hover:border-white overflow-hidden rounded-lg">
      <img
        src={level.image}
        alt={level.title}
        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
      />
    </div>
    <div className="pt-4 text-center text-white">
      <h3 className="text-2xl sm:text-3xl font-bold">{level.title}</h3>
      <p className="mt-2 sm:text-2xl text-base">{level.description}</p>
    </div>
  </div>
);

export default function HigherEducation() {
  return (
    <section
      className="relative bg-cover bg-center sm:py-20 py-10"
      style={{ backgroundImage: "url('/info/admissions/HigherEdu-Bg.png')" }}
    >
      <div className="container relative mx-auto max-w-7xl px-4">
        <h2 className="text-center text-2xl sm:text-3xl font-bold text-white md:text-4xl">
          From Foundation to Higher Education
        </h2>
        <div className="sm:mt-16 mt-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-6">
            <div className="md:col-span-2">
              <Card level={educationData[0]} />
            </div>
            <div className="md:col-span-2">
              <Card level={educationData[1]} />
            </div>
            <div className="md:col-span-2">
              <Card level={educationData[2]} />
            </div>
            <div className="md:col-span-1" />
            <div className="md:col-span-2">
              <Card level={educationData[3]} />
            </div>
            <div className="md:col-span-2">
              <Card level={educationData[4]} />
            </div>
            {/* <div className="md:col-span-1" /> */}
          </div>
        </div>
      </div>
    </section>
  );
}
