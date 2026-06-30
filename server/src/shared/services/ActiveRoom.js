class ActiveRoom {

    constructor({
        roomCode,
        document,
    }) {

        this.roomCode = roomCode;

        this.documentEngine =
            new DocumentEngine(document);

        this.queueManager =
            new QueueManager();

        this.version = 1;

        this.participants =
            new Map();

    }

}

export default ActiveRoom;