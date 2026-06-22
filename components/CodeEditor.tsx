"use client";

import { useEffect, useRef } from "react";
import Editor from "@monaco-editor/react";
import { Language } from "@/lib/types";

const LANG_MAP: Record<Language, string> = {
  python: "python",
  javascript: "javascript",
  typescript: "typescript",
  java: "java",
  go: "go",
  sql: "sql",
  php: "php",
  ruby: "ruby",
  c: "c",
  cpp: "cpp",
  auto: "plaintext",
};

interface Props {
  value: string;
  onChange: (val: string) => void;
  language: Language;
}

export default function CodeEditor({ value, onChange, language }: Props) {
  const editorRef = useRef<unknown>(null);

  useEffect(() => {
    if (editorRef.current) {
      // Re-layout on language change
    }
  }, [language]);

  return (
    <div className="monaco-container" style={{ height: "100%", minHeight: 400 }}>
      <Editor
        height="100%"
        language={LANG_MAP[language]}
        value={value}
        onChange={(val) => onChange(val || "")}
        onMount={(editor) => {
          editorRef.current = editor;
        }}
        theme="vs-dark"
        options={{
          fontSize: 13,
          fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace",
          fontLigatures: true,
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          wordWrap: "on",
          lineNumbers: "on",
          glyphMargin: false,
          folding: true,
          lineDecorationsWidth: 4,
          padding: { top: 12, bottom: 12 },
          renderLineHighlight: "line",
          scrollbar: {
            verticalScrollbarSize: 6,
            horizontalScrollbarSize: 6,
          },
          overviewRulerBorder: false,
          hideCursorInOverviewRuler: true,
          renderWhitespace: "none",
          smoothScrolling: true,
          cursorBlinking: "smooth",
          cursorSmoothCaretAnimation: "on",
        }}
      />
    </div>
  );
}
