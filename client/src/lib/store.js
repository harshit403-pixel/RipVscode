import { configureStore } from "@reduxjs/toolkit";
import roomReducer from "@/features/room/state/roomSlice";
import authReducer from "@/features/auth/state/authSlice";

const store = configureStore({
  reducer: {
    room: roomReducer,
    auth: authReducer,
  },
});

export default store;
 