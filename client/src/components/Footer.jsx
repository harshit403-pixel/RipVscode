"use client";

import {
  FaGithub,
  FaLinkedin,
  FaInstagram,
} from "react-icons/fa";
import { useRouter } from "next/navigation";

export default function Footer() {
  const router = useRouter();

  return (
    <footer className="relative overflow-hidden">
  {/* Background Video */}
  <video
    autoPlay
    muted
    loop
    playsInline
    className="
      absolute
      inset-0
      h-full
      w-full
      object-cover
      pointer-events-none
    "
  >
    <source
      src="/videos/footer-video.mp4"
      type="video/mp4"
    />
  </video>



  {/* Content */}
  <div className="relative z-10 mx-auto min-h-[700px] w-full px-16 py-24">
    {/* Top */}
    <div className="flex flex-col items-center text-center">
      <h2
        className="
          text-[110px]
          leading-none
          tracking-[-0.05em]
        "
        style={{
          fontFamily:
            "Cormorant Garamond",
        }}
      >
        RIP VS CODE
      </h2>

      <p className="mt-6 max-w-2xl text-xl leading-relaxed text-gray-700">
        Code together in real time.
        Build collaborative coding rooms,
        invite teammates and write code
        from anywhere.
      </p>

      {/* Social Icons */}
<div className="mt-3 flex items-center gap-10">
  {[
    {
      name: "Harshit",
      url: "https://github.com/harshit403-pixel",
    },
    {
      name: "Bhavya",
      url: "https://github.com/bhavya-dhanwani",
    },
    {
      name: "Sharat",
      url: "https://github.com/sharatkatwa",
    },
  ].map((member) => (
    <a
      key={member.name}
      href={member.url}
      target="_blank"
      rel="noopener noreferrer"
      className="
        group
        flex
        flex-col
        items-center
        gap-3
      "
    >
      <div
        className="
          flex
          h-16
          w-16
          items-center
          justify-center
          rounded-full
          border
          border-black/15
          bg-white/50
          text-3xl
          transition
          duration-300
          group-hover:-translate-y-1
          group-hover:scale-105
        "
      >
        <FaGithub />
      </div>

      <span
        className="
          text-sm
          text-gray-700
          transition
          group-hover:text-black
        "
      >
        {member.name}
      </span>
    </a>
  ))}
</div>
    </div>

   
  </div>
</footer>
  );
}