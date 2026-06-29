// Importing modules
import Room from "../models/room.model.js";

// Class to communicate with rooms collection
class RoomRepository {
  constructor() {
    this.roomModel = Room;
  }

  // Create a new room
  async createRoom(roomData) {
    return this.roomModel.create(roomData);
  }

  // Find room by room code
  async findRoomByCode(roomCode) {
    return this.roomModel.findOne({
      roomCode,
      isActive: true,
    });
  }

  // Find room by id
  async findRoomById(roomId) {
    return this.roomModel.findById(roomId);
  }

  // Update room
  async updateRoom(filter, update) {
    return this.roomModel.findOneAndUpdate(
      filter,
      update,
      {
        new: true,
      }
    );
  }

  // Close room
  async closeRoom(roomId) {
    return this.roomModel.findByIdAndUpdate(
      roomId,
      {
        isActive: false,
      },
      {
        new: true,
      }
    );
  }
//   find room to join
  async findRoomByCode(roomCode) {
  return this.roomModel.findOne({
    roomCode,
    isActive: true,
  });
}
}

export default RoomRepository;