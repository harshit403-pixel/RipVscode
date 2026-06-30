"use client";

import { useParams } from "next/navigation";
import RoomPage from "@/features/room/ui/jsx/RoomPage";

export default function Page() {

  // Read the room code from the route and render the collaborative room.
  const { roomCode } = useParams();

  return <RoomPage roomCode={roomCode} />;
}
