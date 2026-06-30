function registerRoomEvents(
  io,
  socket,
  {
    roomLifecycleService,
  }
) {

  // Handle a participant joining a room.
  socket.on(
    "join-room",
    async ({
      roomCode,
      participantId,
    }) => {

      try {

        // Join the socket.io room channel.
        socket.join(roomCode);

        // Track the participant inside the active room.
        await roomLifecycleService.joinRoom(roomCode, participantId);

        // Remember the membership on the socket for disconnect cleanup.
        socket.data.roomCode = roomCode;
        socket.data.participantId = participantId;

        // Notify the other participants in the room.
        socket.to(roomCode).emit(
          "participant-joined",
          participantId
        );

      } catch (error) {

        // Report the join failure back to the client.
        socket.emit(
          "room-error",
          {
            message: error.message,
          }
        );

      }

    }
  );

  // Handle a participant leaving a room.
  socket.on(
    "leave-room",
    async ({
      roomCode,
      participantId,
    }) => {

      try {

        // Leave the socket.io room channel.
        socket.leave(roomCode);

        // Remove the participant and evict the room if it becomes empty.
        await roomLifecycleService.leaveRoom(roomCode, participantId);

        // Clear the stored membership for this socket.
        socket.data.roomCode = null;
        socket.data.participantId = null;

        // Notify the other participants in the room.
        socket.to(roomCode).emit(
          "participant-left",
          participantId
        );

      } catch (error) {

        // Report the leave failure back to the client.
        socket.emit(
          "room-error",
          {
            message: error.message,
          }
        );

      }

    }
  );

  // Handle an abrupt disconnect by cleaning up room membership.
  socket.on(
    "disconnect",
    async () => {

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
        socket.to(roomCode).emit(
          "participant-left",
          participantId
        );

      } catch (error) {

        // Log disconnect cleanup failures without affecting other sockets.
        console.error("Disconnect cleanup failed:", error.message);

      }

    }
  );

}

export default registerRoomEvents;
