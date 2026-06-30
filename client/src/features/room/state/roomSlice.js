import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  roomDetails: null, // { _id, roomCode, roomName, hostId }
  participants: [], // [ { _id, displayName, role, isOnline, socketId } ]
  currentParticipant: null, // Your own participant details: { _id, displayName, role }
  typingUsers: {}, // { [participantId]: boolean }
  loading: false,
  error: null,
};

const roomSlice = createSlice({
  name: "room",
  initialState,
  reducers: {
    setRoom: (state, action) => {
      state.roomDetails = action.payload.roomDetails;
      state.participants = action.payload.participants;
      state.currentParticipant = action.payload.currentParticipant;
    },
    clearRoom: (state) => {
      return initialState;
    },
    // Handles live socket join updates
    addParticipant: (state, action) => {
      const exists = state.participants.find(
        (p) => p._id === action.payload._id,
      );
      if (exists) {
        exists.isOnline = true;
        exists.socketId = action.payload.socketId;
      } else {
        state.participants.push(action.payload);
      }
    },
    // Handles live socket leave/disconnect updates
    removeParticipant: (state, action) => {
      const participant = state.participants.find(
        (p) => p._id === action.payload,
      );
      if (participant) {
        participant.isOnline = false;
        participant.socketId = null;
      }
    },
    // Updates typing indicators
    setTypingStatus: (state, action) => {
      const { participantId, isTyping } = action.payload;
      if (isTyping) {
        state.typingUsers[participantId] = true;
      } else {
        delete state.typingUsers[participantId];
      }
    },
  },
});

export const {
  setRoom,
  clearRoom,
  addParticipant,
  removeParticipant,
  setTypingStatus,
} = roomSlice.actions;

export default roomSlice.reducer;
