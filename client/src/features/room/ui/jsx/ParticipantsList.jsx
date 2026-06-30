import { useState } from "react";
import {
  X,
  Crown,
  MoreVertical,
  UserMinus,
  ChevronUp,
  ChevronDown,
  Copy,
  Lock,
} from "lucide-react";
import styles from "../css/RoomPage.module.css";

// Helper function to extract initials
function getInitials(name) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function ParticipantsList({
  participants = [
    { id: "1", name: "Harsh", role: "HOST", online: true, color: "#0f0f0f" },
    { id: "2", name: "Arjun", role: "GUEST", online: true, color: "#0f0f0f" },
    { id: "3", name: "Neha", role: "GUEST", online: true, color: "#0f0f0f" },
  ],
  currentUserId = "1",
  onKick = () => {},
  onCloseSidebar = () => {},
  roomCode = "room-7f3g2k",
  isLocked = false,
}) {
  const [activeMenuId, setActiveMenuId] = useState(null);
  const [settingsOpen, setSettingsOpen] = useState(true);

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
          const isHost = participant.role === "HOST";
          const isMe = participant.id === currentUserId;
          const showMenu = activeMenuId === participant.id;

          return (
            <div className={styles.participantCard} key={participant.id}>
              <div className={styles.participantLeft}>
                <div
                  className={styles.avatar}
                  style={{ backgroundColor: participant.color || "#000000" }}
                >
                  {getInitials(participant.name)}
                </div>

                <div className={styles.participantDetails}>
                  <div className={styles.nameRow}>
                    <span>
                      {participant.name}
                      {isMe ? " (You)" : ""}
                    </span>
                    {isHost && <span className={styles.hostBadge}>(host)</span>}
                  </div>
                  <div className={styles.statusRow}>
                    <span
                      className={styles.presenceDot}
                      style={{
                        backgroundColor: participant.online
                          ? "var(--accent)"
                          : "#cbd5e1",
                      }}
                    />
                    <span className={styles.statusText}>
                      {participant.online ? "Online" : "Offline"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action menu for host / guests */}
              <div className={styles.actionsColumn}>
                <button
                  className={styles.menuBtn}
                  onClick={() => toggleMenu(participant.id)}
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
                        onKick(participant.id);
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

              <div className={styles.settingRow}>
                <span className={styles.settingLabelWithIcon}>
                  <Lock size={13} />
                  Lock Room
                </span>
                <span className={styles.settingValue}>
                  {isLocked ? "Locked" : "Unlocked"}
                </span>
              </div>

              <button className={styles.btnBlock} type="button">
                Lock Room with Password
              </button>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
