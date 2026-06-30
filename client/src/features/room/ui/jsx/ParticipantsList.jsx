import { Crown } from "lucide-react";
import styles from "../css/RoomPage.module.css";

function getInitials(name) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function ParticipantsList({ participants, currentUserId, typingId }) {
  const onlineCount = participants.filter((participant) => participant.online).length;

  return (
    <aside className={styles.sidebar}>
      <div className={styles.sidebarHeader}>
        <h2 className={styles.sidebarTitle}>Participants</h2>
        <span className={styles.onlinePill}>{onlineCount} online</span>
      </div>

      <div className={styles.participantList}>
        {participants.map((participant) => {
          const isMe = participant.id === currentUserId;
          const isTyping = participant.id === typingId && participant.online;
          const rowClass = [
            styles.participant,
            isMe ? styles.me : "",
            participant.online ? "" : styles.offline,
          ]
            .filter(Boolean)
            .join(" ");

          return (
            <div className={rowClass} key={participant.id}>
              <div className={styles.avatarWrap}>
                <div
                  className={styles.avatar}
                  style={{ "--person-color": participant.color }}
                >
                  {getInitials(participant.name)}
                </div>
                <span
                  className={`${styles.presenceDot} ${
                    participant.online ? "" : styles.presenceOff
                  }`}
                />
              </div>

              <div className={styles.participantText}>
                <div className={styles.participantName}>
                  <span className={styles.nameText}>{participant.name}</span>
                  {isMe && <span className={styles.youTag}>You</span>}
                </div>

                <div
                  className={styles.participantMeta}
                  style={{ "--person-color": participant.color }}
                >
                  {isTyping ? (
                    <span className={styles.typingMeta}>
                      typing
                      <span className={styles.dots}>
                        <span />
                        <span />
                        <span />
                      </span>
                    </span>
                  ) : participant.role === "HOST" ? (
                    <span className={styles.hostMeta}>
                      <Crown size={13} />
                      Host
                    </span>
                  ) : participant.online ? (
                    "Guest"
                  ) : (
                    "Offline"
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </aside>
  );
}
