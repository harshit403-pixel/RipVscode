"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();

  const [show, setShow] =
    useState(true);

  const lastScrollY =
    useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const current =
        window.scrollY;

      if (current < 100) {
        setShow(true);
      } else if (
        current > lastScrollY.current
      ) {
        // scrolling down
        setShow(false);
      } else {
        // scrolling up
        setShow(true);
      }

      lastScrollY.current =
        current;
    };

    window.addEventListener(
      "scroll",
      handleScroll
    );

    return () =>
      window.removeEventListener(
        "scroll",
        handleScroll
      );
  }, []);

  return (
    <nav
      className={`
        fixed
        top-0
        left-0
        z-50
        flex
        w-full
        items-center
        gap-5
        px-16
        py-8
        
        
       
        transition-transform
        duration-500
        ${
          show
            ? "translate-y-0"
            : "-translate-y-full"
        }
      `}
    >
      <div
      onClick={() =>
            router.push("/")
          }
      className="text-4xl cursor-pointer font-semibold tracking-tight">
        RIP
        <span className="font-light">
          vscode
        </span>
      </div>

      <div className="flex gap-8">
        <button
          onClick={() =>
            router.push("/login")
          }
          className="
            group
            relative
            h-7
            overflow-hidden
            cursor-pointer
          "
        >
          <span className="block transition-transform duration-300 group-hover:-translate-y-full">
            Login
          </span>

          <span className="absolute left-0 top-full transition-all duration-300 group-hover:top-0">
            Login
          </span>
        </button>

        <button
          onClick={() =>
            router.push("/signup")
          }
          className="
            group
            relative
            h-7
            overflow-hidden
            cursor-pointer
          "
        >
          <span className="block transition-transform duration-300 group-hover:-translate-y-full">
            Sign Up
          </span>

          <span className="absolute left-0 top-full transition-all duration-300 group-hover:top-0">
            Sign Up
          </span>
        </button>
      </div>
    </nav>
  );
}