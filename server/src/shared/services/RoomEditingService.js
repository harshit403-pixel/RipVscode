// RoomEditingService
// Responsible for processing document edits for an active room.
// Delegates document mutation to DocumentEngine and conflict resolution to ConflictResolver.
// Does NOT handle sockets or database persistence.

// Maximum number of applied deltas retained per room for conflict resolution.
const MAX_HISTORY = 1000;

class RoomEditingService {

    process(activeRoom, delta) {

        // Validate required inputs.
        if (!activeRoom) {
            throw new Error("ActiveRoom is required.");
        }

        if (!delta) {
            throw new Error("Delta is required.");
        }

        // Validate the delta carries a numeric base version.
        if (typeof delta.version !== "number") {
            throw new Error("Delta version is required.");
        }

        // Reject deltas whose base version is ahead of the document.
        if (delta.version > activeRoom.version) {
            const staleError = new Error("Stale delta: document version mismatch.");
            staleError.code = "STALE_DELTA";
            staleError.currentVersion = activeRoom.version;
            staleError.currentDocument = activeRoom.document;
            throw staleError;
        }

        // Get room utilities.
        const { queueManager, documentEngine, conflictResolver } = activeRoom;

        // Transform concurrent deltas against the edits applied since their base version.
        let effectiveDelta = delta;

        if (delta.version < activeRoom.version) {

            // Determine the oldest base version still covered by the retained history.
            const oldestRetained = activeRoom.history.length > 0
                ? activeRoom.history[0].version
                : activeRoom.version;

            // Reject deltas older than the history window; the client must resync.
            if (delta.version < oldestRetained) {
                const staleError = new Error("Stale delta: outside conflict-resolution window.");
                staleError.code = "STALE_DELTA";
                staleError.currentVersion = activeRoom.version;
                staleError.currentDocument = activeRoom.document;
                throw staleError;
            }

            // Collect every delta applied at or after the incoming base version.
            const concurrentDeltas = activeRoom.history
                .filter((entry) => entry.version >= delta.version)
                .map((entry) => entry.delta);

            // Transform the incoming delta so it applies on the current document.
            effectiveDelta = conflictResolver.resolve(delta, concurrentDeltas);

        }

        // Add the effective edit to the processing queue.
        queueManager.enqueue(effectiveDelta);

        // Process all pending edits in FIFO order.
        while (!queueManager.isEmpty()) {

            // Get the next queued edit.
            const pendingDelta = queueManager.dequeue();

            // Capture the version this edit is applied at for future transforms.
            const appliedAtVersion = activeRoom.version;

            // Apply the edit to the current document.
            activeRoom.document = documentEngine.applyDelta(
                activeRoom.document,
                pendingDelta
            );

            // Record the applied edit in history for conflict resolution.
            activeRoom.history.push({
                version: appliedAtVersion,
                delta: pendingDelta,
            });

            // Increment the document version after every successful edit.
            activeRoom.version++;

        }

        // Bound the history to cap per-room memory usage.
        if (activeRoom.history.length > MAX_HISTORY) {
            activeRoom.history.splice(0, activeRoom.history.length - MAX_HISTORY);
        }

        // Mark the room as dirty so a later persistence cycle will save it.
        activeRoom.isDirty = true;

        // Record the time of the latest in-memory modification.
        activeRoom.lastModifiedAt = Date.now();

        // Return the applied edit and the updated room state.
        return {
            room: activeRoom,
            delta: effectiveDelta,
            version: activeRoom.version,
        };

    }

}

export default RoomEditingService;