"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { socket } from "@/lib/socket";
import { getRoom } from "../api/room.api";
import { setRoom, clearRoom } from "../state/roomSlice";
import { createDeltaFromChange, deltaToMonacoOperation } from "../lib/delta";

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
  const participantRef = useRef(null);
  const authUserRef = useRef(authUser);

  // Current document version used as the base version for outgoing deltas.
  const versionRef = useRef(1);

  // Guards against re-emitting edits that came from applying a remote delta.
  const isApplyingRemoteRef = useRef(false);

  // Disposable for the Monaco change listener.
  const changeDisposableRef = useRef(null);

  // Keep the latest authenticated user available to async callbacks.
  useEffect(() => {
    authUserRef.current = authUser;
  }, [authUser]);

  // Capture the Monaco instances and start converting local edits into deltas.
  const handleEditorMount = useCallback((editor, monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;

    // Convert local Monaco edits into backend deltas and emit them.
    changeDisposableRef.current = editor.onDidChangeModelContent((event) => {

      // Ignore edits produced by applying a remote delta to avoid feedback loops.
      if (isApplyingRemoteRef.current) return;

      // Apply higher offsets first so earlier (lower) offsets stay valid.
      const orderedChanges = [...event.changes].sort(
        (a, b) => b.rangeOffset - a.rangeOffset
      );

      // Emit one delta per change, advancing the local version each time.
      for (const change of orderedChanges) {
        const delta = createDeltaFromChange(change, {
          version: versionRef.current,
          userId: authUserRef.current?.id,
        });
        if (!delta) continue;

        socket.emit("code-change", { roomCode, delta });
        versionRef.current += 1;
      }
    });
  }, [roomCode]);

  // Load the room and open/clean up the realtime connection.
  useEffect(() => {
    if (!roomCode) return;

    let cancelled = false;

    // Announce presence to the room; re-runs automatically on reconnect.
    const handleConnect = () => {
      setStatus("connected");
      if (participantRef.current) {
        socket.emit("join-room", {
          roomCode,
          participant: participantRef.current,
        });
      }
    };

    // Track connection drops for status reporting.
    const handleDisconnect = () => {
      setStatus("disconnected");
    };

    // Apply a remote edit to Monaco without re-emitting it.
    const handleRemoteChange = ({ delta, version }) => {
      const editor = editorRef.current;
      const model = editor?.getModel();
      if (!model) return;

      // Suppress the change listener while the remote edit is applied.
      isApplyingRemoteRef.current = true;
      try {
        const operation = deltaToMonacoOperation(delta, model);
        editor.executeEdits("remote", [operation]);
      } finally {
        isApplyingRemoteRef.current = false;
      }

      // Adopt the authoritative version that produced this edit.
      versionRef.current = version;
    };

    // Resynchronize the whole document when the server reports the client is stale.
    const handleSyncRequired = ({ version, document: latestDocument }) => {
      const editor = editorRef.current;
      const model = editor?.getModel();
      if (!model) return;

      // Replace the model content while suppressing the change listener.
      isApplyingRemoteRef.current = true;
      try {
        model.setValue(latestDocument);
      } finally {
        isApplyingRemoteRef.current = false;
      }

      // Reset to the authoritative version.
      versionRef.current = version;
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
        participantRef.current = me || null;

        // Initialize the base version from the persisted room version.
        versionRef.current = data.room.version ?? 1;

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

      // Register connection and collaboration listeners, then open the socket.
      socket.on("connect", handleConnect);
      socket.on("disconnect", handleDisconnect);
      socket.on("code-change", handleRemoteChange);
      socket.on("sync-required", handleSyncRequired);

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

      // Stop converting local edits into deltas.
      if (changeDisposableRef.current) {
        changeDisposableRef.current.dispose();
        changeDisposableRef.current = null;
      }

      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("code-change", handleRemoteChange);
      socket.off("sync-required", handleSyncRequired);

      if (participantRef.current) {
        socket.emit("leave-room", {
          roomCode,
          participantId: participantRef.current.id,
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
