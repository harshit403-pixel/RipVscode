"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";

import { login } from "@/features/auth/api/auth.api";
import { setUser } from "@/features/auth/state/authSlice";

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useDispatch();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!form.email.trim()) {
      setError("Email is required");
      return;
    }

    if (!form.password.trim()) {
      setError("Password is required");
      return;
    }

    try {
      setLoading(true);

      const res = await login(form);

      dispatch(setUser(res.data.data));

      router.push("/create-room");
    } catch (err) {
      console.log(err);

      setError(
        err.response?.data?.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F7F5F0]">
      {/* Left */}
      <div className="flex w-1/2 items-center justify-center px-20">
        <div className="w-full max-w-md">
          <h1
            className="mb-4 text-[72px] leading-none"
            style={{
              fontFamily:
                "Cormorant Garamond",
            }}
          >
            Welcome
            <br />
            Back.
          </h1>

          <p className="mb-10 text-lg text-gray-500">
            Login to continue coding
            together.
          </p>

          <form
            className="space-y-5"
            onSubmit={handleSubmit}
          >
            <input
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={(e) =>
                setForm({
                  ...form,
                  email: e.target.value,
                })
              }
              className="
                w-full
                rounded-2xl
                border
                border-gray-200
                bg-white
                px-5
                py-4
                outline-none
                focus:border-black
              "
            />

            <input
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={(e) =>
                setForm({
                  ...form,
                  password:
                    e.target.value,
                })
              }
              className="
                w-full
                rounded-2xl
                border
                border-gray-200
                bg-white
                px-5
                py-4
                outline-none
                focus:border-black
              "
            />

            {error && (
              <p className="text-sm text-red-500">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="
                w-full
                rounded-full
                bg-black
                py-4
                text-white
                transition
                hover:opacity-90
                disabled:cursor-not-allowed
                disabled:opacity-60
              "
            >
              {loading
                ? "Logging in..."
                : "Login"}
            </button>
          </form>

          <p className="mt-8 text-center text-gray-500">
            Don't have an account?{" "}
            <span
              className="cursor-pointer underline"
              onClick={() =>
                router.push("/signup")
              }
            >
              Sign up
            </span>
          </p>
        </div>
      </div>

      {/* Right */}
      <div className="relative flex w-1/2 items-center justify-center overflow-hidden">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="
            h-[80vh]
            rounded-[10px]
            object-cover
            shadow-2xl
          "
        >
          <source
            src="/videos/stand-peoples.webm"
            type="video/webm"
          />
        </video>
      </div>
    </div>
  );
}