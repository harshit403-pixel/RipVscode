"use client";

import { useEffect, useRef } from "react";
import Editor from "@monaco-editor/react";

// Static Monaco options reused across renders to avoid re-configuring the editor.
const EDITOR_OPTIONS = {
  fontSize: 14,
  minimap: { enabled: false },
  automaticLayout: true,
  scrollBeyondLastLine: false,
  tabSize: 4,
  wordWrap: "on",
  smoothScrolling: true,
  renderWhitespace: "selection",
};

const CodeEditor = ({ initialValue = "", onEditorMount }) => {

  // Hold references to the editor and monaco instances for later collaboration wiring.
  const editorRef = useRef(null);
  const monacoRef = useRef(null);

  // Capture the editor and monaco instances once the editor has mounted.
  const handleMount = (editor, monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;

    // Hand the instances to the collaboration layer when provided.
    if (onEditorMount) {
      onEditorMount(editor, monaco);
    }
  };

  // Release editor references on unmount; the Editor component disposes the instance itself.
  useEffect(() => {
    return () => {
      editorRef.current = null;
      monacoRef.current = null;
    };
  }, []);

  // Render the Monaco editor filling the existing code panel.
  return (
    <Editor
      height="100%"
      defaultLanguage="javascript"
      defaultValue={initialValue}
      theme="light"
      options={EDITOR_OPTIONS}
      onMount={handleMount}
    />
  );
};

export default CodeEditor;
