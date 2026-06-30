import NotFound from "../../../shared/errors/notfound.error.js";
import ParticipantRepository from "../../../shared/dao/participant.dao.js";

import {
  sanitizeParticipant,
} from "../../../shared/utils/sanitizer.util.js";

class ParticipantService {
  constructor() {
    this.participantRepository =
      new ParticipantRepository();
  }

  async updateParticipantService(
    participantId,
    data
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

    const updateData = {};

    if (
      data.isOnline !== undefined
    ) {
      updateData.isOnline =
        data.isOnline;
    }

    if (
      data.socketId !== undefined
    ) {
      updateData.socketId =
        data.socketId;
    }

    // Nothing to update
    if (
      Object.keys(updateData)
        .length === 0
    ) {
      return sanitizeParticipant(
        participant
      );
    }

    const updatedParticipant =
      await this.participantRepository.updateParticipant(
        {
          _id: participantId,
        },
        updateData
      );

    return sanitizeParticipant(
      updatedParticipant
    );
  }
}

export default ParticipantService;