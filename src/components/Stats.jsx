const stats = [
  { icon: "/info/admissions/stats/1.png", value: "2000+", label: "Students" },
  { icon: "/info/admissions/stats/2.png", value: "150+", label: "Faculty" },
  { icon: "/info/admissions/stats/4.png", value: "100%", label: "Results" },
  { icon: "/info/admissions/stats/3.png", value: "7+", label: "Acres Campus" },
];

export default function Stats() {
  return (
    <section className="bg-[#103b89] py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-around divide-white md:flex-row md:divide-x-4">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="flex w-full items-center sm:justify-center justify-start gap-4 p-6 transition-transform duration-300 hover:scale-110 md:w-auto"
            >
              <img
                src={stat.icon}
                alt={stat.label}
                className="h-20 w-20"
              />
              <div>
                <p className="text-3xl font-bold text-white">{stat.value}</p>
                <p className="text-xl text-white">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
