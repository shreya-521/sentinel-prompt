"use client";

import { Language } from "@/lib/types";
import { ChevronDown } from "lucide-react";

const LANGUAGES: { value: Language; label: string }[] = [
  { value: "auto", label: "Auto-Detect" },
  { value: "python", label: "Python" },
  { value: "javascript", label: "JavaScript" },
  { value: "typescript", label: "TypeScript" },
  { value: "java", label: "Java" },
  { value: "go", label: "Go" },
  { value: "sql", label: "SQL" },
  { value: "php", label: "PHP" },
  { value: "ruby", label: "Ruby" },
  { value: "c", label: "C" },
  { value: "cpp", label: "C++" },
];

interface Props {
  value: Language;
  onChange: (lang: Language) => void;
}

export default function LanguageSelector({ value, onChange }: Props) {
  return (
    <div className="relative flex items-center">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as Language)}
        style={{
          background: "var(--bg-elevated)",
          border: "1px solid var(--border-subtle)",
          borderRadius: 6,
          padding: "4px 28px 4px 10px",
          fontSize: "0.75rem",
          color: "var(--text-secondary)",
          cursor: "pointer",
          appearance: "none",
          outline: "none",
        }}
      >
        {LANGUAGES.map((l) => (
          <option key={l.value} value={l.value} style={{ background: "#0f0f18" }}>
            {l.label}
          </option>
        ))}
      </select>
      <ChevronDown
        size={12}
        style={{
          position: "absolute",
          right: 8,
          color: "var(--text-muted)",
          pointerEvents: "none",
        }}
      />
    </div>
  );
}
