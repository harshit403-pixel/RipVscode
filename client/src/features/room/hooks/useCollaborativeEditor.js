"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { socket } from "@/lib/socket";
import { getRoom } from "../api/room.api";
import { setRoom, clearRoom } from "../state/roomSlice";

// Coordinates the realtime collaboration session for a room:
// loads the initial document, resolves this client's identity, and manages
// the Socket.IO connection lifecycle. Editing sync is wired in later commits.
export function useCollaborativeEditor(roomCode) {

  const dispatch = useDispatch();
  const router = useRouter();
  const authUser = useSelector((state) => state.auth.user);

  // Initial document for Monaco; null until it has been fetched.
  const [document, setDocument] = useState(null);

  // Connection status for diagnostics and future UI wiring.
  const [status, setStatus] = useState("connecting");

  // Refs that must stay current without re-running the connection effect.
  const editorRef = useRef(null);
  const monacoRef = useRef(null);
  const participantIdRef = useRef(null);
  const authUserRef = useRef(authUser);

  // Keep the latest authenticated user available to async callbacks.
  useEffect(() => {
    authUserRef.current = authUser;
  }, [authUser]);

  // Capture the Monaco instances when the editor mounts.
  const handleEditorMount = useCallback((editor, monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;
  }, []);

  // Load the room and open/clean up the realtime connection.
  useEffect(() => {
    if (!roomCode) return;

    let cancelled = false;

    // Announce presence to the room; re-runs automatically on reconnect.
    const handleConnect = () => {
      setStatus("connected");
      socket.emit("join-room", {
        roomCode,
        participantId: participantIdRef.current,
      });
    };

    // Track connection drops for status reporting.
    const handleDisconnect = () => {
      setStatus("disconnected");
    };

    // Fetch the initial document, then open the socket.
    const start = async () => {
      try {
        const res = await getRoom(roomCode);
        if (cancelled) return;

        const data = res.data.data;

        // Resolve this client's participant id by matching the authenticated user.
        const me = data.participants.find(
          (participant) => participant.userId === authUserRef.current?.id
        );
        participantIdRef.current = me ? me.id : null;

        // Store room state for the surrounding UI.
        dispatch(
          setRoom({
            roomDetails: data.room,
            participants: data.participants,
            currentParticipant: me || null,
          })
        );

        // Load the initial document into local state for Monaco.
        setDocument(data.room.document || "");
      } catch (error) {
        // A missing or inaccessible room returns the user to the landing page.
        console.error("Failed to load room:", error);
        if (!cancelled) router.push("/");
        return;
      }

      if (cancelled) return;

      // Register connection listeners and open the socket.
      socket.on("connect", handleConnect);
      socket.on("disconnect", handleDisconnect);

      if (socket.connected) {
        handleConnect();
      } else {
        socket.connect();
      }
    };

    start();

    // Leave the room and tear down the connection on unmount.
    return () => {
      cancelled = true;

      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);

      if (participantIdRef.current) {
        socket.emit("leave-room", {
          roomCode,
          participantId: participantIdRef.current,
        });
      }

      socket.disconnect();
      dispatch(clearRoom());
    };
  }, [roomCode, dispatch, router]);

  return {
    document,
    status,
    handleEditorMount,
  };
}

export default useCollaborativeEditor;
