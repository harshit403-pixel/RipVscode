// Importing modules
import ActiveRoom from "./ActiveRoom.js";

class RoomLifecycleService {

    constructor({
        roomManager,
        roomDAO,
    }) {
        this.roomManager = roomManager;
        this.roomDAO = roomDAO;
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

        await this.roomDAO.updateRoom(roomCode, {
            document: room.document,
        });

        this.roomManager.remove(roomCode);

    }

}

export default RoomLifecycleService;