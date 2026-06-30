"use client";

import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function GuestRoute({ children }) {
  const router = useRouter();
  const { isAuthenticated, authLoading } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      router.push("/create-room");
    }
  }, [authLoading, isAuthenticated, router]);

  // Show nothing while auth state is being determined.
  if (authLoading) return null;

  // Don't render children if already authenticated (avoids flash of login/signup).
  if (isAuthenticated) return null;

  return children;
}
