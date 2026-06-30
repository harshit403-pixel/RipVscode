"use client";

import styles from "../css/RoomPage.module.css";

import CodeEditorPanel from "./CodeEditorPanel";
import ParticipantsList from "./ParticipantsList";
import RoomHeader from "./RoomHeader";
import ShareModal from "./ShareModal";
import { useShareRoom } from "../../hooks/useShareRoom";
import { useCollaborativeEditor } from "../../hooks/useCollaborativeEditor";
import { Users } from "lucide-react";

export default function RoomPage({ roomCode }) {

  // Establish the realtime collaboration session for this room.
  const { document, handleEditorMount } = useCollaborativeEditor(roomCode);

  const {
    isShareOpen,
    isCopied,
    roomLink,
    copyRoomLink,
    openShare,
    closeShare,
  } = useShareRoom(roomCode);

  return (
    <main className={styles.page}>
      {/* Top Header */}
      <RoomHeader 
        roomCode={roomCode} 
        isLocked={false} 
        onShare={openShare}
      />

      {/* Main Grid Area */}
      <div className={styles.body}>
        <CodeEditorPanel
          initialValue={document}
          onEditorMount={handleEditorMount}
        />
        <ParticipantsList roomCode={roomCode} isLocked={false} />
      </div>

      {/* Share Room Popup */}
      <ShareModal
        isOpen={isShareOpen}
        onClose={closeShare}
        roomLink={roomLink}
        isCopied={isCopied}
        onCopy={copyRoomLink}
      />


      {/* Status Bar / Footer */}
      <footer className={styles.footer}>
        <div className={styles.leftFooter}>
          <div className={styles.footerItem}>
            <span className={styles.footerDot} />
            <span>Connected</span>
          </div>
          <div className={styles.footerItem}>
            <Users size={14} />
            <span>3 Participants</span>
          </div>
        </div>

        <div className={styles.rightFooter}>
          <span>Ln 3, Col 24</span>
          <span>Spaces: 4</span>
          <span>UTF-8</span>
          <span>JavaScript</span>
        </div>
      </footer>
    </main>
  );
}
