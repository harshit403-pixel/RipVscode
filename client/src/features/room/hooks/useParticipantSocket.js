import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { socket } from "@/lib/socket";
import { addParticipant, removeParticipant } from "../state/roomSlice";

export const useParticipantSocket = (roomCode) => {
  const dispatch = useDispatch();

  useEffect(() => {
    if (!socket.connected) {
      socket.connect();
    }

    // 1. Listen for new participants joining
    socket.on("participant-joined", (participant) => {
      dispatch(addParticipant(participant));
    });

    // 2. Listen for participants leaving or disconnecting
    socket.on("participant-left", ({ participantId }) => {
      dispatch(removeParticipant(participantId));
    });

    // Cleanup listeners on unmount
    return () => {
      socket.off("participant-joined");
      socket.off("participant-left");
    };
  }, [dispatch]);

  // 3. Emit local join
  const joinRoomSocket = (participant) => {
    if (socket.connected && roomCode) {
      socket.emit("join-room", { roomCode, participant });
    }
  };

  // 4. Emit local leave
  const leaveRoomSocket = (participantId) => {
    if (socket.connected && roomCode) {
      socket.emit("leave-room", { roomCode, participantId });
    }
  };

  return {
    joinRoomSocket,
    leaveRoomSocket,
  };
};

export default useParticipantSocket;
