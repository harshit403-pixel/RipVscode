"use client";

import { useParams } from "next/navigation";
import RoomPage from "@/features/room/ui/jsx/RoomPage";
import ProtectedRoute from "@/features/auth/ui/jsx/ProtectedRoute";

export default function Page() {

  // Read the room code from the route and render the collaborative room.
  const { roomCode } = useParams();

  return (
    <ProtectedRoute>
      <RoomPage roomCode={roomCode} />
    </ProtectedRoute>
  );
}
