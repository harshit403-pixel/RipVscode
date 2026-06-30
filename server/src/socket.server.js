import { Server } from "socket.io";
import registerRoomEvents from "./sockets/room.socket.js";
import registerCodeEvents from "./sockets/code.socket.js";
import env from "./shared/config/env.config.js";
import RoomManager from "./shared/managers/RoomManager.js";
import RoomDAO from "./shared/dao/room.dao.js";
import RoomLifecycleService from "./shared/services/RoomLifecycleService.js";
import RoomEditingService from "./shared/services/RoomEditingService.js";

function initializeSocket(server) {

  // Initialize the room manager and services.
  const roomManager = new RoomManager();

  // Initialize the room lifecycle service with the room manager and repository.
  const roomLifecycleService = new RoomLifecycleService({
    roomManager,
    roomDAO: new RoomDAO(),
  });


  // Initialize the room editing service.
  const roomEditingService = new RoomEditingService();


  // Initialize the Socket.IO server with CORS configuration.
  const io = new Server(server, {
    cors: {
      origin:
        env.FRONTEND_URL,
      credentials: true,
    },
  });


  // Register event handlers for room and code events when a client connects.
  io.on("connection", (socket) => {

    // Log new client connection.
    console.log("Connected:", socket.id);


    // Register room-related events (join-room, leave-room).
    registerRoomEvents(io, socket, {
      roomLifecycleService,
    });


    // Register code-related events (code-change).
    registerCodeEvents(io, socket, {
      roomLifecycleService,
      roomEditingService,
    });

    // Handle client disconnection.
    socket.on("disconnect", () => {
      console.log("Disconnected:", socket.id);
    });

  });


  return io;
}

export default initializeSocket;