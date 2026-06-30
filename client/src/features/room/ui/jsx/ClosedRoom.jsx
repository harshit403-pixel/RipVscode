import { Power } from "lucide-react";
import styles from "../css/RoomPage.module.css";

export default function ClosedRoom({ hostName }) {
  return (
    <div className={styles.closed}>
      <div className={styles.closedBox}>
        <div className={styles.closedIcon}>
          <Power size={22} />
        </div>
        <h2>This room is closed</h2>
        <p>{hostName} ended the session. Create a new room when you are ready to continue.</p>
      </div>
    </div>
  );
}
