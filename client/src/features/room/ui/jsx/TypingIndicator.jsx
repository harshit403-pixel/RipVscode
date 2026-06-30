import styles from "../css/RoomPage.module.css";

export default function TypingIndicator({ participant }) {
  return (
    <div className={styles.typingBar}>
      {participant ? (
        <span style={{ color: participant.color }}>
          <span className={styles.typingName}>{participant.name}</span>
          <span>is typing</span>
          <span className={styles.dots}>
            <span />
            <span />
            <span />
          </span>
        </span>
      ) : (
        <span>No one is typing right now</span>
      )}
    </div>
  );
}
