"use client";

import { useMemo, useState } from "react";
import styles from "../css/RoomPage.module.css";
import CodeEditorPanel from "./CodeEditorPanel";
import ClosedRoom from "./ClosedRoom";
import ParticipantsList from "./ParticipantsList";
import RoomHeader from "./RoomHeader";

const PARTICIPANTS = [
  {
    id: "p1",
    name: "Priya Nair",
    role: "HOST",
    color: "#ff6b6b",
    online: true,
  },
  {
    id: "p2",
    name: "Arjun Mehta",
    role: "GUEST",
    color: "#f6b44b",
    online: true,
  },
  {
    id: "p3",
    name: "Sofia Reyes",
    role: "GUEST",
    color: "#31d093",
    online: true,
  },
  { id: "p4", name: "Liu Wen", role: "GUEST", color: "#8fa7ff", online: true },
  {
    id: "p5",
    name: "Dev Kapoor",
    role: "GUEST",
    color: "#8e98a8",
    online: false,
  },
];

const CODE_LINES = [
  "function generateRoomCode(length = 6) {",
  '  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";',
  '  let code = "";',
  "",
  "  for (let i = 0; i < length; i++) {",
  "    code += chars[Math.floor(Math.random() * chars.length)];",
  "  }",
  "",
  "  return code;",
  "}",
  "",
  "function createRoom(hostId, roomName) {",
  "  return {",
  "    roomCode: generateRoomCode(),",
  "    roomName,",
  "    hostId,",
  '    document: "",',
  "    isActive: true,",
  "  };",
  "}",
];

const CURRENT_USER_ID = "p1";
const ROOM_CODE = "K7P2QX";

export default function RoomPage() {
  const [roomName, setRoomName] = useState("Two-Pointer Practice");
  const [draftName, setDraftName] = useState(roomName);
  const [isEditing, setIsEditing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [roomClosed, setRoomClosed] = useState(false);
  const [typingId] = useState("p2");

  const currentUser = PARTICIPANTS.find(
    (participant) => participant.id === CURRENT_USER_ID,
  );
  const isHost = currentUser?.role === "HOST";
  const typingParticipant = useMemo(
    () =>
      PARTICIPANTS.find((participant) => participant.id === typingId) || null,
    [typingId],
  );

  const copyRoomCode = async () => {
    try {
      await navigator.clipboard.writeText(ROOM_CODE);
    } catch {
      // The UI still gives feedback if clipboard access is unavailable.
    }

    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  };

  const commitRoomName = () => {
    const cleanName = draftName.trim();
    setRoomName(cleanName || roomName);
    setDraftName(cleanName || roomName);
    setIsEditing(false);
  };

  const cancelRoomName = () => {
    setDraftName(roomName);
    setIsEditing(false);
  };

  return (
    <main className={styles.page}>
      <RoomHeader
        roomName={roomName}
        draftName={draftName}
        isEditing={isEditing}
        isHost={isHost}
        copied={copied}
        confirmOpen={confirmOpen}
        roomCode={ROOM_CODE}
        onCopy={copyRoomCode}
        onDraftChange={setDraftName}
        onStartEdit={() => setIsEditing(true)}
        onCommitName={commitRoomName}
        onCancelEdit={cancelRoomName}
        onToggleConfirm={() => setConfirmOpen((value) => !value)}
        onCloseRoom={() => {
          setConfirmOpen(false);
          setRoomClosed(true);
        }}
      />

      {roomClosed ? (
        <ClosedRoom hostName={currentUser?.name || "The host"} />
      ) : (
        <div className={styles.body}>
          <CodeEditorPanel
            codeLines={CODE_LINES}
            typingParticipant={typingParticipant}
          />
          <ParticipantsList
            participants={PARTICIPANTS}
            currentUserId={CURRENT_USER_ID}
            typingId={typingId}
          />
        </div>
      )}
    </main>
  );
}
