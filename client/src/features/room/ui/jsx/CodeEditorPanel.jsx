import styles from "../css/RoomPage.module.css";
import CodeEditor from "./CodeEditor";

export default function CodeEditorPanel({ initialValue, onEditorMount }) {

  // Only mount Monaco once the initial document has loaded so it opens with the right content.
  const isDocumentReady = initialValue !== null && initialValue !== undefined;

  return (
    <section className={styles.editor}>
      <div className={styles.tabBar}>
        <div className={styles.tab}>
          main.js •
        </div>
      </div>

      <div className={styles.codePanel}>
        {isDocumentReady ? (
          <CodeEditor
            initialValue={initialValue}
            onEditorMount={onEditorMount}
          />
        ) : (
          <div className={styles.emptyEditorText}>Loading editor…</div>
        )}
      </div>
    </section>
  );
}
