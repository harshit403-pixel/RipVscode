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

    async joinRoom(roomCode, participantId) {

        // Load or create the active room for this participant.
        const room = await this.getOrCreateRoom(roomCode);

        // Track the participant inside the active room.
        room.participants.set(participantId, true);

        // Return the active room.
        return room;

    }

    async leaveRoom(roomCode, participantId) {

        // Look up the active room; nothing to do if it is not loaded.
        const room = this.roomManager.get(roomCode);

        if (!room) {
            return;
        }

        // Remove the participant from the active room.
        room.participants.delete(participantId);

        // Evict the room once the last participant has left.
        if (room.participants.size === 0) {
            await this.unloadRoom(roomCode);
        }

    }

    async unloadRoom(roomCode) {

        const room = this.roomManager.get(roomCode);

        if (!room) {
            return;
        }

        // Flush the room only when it has unsaved edits before unloading it.
        await this.persistenceService.saveIfDirty(room);

        // Remove the room from the manager to free its memory.
        this.roomManager.remove(roomCode);

    }

}

export default RoomLifecycleService;