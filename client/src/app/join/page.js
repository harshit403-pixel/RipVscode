"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { joinRoom } from "@/features/room/api/room.api";

export default function JoinPage() {
  const router = useRouter();

  const [form, setForm] =
    useState({
      displayName: "",
      roomCode: "",
    });

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await joinRoom(form);

      router.push(
        `/room/${form.roomCode}`
      );
    } catch (err) {
      setError(
        err.response?.data
          ?.message ||
          "Failed to join room"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F7F5F0]">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg rounded-[30px] bg-white p-10 shadow-lg"
      >
        <h1
          className="mb-8 text-6xl"
          style={{
            fontFamily:
              "Cormorant Garamond",
          }}
        >
          Join Room
        </h1>

        <div className="space-y-4">
          <input
            placeholder="Your Name"
            value={
              form.displayName
            }
            onChange={(e) =>
              setForm({
                ...form,
                displayName:
                  e.target.value,
              })
            }
            className="
              w-full
              rounded-2xl
              border
              border-gray-200
              px-5
              py-4
            "
          />

          <input
            placeholder="Room Code"
            value={form.roomCode}
            onChange={(e) =>
              setForm({
                ...form,
                roomCode:
                  e.target.value
                    .toUpperCase(),
              })
            }
            className="
              w-full
              rounded-2xl
              border
              border-gray-200
              px-5
              py-4
            "
          />
        </div>

        {error && (
          <p className="mt-4 text-red-500">
            {error}
          </p>
        )}

        <button
          className="
            mt-6
            w-full
            rounded-full
            bg-black
            py-4
            text-white
          "
        >
          {loading
            ? "Joining..."
            : "Join Room"}
        </button>
      </form>
    </div>
  );
}