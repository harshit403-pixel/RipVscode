"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  finishAuthLoading,
  setUser,
} from "../state/authSlice";
import {
  getMe,
  refresh,
} from "../api/auth.api";

export default function useAuthBootstrap() {
  const dispatch = useDispatch();

  useEffect(() => {
    const init = async () => {
      try {
        await refresh();

        const res = await getMe();

        dispatch(setUser(res.data.data));
      } catch (err) {
        dispatch(finishAuthLoading());
      }
    };

    init();
  }, [dispatch]);
}