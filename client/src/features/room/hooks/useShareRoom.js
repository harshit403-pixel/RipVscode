import { useState } from "react";

export const useShareRoom = (roomCode = "room-7f3g2k") => {
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const getRoomLink = () => {
    if (typeof window !== "undefined") {
      return `${window.location.origin}/room/${roomCode}`;
    }
    return `http://localhost:3000/room/${roomCode}`;
  };

  const copyRoomLink = async () => {
    const link = getRoomLink();
    try {
      await navigator.clipboard.writeText(link);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy link:", error);
    }
  };

  // Copy just the room code (used by the header room-id button).
  const copyRoomCode = async () => {
    try {
      await navigator.clipboard.writeText(roomCode);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy room code:", error);
    }
  };

  const openShare = () => setIsShareOpen(true);
  const closeShare = () => setIsShareOpen(false);

  return {
    isShareOpen,
    isCopied,
    roomLink: getRoomLink(),
    copyRoomLink,
    copyRoomCode,
    openShare,
    closeShare,
  };
};
