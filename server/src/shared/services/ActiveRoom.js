import DocumentEngine from "./DocumentEngine.js";
import QueueManager from "./QueueManager.js";
import ConflictResolver from "./ConflictResolver.js";

class ActiveRoom {

    constructor({
        roomCode,
        document,
    }) {

        this.roomCode = roomCode;

        this.document = document;

        this.documentEngine = new DocumentEngine();

        this.queueManager = new QueueManager();

        this.conflictResolver = new ConflictResolver();

        this.version = 1;

        this.participants = new Map();

        // Ordered log of applied deltas used to transform concurrent edits.
        this.history = [];

        // Dirty tracking flag: true when the room has in-memory edits not yet persisted.
        this.isDirty = false;

        // Timestamp of the last applied edit (null until the first edit).
        this.lastModifiedAt = null;

        // Timestamp of the last successful persistence (null until first save).
        this.lastSavedAt = null;

    }

}

export default ActiveRoom;