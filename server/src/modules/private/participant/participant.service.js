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
    await this.participantRepository.findParticipant({
      _id: participantId,
    });

  if (!participant) {
    throw new NotFound(
      "Participant not found"
    );
  }

  const updateData = {};

if (data.isOnline !== undefined) {
  updateData.isOnline =
    data.isOnline;
}

if (data.socketId !== undefined) {
  updateData.socketId =
    data.socketId;
}

  return this.participantRepository.updateParticipant(
    {
      _id: participantId,
    },
    updateData
  );
}
}

export default ParticipantService;