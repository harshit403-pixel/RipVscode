function registerCodeEvents(
  io,
  socket
) {
  socket.on(
    "code-change",
    ({
      roomCode,
      code,
    }) => {
      socket
        .to(roomCode)
        .emit(
          "receive-code",
          code
        );
    }
  );
}

export default registerCodeEvents;