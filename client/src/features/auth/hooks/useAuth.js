"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { login, signup } from "../api/auth.api";
import { setUser } from "../state/authSlice";

export function useAuth(mode = "login") {
  const router = useRouter();
  const dispatch = useDispatch();

  const [form, setForm] = useState(() => {
    if (mode === "signup") {
      return { username: "", email: "", password: "" };
    }
    return { email: "", password: "" };
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (error) setError("");
  };

  const validate = () => {
    if (mode === "signup") {
      if (!form.username.trim()) {
        setError("Username is required");
        return false;
      }
      if (!form.email.trim()) {
        setError("Email is required");
        return false;
      }
      if (!form.password.trim()) {
        setError("Password is required");
        return false;
      }
      if (form.password.length < 6) {
        setError("Password should be at least 6 characters");
        return false;
      }
    } else {
      if (!form.email.trim()) {
        setError("Email is required");
        return false;
      }
      if (!form.password.trim()) {
        setError("Password is required");
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!validate()) return;

    try {
      setLoading(true);

      const apiFn = mode === "signup" ? signup : login;
      const res = await apiFn(form);

      dispatch(setUser(res.data.data));

      router.push("/create-room");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return {
    form,
    loading,
    error,
    updateField,
    handleSubmit,
  };
}

export default useAuth;
