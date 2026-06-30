import styles from "../css/RoomPage.module.css";
import CodeEditor from "./CodeEditor";

export default function CodeEditorPanel() {
  return (
    <section className={styles.editor}>
      <div className={styles.tabBar}>
        <div className={styles.tab}>
          main.js •
        </div>
      </div>

      <div className={styles.codePanel}>
        <CodeEditor />
      </div>
    </section>
  );
}
