// Importing modules
import Participant from "../models/participant.model.js";

// Class to communicate with participants collection
class ParticipantRepository {
  constructor() {
    this.participantModel =
      Participant;
  }

  // Create participant
  async createParticipant(
    participantData
  ) {
    return this.participantModel.create(
      participantData
    );
  }

  // Find participant
  async findParticipant(filter) {
    return this.participantModel.findOne(
      filter
    );
  }

  // Find all participants in room
  async findParticipants(
  roomId,
  onlineOnly = false
) {
  const filter = { roomId };

  if (onlineOnly) {
    filter.isOnline = true;
  }

  return this.participantModel.find(
    filter
  );
}

  // Update participant
  async updateParticipant(
    filter,
    update
  ) {
    return this.participantModel.findOneAndUpdate(
      filter,
      update,
      {
        new: true,
      }
    );
  }

  // Delete participant
  async deleteParticipant(filter) {
    return this.participantModel.deleteOne(
      filter
    );
  }

  // Delete all participants of a room
  async deleteParticipants(roomId) {
    return this.participantModel.deleteMany(
      {
        roomId,
      }
    );
  }

  // Find participant by room and user
async findParticipantByRoomAndUser(
  roomId,
  userId
) {
  return this.participantModel.findOne({
    roomId,
    userId,
  });
}

// Find participant by room and name
async findParticipantByRoomAndName(
  roomId,
  displayName
) {
  return this.participantModel.findOne({
    roomId,
    displayName,
  });
}
}

export default ParticipantRepository;