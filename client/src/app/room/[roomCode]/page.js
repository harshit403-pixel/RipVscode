"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getRoom } from "@/features/room/api/room.api";

export default function RoomPage() {
  const { roomCode } = useParams();
  const router = useRouter();

  const [room, setRoom] = useState(null);
  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const res =
          await getRoom(roomCode);

        setRoom(res.data.data);
      } catch (err) {
        console.log(err);
        router.push("/");
      } finally {
        setLoading(false);
      }
    };

    if (roomCode) {
      fetchRoom();
    }
  }, [roomCode, router]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!room) {
    return (
      <div>
        Room not found
      </div>
    );
  }

  return (
    <div className="p-10">
      <h1 className="text-5xl">
        {room.room.roomName}
      </h1>

      <p className="mt-4">
        Room Code:{" "}
        {room.room.roomCode}
      </p>

      <h2 className="mt-10 text-3xl">
        Participants
      </h2>

      <ul className="mt-4">
        {room.participants.map(
          (participant) => (
            <li key={participant.id}>
              {
                participant.displayName
              }
            </li>
          )
        )}
      </ul>
    </div>
  );
}