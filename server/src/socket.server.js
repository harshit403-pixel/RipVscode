import { Server } from "socket.io";
import registerRoomEvents from "./sockets/room.socket.js";
import registerCodeEvents from "./sockets/code.socket.js";
import env from "./shared/config/env.config.js";

function initializeSocket(server) {
  const io = new Server(server, {
    cors: {
      origin:
        env.FRONTEND_URL,
      credentials: true,
    },
  });

  io.on(
    "connection",
    (socket) => {
      console.log(
        "User connected:",
        socket.id
      );

      registerRoomEvents(
        io,
        socket
      );

      registerCodeEvents(
        io,
        socket
      );

      socket.on(
        "disconnect",
        () => {
          console.log(
            "Disconnected:",
            socket.id
          );
        }
      );
    }
  );

  return io;
}

export default initializeSocket;