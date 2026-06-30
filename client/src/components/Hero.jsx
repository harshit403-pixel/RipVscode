"use client";

import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import Button from "./Button";
import { navigate } from "@/lib/navigate";

export default function Hero() {
  const router = useRouter();

  const { isAuthenticated } = useSelector(
    (state) => state.auth
  );

  const handleCreateRoom = () => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    router.push("/create-room");
  };

  return (
    <section className="relative min-h-screen overflow-hidden bg-[#F7F5F0]">
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="
          absolute
          top-25
          right-[-3%]
          z-0
          scale-[1.25]
          object-cover
          pointer-events-none
          select-none
        "
      >
        <source
          src="/videos/coding-women.webm"
          type="video/webm"
        />
      </video>

      {/* Content */}
      <div className="relative z-10 ml-15 flex min-h-screen max-w-7xl mt-33 ">
        <div className="max-w-4xl flex flex-col gap-5 ">
          <h1
            className="
              text-[110px]
              leading-[0.7]
              tracking-[-0.05em]
              font-light
            "
            style={{
              fontFamily:
                "Cormorant Garamond",
            }}
          >
            Build code together
            <br />
            in real time.
          </h1>

          <p className=" max-w-2xl text-2xl leading-relaxed text-gray-600">
            Create collaborative coding rooms,
            invite teammates, and code
            together instantly.
          </p>

          <div className=" flex items-center gap-6">
            <Button
              onClick={() =>
  navigate(
    router,
    "/signup"
  )
}
            >
              Create Room
            </Button>

            <Button
              variant="secondary"
              onClick={() =>
                router.push("/join")
              }
            >
              Join Room
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}