// Service responsible for persisting active room state into MongoDB.
// Knows HOW to save a room; it never decides WHEN to save (no autosave timers here).
class PersistenceService {

    constructor({

        // Injecting the room dao used for all database operations.
        roomDAO,

    }) {

        // Storing the room dao for database persistence.
        this.roomDAO = roomDAO;

    }

    // Persist a single active room's document into the database.
    async save(activeRoom) {

        // Validate the active room input.
        if (!activeRoom) {
            throw new Error("ActiveRoom is required.");
        }

        // Persist the latest in-memory document and version for this room.
        await this.roomDAO.updateRoom(
            {
                roomCode: activeRoom.roomCode,
            },
            {
                document: activeRoom.document,
                version: activeRoom.version,
            }
        );

        // Mark the room as clean now that it is safely persisted.
        activeRoom.isDirty = false;

        // Record the time of this successful persistence.
        activeRoom.lastSavedAt = Date.now();

        // Return the persisted active room.
        return activeRoom;

    }

    // Persist a room only when it has unsaved in-memory edits.
    async saveIfDirty(activeRoom) {

        // Validate the active room input.
        if (!activeRoom) {
            throw new Error("ActiveRoom is required.");
        }

        // Skip persistence when there is nothing new to save.
        if (!activeRoom.isDirty) {
            return null;
        }

        // Delegate the actual persistence to save().
        return this.save(activeRoom);

    }

    // Persist every dirty room from an iterable of active rooms (used by autosave).
    async saveDirtyRooms(activeRooms) {

        // Validate the rooms collection input.
        if (!activeRooms) {
            throw new Error("Active rooms collection is required.");
        }

        // Track how many rooms were actually persisted.
        let savedCount = 0;

        // Iterate over each active room and persist only the dirty ones.
        for (const activeRoom of activeRooms) {

            // Skip rooms that have no unsaved edits.
            if (!activeRoom.isDirty) {
                continue;
            }

            // Persist the dirty room and count it.
            await this.save(activeRoom);
            savedCount++;

        }

        // Return the number of rooms persisted.
        return savedCount;

    }

}

export default PersistenceService;
