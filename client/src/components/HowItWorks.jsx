"use client";

import { useState } from "react";



export default function HowItWorks() {
    const [activeStep, setActiveStep] = useState(0);
  const steps = [
  {
    number: "01",
    title: "Create a Room",
    desc: "Start a collaborative coding session in seconds with a unique room code.",
    image: "/showcase/1.png",
  },
  {
    number: "02",
    title: "Invite Teammates",
    desc: "Share the room code and let others join instantly from anywhere.",
    image: "/showcase/2.png",
  },
  {
    number: "03",
    title: "Code Together",
    desc: "Write, edit and collaborate in real time with everyone in the room.",
    image: "/showcase/3.png",
  },
];
  return (
    <section className="bg-[#111111] px-16 py-40 text-white">
      <div className="mx-auto max-w-7xl">
        <p className="mb-4 text-sm uppercase tracking-[0.3em] text-gray-400">
          How it works
        </p>

        <h2
          className="max-w-4xl text-[90px] leading-[0.9]"
          style={{
            fontFamily: "Cormorant Garamond",
          }}
        >
          Collaboration
          <br />
          made simple.
        </h2>

        <div className="mt-28 grid grid-cols-2 gap-24">
  {/* LEFT */}
  <div className="space-y-8">
    {steps.map((step, index) => (
      <div
        key={step.number}
        onMouseEnter={() =>
          setActiveStep(index)
        }
        className="
          cursor-pointer
          border-t
          border-white/15
          py-12
          transition-all
          duration-300
        "
      >
        <div className="flex gap-10">
          <div
            className={`
              w-20 text-2xl
              ${
                activeStep === index
                  ? "text-white"
                  : "text-gray-500"
              }
            `}
          >
            {step.number}
          </div>

          <div>
            <h3
              className={`
                text-4xl transition-all duration-300
                ${
                  activeStep === index
                    ? "text-white"
                    : "text-gray-500"
                }
              `}
            >
              {step.title}
            </h3>

            <p
              className={`
                mt-4 max-w-xl text-lg leading-relaxed
                ${
                  activeStep === index
                    ? "text-gray-300"
                    : "text-gray-600"
                }
              `}
            >
              {step.desc}
            </p>
          </div>
        </div>
      </div>
    ))}
  </div>

  {/* RIGHT */}
  <div className="sticky top-40 h-[650px]">
    <div className="relative h-full overflow-hidden rounded-[40px]">
      {steps.map((step, index) => (
        <img
          key={step.number}
          src={step.image}
          alt={step.title}
          className={`
            absolute
            inset-0
            h-full
            w-full
            object-cover
            transition-all
            duration-500
            ${
              activeStep === index
                ? "opacity-100 scale-100"
                : "opacity-0 scale-110"
            }
          `}
        />
      ))}
    </div>
  </div>
</div>


      </div>
    </section>
  );
}