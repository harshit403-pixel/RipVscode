import axiosInstance from "@/lib/axios";

export const createRoom = (data) =>
  axiosInstance.post("/rooms", data);

export const joinRoom = (data) =>
  axiosInstance.post(
    "/rooms/join",
    data
  );

export const getRoom = (roomCode) =>
  axiosInstance.get(
    `/rooms/${roomCode}`
  );

export const leaveRoom = (
  participantId
) =>
  axiosInstance.post(
    "/rooms/leave",
    {
      participantId,
    }
  );