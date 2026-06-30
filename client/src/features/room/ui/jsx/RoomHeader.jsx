import { Check, Copy, FileCode2, Pencil, Power, Wifi, X } from "lucide-react";
import styles from "../css/RoomPage.module.css";

export default function RoomHeader({
  roomName,
  draftName,
  isEditing,
  isHost,
  copied,
  confirmOpen,
  roomCode,
  onCopy,
  onDraftChange,
  onStartEdit,
  onCommitName,
  onCancelEdit,
  onToggleConfirm,
  onCloseRoom,
}) {
  return (
    <header className={styles.header}>
      <div>
        <div className={styles.brand}>
          <FileCode2 size={15} />
          CodeRoom
        </div>

        <div className={styles.titleRow}>
          {isEditing ? (
            <input
              className={styles.titleInput}
              value={draftName}
              aria-label="Room name"
              onChange={(event) => onDraftChange(event.target.value)}
              onBlur={onCommitName}
              onKeyDown={(event) => {
                if (event.key === "Enter") onCommitName();
                if (event.key === "Escape") onCancelEdit();
              }}
              autoFocus
            />
          ) : (
            <h1 className={styles.title}>{roomName}</h1>
          )}

          {isHost && !isEditing && (
            <button
              className={styles.iconButton}
              type="button"
              aria-label="Rename room"
              title="Rename room"
              onClick={onStartEdit}
            >
              <Pencil size={15} />
            </button>
          )}
        </div>

        <p className={styles.subtitle}>Single shared file with live presence</p>
      </div>

      <div className={styles.headerActions}>
        <div className={styles.status}>
          <span className={styles.liveDot} />
          <Wifi size={15} />
          Connected
        </div>

        <div className={styles.roomCode}>
          <div>
            <div className={styles.codeLabel}>Room code</div>
            <div className={styles.codeValue}>{roomCode}</div>
          </div>
          <button
            className={`${styles.iconButton} ${copied ? styles.copied : ""}`}
            type="button"
            aria-label="Copy room code"
            title="Copy room code"
            onClick={onCopy}
          >
            {copied ? <Check size={15} /> : <Copy size={15} />}
          </button>
        </div>

        {isHost && (
          <div className={styles.dangerArea}>
            <button
              className={styles.closeButton}
              type="button"
              onClick={onToggleConfirm}
            >
              <Power size={15} />
              Close
            </button>

            {confirmOpen && (
              <div className={styles.popover}>
                <p>Closing the room disconnects everyone in this session.</p>
                <div className={styles.popoverActions}>
                  <button
                    className={styles.ghostButton}
                    type="button"
                    onClick={onToggleConfirm}
                  >
                    <X size={14} />
                    Cancel
                  </button>
                  <button
                    className={styles.dangerButton}
                    type="button"
                    onClick={onCloseRoom}
                  >
                    Close room
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
