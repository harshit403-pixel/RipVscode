export default function Features() {
  const features = [
    {
      title: "Real-time Collaboration",
      desc: "Write code with your teammates and see every change instantly.",
    },
    {
      title: "Room Based Sessions",
      desc: "Create private coding rooms and invite anyone with a room code.",
    },
    {
      title: "Built for Teams",
      desc: "Perfect for interviews, pair programming and hackathons.",
    },
  ];

  return (
    <section className="bg-[#F7F5F0] px-20 py-40">
      <div className="mx-auto max-w-7xl">
        <p className="mb-4 text-sm uppercase tracking-[0.3em] text-gray-500">
          Why RIPvscode
        </p>

        <h2
          className="max-w-4xl text-[80px] leading-[0.9]"
          style={{
            fontFamily:
              "Cormorant Garamond",
          }}
        >
          Everything you need to code together.
        </h2>

        <div className="mt-24 grid grid-cols-3 gap-8">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="
                rounded-[30px]
                bg-white
                p-10
                shadow-sm
                transition-all
                duration-500
                hover:-translate-y-2
                hover:shadow-xl
              "
            >
              <h3 className="text-3xl font-medium">
                {feature.title}
              </h3>

              <p className="mt-5 text-lg leading-relaxed text-gray-600">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-32 overflow-hidden rounded-[40px] shadow-2xl">
          <img
            src="/showcase/10.png"
            alt="Dashboard"
            className="w-full"
          />
        </div>
      </div>
    </section>
  );
}