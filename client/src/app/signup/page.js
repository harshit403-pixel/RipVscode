"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";

import { signup } from "@/features/auth/api/auth.api";
import { setUser } from "@/features/auth/state/authSlice";
import { navigate } from "@/lib/navigate";

export default function SignupPage() {
  const router = useRouter();
  const dispatch = useDispatch();

  const [form, setForm] = useState({
    username: "",
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

    if (!form.username.trim()) {
      setError("Username is required");
      return;
    }

    if (!form.email.trim()) {
      setError("Email is required");
      return;
    }

    if (!form.password.trim()) {
      setError("Password is required");
      return;
    }

    if (form.password.length < 6) {
      setError(
        "Password should be at least 6 characters"
      );
      return;
    }

    try {
      setLoading(true);

      const res = await signup(form);

      dispatch(setUser(res.data.data));

      router.push("/create-room");
    } catch (err) {
      console.log(err);

      setError(
        err.response?.data?.message ||
          "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-black">
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
        "
      >
        <source
          src="/videos/signupPage.webm"
          type="video/webm"
        />
      </video>

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/20" />

      {/* Form */}
      <div
        className="
          relative
          z-10
          w-full
          max-w-md
          rounded-[32px]
          bg-white/30
          p-10
          backdrop-blur-xl
          shadow-2xl
        "
      >
        <h1
          className="
            mb-2
            text-center
            text-[60px]
            leading-none
          "
          style={{
            fontFamily:
              "Cormorant Garamond",
          }}
        >
          Join Us
        </h1>

        <p className="mb-8 text-center text-white/80">
          Create your account and start
          coding together.
        </p>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          <input
            type="text"
            placeholder="Username"
            value={form.username}
            onChange={(e) =>
              setForm({
                ...form,
                username:
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

          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) =>
              setForm({
                ...form,
                email:
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
              cursor-pointer
            "
          >
            {loading
              ? "Creating Account..."
              : "Create Account"}
          </button>
        </form>

        <p className="mt-8 text-center text-white/80">
          Already have an account?{" "}
          <span
            className="cursor-pointer underline"
            onClick={() =>
  navigate(router, "/login")
}
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
}