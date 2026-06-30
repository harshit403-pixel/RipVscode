import DocumentEngine from "./DocumentEngine.js";
import QueueManager from "./QueueManager.js";

class ActiveRoom {

    constructor({
        roomCode,
        document,
    }) {

        this.roomCode = roomCode;

        this.document = document;

        this.documentEngine = new DocumentEngine();

        this.queueManager = new QueueManager();

        this.version = 1;

        this.participants = new Map();

    }

}

export default ActiveRoom;