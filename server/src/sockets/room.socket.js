function registerRoomEvents(
  io,
  socket
) {
  socket.on(
    "join-room",
    ({
      roomCode,
      participant,
    }) => {
      socket.join(roomCode);

      socket.to(roomCode).emit(
        "participant-joined",
        participant
      );
    }
  );

  socket.on(
    "leave-room",
    ({
      roomCode,
      participantId,
    }) => {
      socket.leave(roomCode);

      socket.to(roomCode).emit(
        "participant-left",
        participantId
      );
    }
  );
}

export default registerRoomEvents;