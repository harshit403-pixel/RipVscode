import ApiResponse from "../../../shared/utils/ApiResponse.utils.js";
import RoomService from "./room.service.js";

class RoomController {
  constructor() {
    this.roomService =
      new RoomService();
  }

  createRoomController =
    async (req, res) => {
      const userId =
        req.user.id;

      const username =
        req.user.username;

      const { roomName } =
        req.body;

      const room =
        await this.roomService.createRoomService(
          userId,
          username,
          roomName
        );

      return ApiResponse(
        res,
        201,
        "Room created successfully",
        room
      );
    };

    joinRoomController =
  async (req, res) => {
    const {
      roomCode,
      displayName,
    } = req.body;

    const response =
      await this.roomService.joinRoomService(
        roomCode,
        displayName
      );

    return ApiResponse(
      res,
      200,
      "Joined room successfully",
      response
    );
  };

  getRoomController =
  async (req, res) => {
    const { roomCode } =
      req.params;

    const response =
      await this.roomService.getRoomService(
        roomCode
      );

    return ApiResponse(
      res,
      200,
      "Room fetched successfully",
      response
    );
  };

  leaveRoomController =
  async (req, res) => {
    const { participantId } =
      req.body;

    await this.roomService.leaveRoomService(
      participantId
    );

    return ApiResponse(
      res,
      200,
      "Left room successfully"
    );
  };


  closeRoomController =
  async (req, res) => {
    const { roomCode } =
      req.params;

    const userId =
      req.user.id;

    await this.roomService.closeRoomService(
      roomCode,
      userId
    );

    return ApiResponse(
      res,
      200,
      "Room closed successfully"
    );
  };
}

export default RoomController;