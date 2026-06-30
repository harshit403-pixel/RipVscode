import { useEffect, useRef } from "react";
import { socket } from "@/lib/socket";

const useCursorSocket = () => {
  // In-memory map to store remote cursors: { userId: offset }
  const remoteCursors = useRef({});
  useEffect(() => {
    if (!socket.connected) {
      socket.connect();
    }

    // 1. Listen for cursor updates from other users
    socket.on("remote-cursor", ({ userId, offset }) => {
      remoteCursors.current[userId] = offset;
      console.log("Updated Remote Cursors Map:", remoteCursors.current);
    });

    // 2. Listen for other users disconnecting
    socket.on("cursor-disconnect", ({ userId }) => {
      delete remoteCursors.current[userId];
      console.log(
        "User disconnected. Updated Remote Cursors Map:",
        remoteCursors.current,
      );
    });

    // Cleanup event listeners when hook unmounts
    return () => {
      socket.off("remote-cursor");
      socket.off("cursor-disconnect");
    };
  }, []);

  // 3. Emit local cursor move
  const emitCursorMove = (offset) => {
    if (socket.connected && roomCode) {
      socket.emit("cursor-move", {
        roomCode,
        offset,
      });
    }
  };

  return {
    emitCursorMove,

    // Expose the raw map reference for future editor integration
    remoteCursors,
  };
};

export default useCursorSocket;
