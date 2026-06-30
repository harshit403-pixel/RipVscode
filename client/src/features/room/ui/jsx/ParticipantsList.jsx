import { useState } from "react";
import {
  X,
  MoreVertical,
  UserMinus,
  ChevronUp,
  ChevronDown,
  Copy,
} from "lucide-react";
import styles from "../css/RoomPage.module.css";

function getInitials(name) {
  if (!name) return "??";
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function hashCode(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash);
}

const AVATAR_COLORS = [
  "#ef4444", "#f97316", "#eab308", "#22c55e",
  "#06b6d4", "#3b82f6", "#8b5cf6", "#ec4899",
];

function getAvatarColor(id) {
  const index = hashCode(id || "") % AVATAR_COLORS.length;
  return AVATAR_COLORS[index];
}

export default function ParticipantsList({
  participants = [],
  currentParticipant = null,
  onKick = () => {},
  onCloseSidebar = () => {},
  roomCode = "",
}) {
  const [activeMenuId, setActiveMenuId] = useState(null);
  const [settingsOpen, setSettingsOpen] = useState(true);

  const currentUserId = currentParticipant?.id || currentParticipant?._id || "";
  const isHost = currentParticipant?.role === "HOST";

  const toggleMenu = (id) => {
    setActiveMenuId(activeMenuId === id ? null : id);
  };

  return (
    <aside className={styles.sidebar}>
      {/* Sidebar Header */}
      <div className={styles.sidebarHeader}>
        <h2 className={styles.sidebarTitle}>
          Participants ({participants.length})
        </h2>
        <button
          className={styles.closeSidebarBtn}
          onClick={onCloseSidebar}
          type="button"
          aria-label="Close sidebar"
        >
          <X size={18} />
        </button>
      </div>

      {/* Participants List */}
      <div className={styles.participantsList}>
        {participants.map((participant) => {
          const pid = participant.id || participant._id;
          const isParticipantHost = participant.role === "HOST";
          const isMe = pid === currentUserId;
          const showMenu = activeMenuId === pid;
          const canKick = isHost && !isMe && !isParticipantHost;

          return (
            <div className={styles.participantCard} key={pid}>
              <div className={styles.participantLeft}>
                <div
                  className={styles.avatar}
                  style={{ backgroundColor: getAvatarColor(pid) }}
                >
                  {getInitials(participant.displayName)}
                </div>

                <div className={styles.participantDetails}>
                  <div className={styles.nameRow}>
                    <span>
                      {participant.displayName}
                      {isMe ? " (You)" : ""}
                    </span>
                    {isParticipantHost && (
                      <span className={styles.hostBadge}>(host)</span>
                    )}
                  </div>
                  <div className={styles.statusRow}>
                    <span
                      className={styles.presenceDot}
                      style={{
                        backgroundColor: participant.isOnline
                          ? "var(--accent)"
                          : "#cbd5e1",
                      }}
                    />
                    <span className={styles.statusText}>
                      {participant.isOnline ? "Online" : "Offline"}
                    </span>
                  </div>
                </div>
              </div>

              {canKick && (
                <div className={styles.actionsColumn}>
                  <button
                    className={styles.menuBtn}
                    onClick={() => toggleMenu(pid)}
                    type="button"
                    aria-label="Toggle menu"
                  >
                    <MoreVertical size={16} />
                  </button>

                  {showMenu && (
                    <div className={styles.popoverMenu}>
                      <button
                        className={styles.popoverItem}
                        onClick={() => {
                          onKick(pid);
                          setActiveMenuId(null);
                        }}
                        type="button"
                      >
                        <UserMinus size={14} />
                        <span>Kick Participant</span>
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Room Settings Section */}
      <div className={styles.settingsSection}>
        <button
          className={styles.settingsHeader}
          onClick={() => setSettingsOpen(!settingsOpen)}
          type="button"
        >
          <span>Room Settings</span>
          {settingsOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>

        {settingsOpen && (
          <div className={styles.settingsPanel}>
            <div className={styles.settingsCard}>
              <div className={styles.settingRow}>
                <span className={styles.settingLabel}>Room ID</span>
                <span className={styles.settingValue}>
                  {roomCode}
                  <button className={styles.copyBtn} type="button">
                    <Copy size={13} />
                  </button>
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
