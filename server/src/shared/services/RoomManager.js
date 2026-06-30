// Making the class to mantain the rooms and their data
class RoomManager {

    constructor() {

        // making a map to store the rooms and their data and doo operation in O(1)
        this.rooms = new Map();

    }

    has(roomCode) {

        // Check if the room exists in the map
        return this.rooms.has(roomCode);

    }

    get(roomCode) {

        // Get the room data from the map
        return this.rooms.get(roomCode);

    }

    set(roomCode, room) {

        // Set the room data in the map
        this.rooms.set(roomCode, room);

    }

    remove(roomCode) {

        // Remove the room data from the map
        this.rooms.delete(roomCode);

    }

    async loadRoom(roomCode) {

        if (this.has(roomCode))
            return this.get(roomCode);

        // Load from Mongo

        // Create ActiveRoom

        // Store inside Map

        // Return it

    }
    async unloadRoom(roomCode) { }

}

export default RoomManager;