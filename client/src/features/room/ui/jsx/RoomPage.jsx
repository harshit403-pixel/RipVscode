"use client";

import styles from "../css/RoomPage.module.css";

import CodeEditorPanel from "./CodeEditorPanel";
import ParticipantsList from "./ParticipantsList";
import RoomHeader from "./RoomHeader";
import ShareModal from "./ShareModal";
import ClosedRoom from "./ClosedRoom";
import { useShareRoom } from "../../hooks/useShareRoom";
import { useCollaborativeEditor } from "../../hooks/useCollaborativeEditor";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { Users } from "lucide-react";

export default function RoomPage({ roomCode }) {

  const router = useRouter();

  // Establish the realtime collaboration session for this room.
  const {
    document,
    roomClosed,
    closedBy,
    handleEditorMount,
    leaveRoom,
    kickParticipant,
  } = useCollaborativeEditor(roomCode);

  // Pull live participant data from Redux.
  const participants = useSelector((state) => state.room.participants);
  const currentParticipant = useSelector((state) => state.room.currentParticipant);

  const {
    isShareOpen,
    isCopied,
    roomLink,
    copyRoomLink,
    copyRoomCode,
    openShare,
    closeShare,
  } = useShareRoom(roomCode);

  return (
    <main className={styles.page}>
      {/* Top Header */}
      <RoomHeader
        roomCode={roomCode}
        onCopy={copyRoomCode}
        onShare={openShare}
        onLeave={leaveRoom}
      />

      {/* Main Grid Area */}
      <div className={styles.body}>
        <CodeEditorPanel
          initialValue={document}
          onEditorMount={handleEditorMount}
        />
        <ParticipantsList
          roomCode={roomCode}
          participants={participants}
          currentParticipant={currentParticipant}
          onKick={kickParticipant}
        />
      </div>

      {/* Share Room Popup */}
      <ShareModal
        isOpen={isShareOpen}
        onClose={closeShare}
        roomLink={roomLink}
        isCopied={isCopied}
        onCopy={copyRoomLink}
      />

      {/* Host-ended overlay shown to the remaining participants */}
      {roomClosed && (
        <ClosedRoom
          hostName={closedBy}
          onGoHome={() => router.push("/")}
        />
      )}

      {/* Status Bar / Footer */}
      <footer className={styles.footer}>
        <div className={styles.leftFooter}>
          <div className={styles.footerItem}>
            <span className={styles.footerDot} />
            <span>Connected</span>
          </div>
          <div className={styles.footerItem}>
            <Users size={14} />
            <span>{participants.length} Participant{participants.length !== 1 ? "s" : ""}</span>
          </div>
        </div>

        <div className={styles.rightFooter}>
          <span>UTF-8</span>
          <span>JavaScript</span>
        </div>
      </footer>
    </main>
  );
}
