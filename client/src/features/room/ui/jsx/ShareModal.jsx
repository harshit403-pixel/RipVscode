import React from "react";
import { X } from "lucide-react";
import styles from "../css/RoomPage.module.css";

export default function ShareModal({
  isOpen = false,
  onClose = () => {},
  roomLink = "http://localhost:3000/room/room-7f3g2k",
  isCopied = false,
  onCopy = () => {},
}) {
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div 
        className={styles.modalContent} 
        onClick={(event) => event.stopPropagation()} // Prevents closing when clicking inside the modal
      >
        <div className={styles.modalHeader}>
          <h3 className={styles.modalTitle}>Share Room</h3>
          <button 
            className={styles.closeModalBtn} 
            onClick={onClose}
            type="button"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        <div className={styles.modalBody}>
          <p className={styles.modalText}>
            Share this link with your teammates to collaborate on this document.
          </p>

          <div className={styles.linkBox}>
            <span className={styles.linkText}>{roomLink}</span>
            <button
              className={`${styles.copyLinkBtn} ${isCopied ? styles.copyLinkBtnCopied : ""}`}
              onClick={onCopy}
              type="button"
            >
              {isCopied ? "Copied!" : "Copy Link"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
