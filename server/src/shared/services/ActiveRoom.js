import DocumentEngine from "./DocumentEngine.js";
import QueueManager from "./QueueManager.js";
import ConflictResolver from "./ConflictResolver.js";
import PieceTree from "./PieceTree.js";

class ActiveRoom {

    constructor({
        roomCode,
        document,
        version = 1,
    }) {

        this.roomCode = roomCode;

        // Build the authoritative piece tree from the initial document.
        this.document = document;

        this.documentEngine = new DocumentEngine();

        this.queueManager = new QueueManager();

        this.conflictResolver = new ConflictResolver();

        // Restore the persisted version, defaulting to 1 for new rooms.
        this.version = version;

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

    // Materialize the document as a string from the piece tree.
    get document() {
        return this.documentTree.toString();
    }

    // Rebuild the authoritative piece tree from a string.
    set document(value) {
        this.documentTree = new PieceTree(value || "");
    }

}

export default ActiveRoom;