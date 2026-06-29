import NotFound from "../../../shared/errors/notfound.error.js";
import ParticipantRepository from "../../../shared/repositories/participant.repository.js";

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

    return this.participantRepository.updateParticipant(
      {
        _id: participantId,
      },
      data
    );
  }
}

export default ParticipantService;