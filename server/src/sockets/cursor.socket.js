const registerCursorEvents = (io, socket) => {
  // 1. Listen for remote cursor movements
  socket.on("cursor-move", ({ roomCode, offset }) => {
    // Broadcast the cursor offset to everyone else in the room
    socket.to(roomCode).emit("remote-cursor", {
      userId: socket.id,
      offset,
    });
  });

  // 2. Listen for disconnection to clean up remote cursors
  socket.on("disconnecting", () => {
    socket.rooms.forEach((roomCode) => {
      if (roomCode !== socket.id) {
        socket.to(roomCode).emit("cursor-disconnect", {
          userId: socket.id,
        });
      }
    });
  });
};
export default registerCursorEvents;
