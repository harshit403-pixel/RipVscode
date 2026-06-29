import ApiResponse from "../../../shared/utils/ApiResponse.utils.js";
import ParticipantService from "./participant.service.js";

class ParticipantController {
  constructor() {
    this.participantService =
      new ParticipantService();
  }

  updateParticipantController =
    async (req, res) => {
      const {
        participantId,
      } = req.params;

      const participant =
        await this.participantService.updateParticipantService(
          participantId,
          req.body
        );

      return ApiResponse(
        res,
        200,
        "Participant updated successfully",
        participant
      );
    };
}

export default ParticipantController;