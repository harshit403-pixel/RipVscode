import {
  Copy,
  UserPlus,
  LogOut,
  Code2,
} from "lucide-react";
import styles from "../css/RoomPage.module.css";

export default function RoomHeader({
  roomCode = "room-7f3g2k",
  onCopy = () => {},
  onShare = () => {},
  onLeave = () => {},
}) {
  return (
    <header className={styles.header}>
      <div className={styles.leftHeader}>
        <div className={styles.brand}>
          <span className={styles.brandIcon}>
            <Code2 size={20} strokeWidth={3} />
          </span>
          <span>RipVSCode</span>
        </div>

        <div className={styles.headerPill}>
          <span>Room ID: {roomCode}</span>
          <button
            className={styles.copyBtn}
            onClick={onCopy}
            type="button"
            aria-label="Copy Room ID"
            title="Copy Room ID"
          >
            <Copy size={14} />
          </button>
        </div>
      </div>

      <div className={styles.rightHeader}>
        <button className={styles.btnSecondary} onClick={onShare} type="button">
          <UserPlus size={16} />
          <span>Share Room</span>
        </button>

        <button className={styles.btnPrimary} onClick={onLeave} type="button">
          <LogOut size={16} />
          <span>Leave Room</span>
        </button>
      </div>
    </header>
  );
}
