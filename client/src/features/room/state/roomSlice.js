import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  roomDetails: null, // { id, roomCode, roomName, hostId }
  participants: [], // [ { id, displayName, role, isOnline, socketId } ]
  currentParticipant: null, // Your own participant: { id, displayName, role }
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
    clearRoom: () => initialState,

    // Handles live socket join updates
    addParticipant: (state, action) => {
      const payload = action.payload;
      const pid = payload._id || payload.id;
      const exists = state.participants.find((p) => (p._id || p.id) === pid);
      if (exists) {
        exists.isOnline = true;
        exists.socketId = payload.socketId;
      } else {
        state.participants.push(payload);
      }
    },

    // Handles live socket leave/disconnect updates
    removeParticipant: (state, action) => {
      const pid = action.payload;
      state.participants = state.participants.filter(
        (p) => (p._id || p.id) !== pid
      );
    },

    // Sets this client's own participant (e.g. after joining as a guest)
    setCurrentParticipant: (state, action) => {
      const participant = action.payload;
      state.currentParticipant = participant;
      const pid = participant._id || participant.id;
      const exists = state.participants.find(
        (p) => (p._id || p.id) === pid
      );
      if (!exists) {
        state.participants.push(participant);
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
  setCurrentParticipant,
  setTypingStatus,
} = roomSlice.actions;

export default roomSlice.reducer;
