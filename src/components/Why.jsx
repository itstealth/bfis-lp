

const features = [
  {
    title: "Personalized Education",
    description: "Holistic development with individualized focus for every child.",
    icon: "/why/1.png",
    gradient: "from-yellow-400 to-orange-500",
  },
  {
    title: "Innovative Learning",
    description: "Smart Classes integrating cutting-edge technology and virtual labs across all grades (Pre-Nursery to Class 12th).",
    icon: "/why/2.png",
    gradient: "from-teal-400 to-cyan-500",
    bgColor: "bg-gradient-to-b from-teal-500 to-green-500",
    isFeatured: true,
  },
  {
    title: "Co-Curricular Excellence",
    description: "15+ Sports Activities and 10+ Cultural Events, supported by dedicated facilities.",
    icon: "/why/3.png",
    gradient: "from-red-400 to-orange-500",
  },
  {
    title: "World-Class Facilities",
    description: "State-of-the-art campus, 6 Advanced Science Labs, and a modern library with 20,000+ books.",
    icon: "/why/4.png",
    gradient: "from-blue-400 to-cyan-400",
  },
  {
    title: "Future-Ready Skills",
    description: "Active clubs for Robotics, Coding, Debate, and guaranteed exposure to 21st-century competencies.",
    icon: "/why/5.png",
    gradient: "from-pink-400 to-red-500",
  },
];

const FeatureCard = ({ feature }) => (
  <div className={`rounded-2xl p-6 text-center transition-transform duration-300 hover:scale-105 ${feature.isFeatured ? feature.bgColor : 'bg-transparent border border-black'}`}>
    <img src={feature.icon} alt={feature.title} className="w-24 h-24 mx-auto mb-6" />
    <h3 className={`text-2xl font-bold ${feature.isFeatured ? 'text-white' : 'text-zinc-800'}`}>{feature.title}</h3>
    <p className={`mt-4 text-lg ${feature.isFeatured ? 'text-gray-200' : 'text-gray-500'}`}>{feature.description}</p>
  </div>
);

export default function Why() {
  return (
    <section className="bg-grid-pattern py-20">
      <div className="container max-w-[1400px] mx-auto px-4">
        <h2 className="text-center text-4xl font-bold md:text-5xl">
          Why Brookfield?
        </h2>
        <div className="mt-16 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-5">
          {features.map((feature, index) => (
            <FeatureCard key={index} feature={feature} />
          ))}
        </div>
      </div>
    </section>
  );
}
