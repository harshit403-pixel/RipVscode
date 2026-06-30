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

        // Return the in-memory room when it is already loaded.
        if (this.roomManager.has(roomCode)) {
            return this.roomManager.get(roomCode);
        }

        // Recover the room from persistent storage on a cache miss.
        return this.recoverRoom(roomCode);

    }

    async recoverRoom(roomCode) {

        // Load the persisted room from the database.
        const roomData = await this.roomDAO.findRoomByCode(roomCode);

        // Fail when the room does not exist in storage.
        if (!roomData) {
            throw new Error("Room not found.");
        }

        // Restore the active room with its persisted document and version.
        const room = new ActiveRoom({
            roomCode: roomData.roomCode,
            document: roomData.document,
            version: roomData.version,
        });

        // Cache the recovered room in memory.
        this.roomManager.set(roomCode, room);

        // Return the recovered room.
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