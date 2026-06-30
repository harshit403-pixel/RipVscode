// RoomEditingService
// Responsible for processing document edits for an active room.
// Does NOT handle sockets, database persistence, or conflict resolution.

class RoomEditingService {

    process(activeRoom, delta) {

        // Validate required inputs.
        if (!activeRoom) {
            throw new Error("ActiveRoom is required.");
        }

        if (!delta) {
            throw new Error("Delta is required.");
        }

        // Get room utilities.
        const { queueManager, documentEngine } = activeRoom;

        // Add the incoming edit to the processing queue.
        queueManager.enqueue(delta);

        // Process all pending edits in FIFO order.
        while (!queueManager.isEmpty()) {

            // Get the next queued edit.
            const pendingDelta = queueManager.dequeue();

            // Apply the edit to the current document.
            activeRoom.document = documentEngine.applyDelta(
                activeRoom.document,
                pendingDelta
            );

            // Increment the document version after every successful edit.
            activeRoom.version++;

        }

        // Return the updated room state.
        return activeRoom;

    }

}

export default RoomEditingService;