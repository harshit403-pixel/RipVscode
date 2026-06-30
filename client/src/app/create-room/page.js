"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createRoom } from "@/features/room/api/room.api";

export default function CreateRoomPage() {
  const router = useRouter();

  const [roomName, setRoomName] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!roomName.trim()) {
      setError(
        "Room name is required"
      );
      return;
    }

    try {
      setLoading(true);

      const res =
        await createRoom({
          roomName,
        });

      const roomCode =
        res.data.data.roomCode;

      router.push(
        `/room/${roomCode}`
      );
    } catch (err) {
      setError(
        err.response?.data
          ?.message ||
          "Failed to create room"
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
          Create Room
        </h1>

        <input
          placeholder="Room Name"
          value={roomName}
          onChange={(e) =>
            setRoomName(
              e.target.value
            )
          }
          className="
            w-full
            rounded-2xl
            border
            border-gray-200
            px-5
            py-4
            outline-none
          "
        />

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
            ? "Creating..."
            : "Create Room"}
        </button>
      </form>
    </div>
  );
}