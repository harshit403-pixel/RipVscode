"use client";

import { useEffect, useState } from "react";
import { gsap } from "gsap";

export default function AppLoader() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let current = 0;

    const interval = setInterval(() => {
      current += Math.floor(Math.random() * 8) + 1;

      if (current >= 100) {
        current = 100;
        clearInterval(interval);
      }

      setCount(current);
    }, 35);

    const tl = gsap.timeline({
      delay: 3,
    });

    tl.to(".loader-top", {
      y: "-100%",
      duration: 1.2,
      ease: "power4.inOut",
    });

    tl.to(
      ".loader-bottom",
      {
        y: "100%",
        duration: 1.2,
        ease: "power4.inOut",
      },
      "<"
    );

    tl.to(".loader-wrapper", {
      opacity: 0,
      pointerEvents: "none",
      duration: 0.4,
    });

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="loader-wrapper fixed inset-0 z-[9999]">
      <div className="loader-top absolute inset-x-0 top-0 h-1/2 bg-black" />

      <div className="loader-bottom absolute inset-x-0 bottom-0 h-1/2 bg-black" />

      <div
        className="
          absolute
          inset-0
          flex
          items-center
          justify-center
          text-white
        "
      >
        <h1 className="text-[100px] font-light">
  RIPVSCODE
</h1>

<p className="absolute bottom-20 text-xl">
  Loading {count}%
</p>
      </div>
    </div>
  );
}