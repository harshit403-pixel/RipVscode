import { Check, FileCode2 } from "lucide-react";
import styles from "../css/RoomPage.module.css";
import TypingIndicator from "./TypingIndicator";

export default function CodeEditorPanel({ codeLines, typingParticipant }) {
  return (
    <section className={styles.editor}>
      <div className={styles.tabBar}>
        <div className={styles.tab}>
          <FileCode2 size={15} />
          solution.js
        </div>
        <div className={styles.synced}>
          <Check size={14} color="#31d093" />
          Synced
        </div>
      </div>

      <TypingIndicator participant={typingParticipant} />

      <div className={styles.codePanel}>
        {codeLines.map((line, index) => (
          <div className={styles.codeLine} key={`${index}-${line}`}>
            <span className={styles.lineNumber}>{index + 1}</span>
            <span className={styles.lineText}>{line || " "}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
