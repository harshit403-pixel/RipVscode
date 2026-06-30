function registerRoomEvents(io, socket, { roomLifecycleService, roomDAO, participantDAO }) {
  // Handle a participant joining a room.
  socket.on("join-room", async ({ roomCode, participant }) => {
    if (!participant || (!participant._id && !participant.id)) {
      socket.emit("room-error", {
        message: "Invalid participant data.",
      });
      return;
    }

    const participantId = participant._id || participant.id;

    try {
      // Join the socket.io room channel.
      socket.join(roomCode);

      // Track the participant inside the active room.
      await roomLifecycleService.joinRoom(roomCode, participantId);

      // Remember the membership on the socket for disconnect cleanup.
      socket.data.roomCode = roomCode;
      socket.data.participantId = participantId;

      // Notify the other participants in the room.
      socket.to(roomCode).emit("participant-joined", participant);
    } catch (error) {
      // Report the join failure back to the client.
      socket.emit("room-error", {
        message: error.message,
      });
    }
  });

  // Handle a participant leaving a room.
  socket.on("leave-room", async ({ roomCode, participantId }) => {
    try {
      // Leave the socket.io room channel.
      socket.leave(roomCode);

      // Remove the participant and evict the room if it becomes empty.
      await roomLifecycleService.leaveRoom(roomCode, participantId);

      // Clear the stored membership for this socket.
      socket.data.roomCode = null;
      socket.data.participantId = null;

      // Notify the other participants in the room.
      socket.to(roomCode).emit("participant-left", { participantId });
    } catch (error) {
      // Report the leave failure back to the client.
      socket.emit("room-error", {
        message: error.message,
      });
    }
  });

  // Handle an abrupt disconnect by cleaning up room membership.
  socket.on("disconnect", async () => {
    // Read the membership tracked at join time.
    const { roomCode, participantId } = socket.data;

    // Skip cleanup when the socket never joined a room.
    if (!roomCode || !participantId) {
      return;
    }

    try {
      // Remove the participant and evict the room if it becomes empty.
      await roomLifecycleService.leaveRoom(roomCode, participantId);

      // Notify the other participants in the room.
      socket.to(roomCode).emit("participant-left", { participantId });
    } catch (error) {
      // Log disconnect cleanup failures without affecting other sockets.
      console.error("Disconnect cleanup failed:", error.message);
    }
  });

  // Handle the host ending the session for everyone in the room.
  socket.on("end-session", async ({ roomCode, hostName }) => {
    try {
      // Close the room in storage and evict it from memory.
      await roomLifecycleService.closeRoom(roomCode);

      // Notify the other participants that the host ended the session.
      socket.to(roomCode).emit("room-closed", { hostName });
    } catch (error) {
      // Report the failure back to the host.
      socket.emit("room-error", {
        message: error.message,
      });
    }
  });

  // Handle a host kicking a participant from the room.
  socket.on("kick-participant", async ({ roomCode, hostParticipantId, targetParticipantId }) => {
    try {
      const room = await roomDAO.findRoomByCode(roomCode);
      if (!room) {
        socket.emit("room-error", { message: "Room not found." });
        return;
      }

      const kicker = await participantDAO.findParticipant({ _id: hostParticipantId, roomId: room._id });
      if (!kicker || kicker.role !== "HOST") {
        socket.emit("room-error", { message: "Only the host can kick participants." });
        return;
      }

      if (hostParticipantId === targetParticipantId) {
        socket.emit("room-error", { message: "Host cannot kick themselves." });
        return;
      }

      const target = await participantDAO.findParticipant({ _id: targetParticipantId, roomId: room._id });
      if (!target) {
        socket.emit("room-error", { message: "Participant not found." });
        return;
      }

      await participantDAO.deleteParticipant({ _id: targetParticipantId });

      const targetSocketId = target.socketId;
      if (targetSocketId) {
        const targetSocket = io.sockets.sockets.get(targetSocketId);
        if (targetSocket) {
          targetSocket.emit("participant-kicked", { roomCode });
          targetSocket.leave(roomCode);
          targetSocket.disconnect(true);
        }
      }

      socket.to(roomCode).emit("participant-left", { participantId: targetParticipantId });
    } catch (error) {
      socket.emit("room-error", { message: error.message });
    }
  });
}

export default registerRoomEvents;
