import RoomRepository from "../../../shared/dao/room.dao.js";
import ParticipantRepository from "../../../shared/dao/participant.dao.js";

import NotFound from "../../../shared/errors/notfound.error.js";
import Unauthorized from "../../../shared/errors/unauthorize.error.js";

import generateRoomCode from "../../../shared/utils/roomCode.util.js";

import {
  sanitizeRoom,
  sanitizeParticipant,
  sanitizeParticipants,
} from "../../../shared/utils/sanitizer.util.js";

class RoomService {
  constructor() {
    this.roomRepository =
      new RoomRepository();

    this.participantRepository =
      new ParticipantRepository();
  }

  async getRoomByCode(
    roomCode
  ) {
    const room =
      await this.roomRepository.findRoomByCode(
        roomCode
      );

    if (!room) {
      throw new NotFound(
        "Room not found"
      );
    }

    return room;
  }

  async createRoomService(
    userId,
    username,
    roomName
  ) {
    let roomCode;

    do {
      roomCode =
        generateRoomCode();
    } while (
      await this.roomRepository.findRoomByCode(
        roomCode
      )
    );

    const room =
      await this.roomRepository.createRoom(
        {
          roomName,
          roomCode,
          hostId: userId,
        }
      );

    await this.participantRepository.createParticipant(
      {
        roomId: room._id,
        userId,
        displayName:
          username,
        role: "HOST",
      }
    );

    return sanitizeRoom(room);
  }

  async joinRoomService(
    roomCode,
    displayName
  ) {
    const room =
      await this.getRoomByCode(
        roomCode
      );

    const participant =
      await this.participantRepository.createParticipant(
        {
          roomId: room._id,
          displayName,
          role: "GUEST",
        }
      );

    return {
      room:
        sanitizeRoom(room),
      participant:
        sanitizeParticipant(
          participant
        ),
    };
  }

  async getRoomService(
    roomCode
  ) {
    const room =
      await this.getRoomByCode(
        roomCode
      );

    const participants =
      await this.participantRepository.findParticipants(
        room._id
      );

    return {
      room:
        sanitizeRoom(room),
      participants:
        sanitizeParticipants(
          participants
        ),
    };
  }

  async getParticipantsService(
    roomCode
  ) {
    const room =
      await this.getRoomByCode(
        roomCode
      );

    const participants =
      await this.participantRepository.findParticipants(
        room._id
      );

    return sanitizeParticipants(
      participants
    );
  }

  async leaveRoomService(
    participantId
  ) {
    const participant =
      await this.participantRepository.findParticipant(
        {
          _id: participantId,
        }
      );

    if (!participant) {
      throw new NotFound(
        "Participant not found"
      );
    }

    await this.participantRepository.updateParticipant(
      {
        _id: participantId,
      },
      {
        isOnline: false,
        socketId: null,
      }
    );
  }

  async closeRoomService(
    roomCode,
    userId
  ) {
    const room =
      await this.getRoomByCode(
        roomCode
      );

    if (
      room.hostId.toString() !==
      userId
    ) {
      throw new Unauthorized(
        "Only host can close room"
      );
    }

    await this.roomRepository.closeRoom(
      room._id
    );

    await this.participantRepository.deleteParticipants(
      room._id
    );
  }
}

export default RoomService;