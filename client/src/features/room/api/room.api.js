import axiosInstance from "@/lib/axios";

const unwrap = (response) => response.data?.data ?? response.data;

export const createRoom = async (roomData) => {
  // roomData should be: { roomName }
  const response = await axiosInstance.post("/rooms", roomData);
  return unwrap(response);
};

export const joinRoom = async (joinData) => {
  // joinData should be: { roomCode, displayName }
  const response = await axiosInstance.post("/rooms/join", joinData);
  return unwrap(response);
};

export const getRoomByCode = async (roomCode) => {
  const response = await axiosInstance.get(`/rooms/${roomCode}`);
  return unwrap(response);
};

export const leaveRoom = async (leaveData) => {
  // leaveData should be: { participantId }
  const response = await axiosInstance.post("/rooms/leave", leaveData);
  return unwrap(response);
};

export const closeRoom = async (roomCode) => {
  const response = await axiosInstance.delete(`/rooms/${roomCode}`);
  return unwrap(response);
};

export const getParticipants = async (roomCode) => {
  const response = await axiosInstance.get(`/rooms/${roomCode}/participants`);
  return unwrap(response);
};
