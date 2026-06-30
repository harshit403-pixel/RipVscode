import { Server } from "socket.io";
import registerRoomEvents from "./sockets/room.socket.js";
import registerCodeEvents from "./sockets/code.socket.js";
import env from "./shared/config/env.config.js";
import RoomManager from "./shared/services/RoomManager.js";
import RoomDAO from "./shared/dao/room.dao.js";
import RoomLifecycleService from "./shared/services/RoomLifecycleService.js";
import RoomEditingService from "./shared/services/RoomEditingService.js";
import PersistenceService from "./shared/services/PersistenceService.js";
import AutosaveScheduler from "./shared/services/AutosaveScheduler.js";

function initializeSocket(server) {

  // Initialize the room manager and services.
  const roomManager = new RoomManager();

  // Initialize a single shared room dao instance to avoid duplicate connections to the data layer.
  const roomDAO = new RoomDAO();

  // Initialize the persistence service with the shared room dao.
  const persistenceService = new PersistenceService({
    roomDAO,
  });

  // Initialize the room lifecycle service with the room manager, shared dao and persistence service.
  const roomLifecycleService = new RoomLifecycleService({
    roomManager,
    roomDAO,
    persistenceService,
  });


  // Initialize the room editing service.
  const roomEditingService = new RoomEditingService();


  // Initialize the autosave scheduler with the shared room manager and persistence service.
  const autosaveScheduler = new AutosaveScheduler({
    roomManager,
    persistenceService,
    intervalMs: env.AUTOSAVE_INTERVAL_MS,
  });

  // Start the periodic autosave loop so dirty rooms are persisted off the edit path.
  autosaveScheduler.start();


  // Initialize the Socket.IO server with CORS configuration.
  const io = new Server(server, {
    cors: {
      origin: env.FRONTEND_URL,
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


  // Return the socket server and autosave scheduler for lifecycle control.
  return {
    io,
    autosaveScheduler,
  };
}

export default initializeSocket;
