// Importing modules
import ActiveRoom from "./ActiveRoom.js";

class RoomLifecycleService {

    constructor({
        roomManager,
        roomDAO,
        persistenceService,
    }) {
        this.roomManager = roomManager;
        this.roomDAO = roomDAO;
        this.persistenceService = persistenceService;
    }

    async getOrCreateRoom(roomCode) {

        if (this.roomManager.has(roomCode)) {
            return this.roomManager.get(roomCode);
        }

        const roomData = await this.roomDAO.findRoomByCode(roomCode);

        if (!roomData) {
            throw new Error("Room not found.");
        }

        const room = new ActiveRoom({
            roomCode: roomData.roomCode,
            document: roomData.document,
        });

        this.roomManager.set(roomCode, room);

        return room;

    }

    async unloadRoom(roomCode) {

        const room = this.roomManager.get(roomCode);

        if (!room) {
            return;
        }

        // Persist the room through the persistence service before unloading it.
        await this.persistenceService.save(room);

        this.roomManager.remove(roomCode);

    }

}

export default RoomLifecycleService;