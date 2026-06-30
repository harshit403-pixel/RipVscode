// Function to sanitize user
export const sanitizeUser = (
  { _id, username, email },
  accessToken
) => {
  return {
    id: _id,
    username,
    email,
    accessToken,
  };
};

// Function to sanitize room
export const sanitizeRoom = (
  room
) => {
  return {
    id: room._id,
    roomName: room.roomName,
    roomCode: room.roomCode,
    hostId: room.hostId,
    document: room.document,
    version: room.version,
    isActive: room.isActive,
    createdAt: room.createdAt,
    updatedAt: room.updatedAt,
  };
};

// Function to sanitize participant
export const sanitizeParticipant = (
  participant
) => {
  return {
    id: participant._id,
    roomId: participant.roomId,
    userId:
      participant.userId || null,
    displayName:
      participant.displayName,
    role: participant.role,
    isOnline:
      participant.isOnline,
    socketId:
      participant.socketId,
    createdAt:
      participant.createdAt,
    updatedAt:
      participant.updatedAt,
  };
};

// Function to sanitize participant list
export const sanitizeParticipants =
  (participants) => {
    return participants.map(
      (participant) =>
        sanitizeParticipant(
          participant
        )
    );
  };