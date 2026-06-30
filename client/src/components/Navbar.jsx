"use client";

import { useRouter } from "next/navigation";

export default function Navbar() {

  const router = useRouter();
  return (
    <nav className="fixed top-0  z-50 flex w-full  gap-10 items-center  px-16 py-8">
      <div className="text-4xl font-semibold tracking-tight">
        RIP<span className="font-light">vscode</span>
      </div>

       <div className=" flex gap-5">
                <button
                onClick={() => router.push("/login")}
                className="group relative h-7 overflow-hidden cursor-pointer">
  <span className="block transition-transform duration-300 group-hover:-translate-y-full">
    Login
  </span>

  <span className="absolute left-0 top-full transition-all duration-300 group-hover:top-0">
    Login
  </span>
</button>
                <button
                onClick={() => router.push("/signup")}
                className="group relative h-7 overflow-hidden cursor-pointer">
  <span className="block transition-transform duration-300 group-hover:-translate-y-full">
    SignUp
  </span>

  <span className="absolute left-0 top-full transition-all duration-300 group-hover:top-0">
    SignUp
  </span>
</button>
      
                
      </div>
    </nav>
  );
}