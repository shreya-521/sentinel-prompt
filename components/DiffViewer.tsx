"use client";

import { motion } from "framer-motion";
import { X, Check, Loader2, Copy } from "lucide-react";
import { Vulnerability, FixResult } from "@/lib/types";
import { SEVERITY_COLORS } from "@/lib/vulnerabilities";
import { useState } from "react";

interface Props {
  original: string;
  fixed: string;
  explanation: string;
  vulnerability: Vulnerability;
  loading: boolean;
  onApply: () => void;
  onClose: () => void;
}

export default function DiffViewer({
  original,
  fixed,
  explanation,
  vulnerability: v,
  loading,
  onApply,
  onClose,
}: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (fixed) {
      await navigator.clipboard.writeText(fixed);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const color = SEVERITY_COLORS[v.severity];

  return (
    <motion.div
      className="flex flex-col flex-1 overflow-hidden"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      style={{ minHeight: 0 }}
    >
      {/* Header */}
      <div
        className="px-4 py-3 flex items-center justify-between flex-shrink-0"
        style={{
          borderBottom: "1px solid var(--border-subtle)",
          background: "var(--bg-card)",
        }}
      >
        <div className="flex items-center gap-3">
          <span
            className={`badge-${v.severity.toLowerCase()}`}
            style={{
              padding: "2px 8px",
              borderRadius: 4,
              fontSize: "0.68rem",
              fontFamily: "var(--font-rajdhani)",
              fontWeight: 600,
              letterSpacing: "0.06em",
            }}
          >
            {v.severity}
          </span>
          <span style={{ fontSize: "0.85rem", color: "var(--text-primary)", fontWeight: 500 }}>
            Auto-Fix: {v.title}
          </span>
        </div>
        <button
          onClick={onClose}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "var(--text-muted)",
            padding: 4,
          }}
        >
          <X size={16} />
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center flex-1 gap-4">
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: "50%",
              border: `2px solid ${color}30`,
              borderTopColor: color,
              animation: "spin 0.8s linear infinite",
            }}
          />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          <div style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>
            Generating secure fix...
          </div>
        </div>
      ) : (
        <>
          {/* Explanation */}
          {explanation && (
            <div
              className="px-4 py-3 flex-shrink-0"
              style={{
                borderBottom: "1px solid var(--border-subtle)",
                background: "rgba(107,81,10,0.08)",
              }}
            >
              <div
                style={{
                  fontSize: "0.68rem",
                  color: "var(--gold-mid)",
                  letterSpacing: "0.05em",
                  marginBottom: 4,
                }}
              >
                ✓ FIX EXPLANATION
              </div>
              <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>
                {explanation}
              </p>
            </div>
          )}

          {/* Diff view */}
          <div className="flex flex-1 overflow-hidden" style={{ minHeight: 0 }}>
            {/* Original */}
            <div
              className="flex flex-col flex-1 overflow-hidden"
              style={{ borderRight: "1px solid var(--border-subtle)" }}
            >
              <div
                className="px-3 py-2 flex-shrink-0"
                style={{
                  background: "rgba(139,21,21,0.1)",
                  borderBottom: "1px solid rgba(139,21,21,0.2)",
                  fontSize: "0.72rem",
                  color: "#c88",
                  letterSpacing: "0.05em",
                }}
              >
                ✗ ORIGINAL (VULNERABLE)
              </div>
              <pre
                className="flex-1 overflow-auto p-3"
                style={{
                  fontFamily: "monospace",
                  fontSize: "0.75rem",
                  color: "#c88",
                  lineHeight: 1.6,
                  background: "rgba(80,10,10,0.15)",
                }}
              >
                {original}
              </pre>
            </div>

            {/* Fixed */}
            <div className="flex flex-col flex-1 overflow-hidden">
              <div
                className="px-3 py-2 flex-shrink-0"
                style={{
                  background: "rgba(52,201,140,0.08)",
                  borderBottom: "1px solid rgba(52,201,140,0.2)",
                  fontSize: "0.72rem",
                  color: "#34c98c",
                  letterSpacing: "0.05em",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <span>✓ FIXED (SECURE)</span>
                <button
                  onClick={handleCopy}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: copied ? "#34c98c" : "var(--text-muted)",
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                    fontSize: "0.68rem",
                    letterSpacing: "0.04em",
                  }}
                >
                  <Copy size={11} />
                  {copied ? "Copied!" : "Copy"}
                </button>
              </div>
              <pre
                className="flex-1 overflow-auto p-3"
                style={{
                  fontFamily: "monospace",
                  fontSize: "0.75rem",
                  color: "#6ee",
                  lineHeight: 1.6,
                  background: "rgba(10,50,30,0.15)",
                }}
              >
                {fixed}
              </pre>
            </div>
          </div>

          {/* Apply button */}
          <div
            className="flex items-center gap-3 px-4 py-3 flex-shrink-0"
            style={{
              borderTop: "1px solid var(--border-subtle)",
              background: "var(--bg-card)",
            }}
          >
            <button
              onClick={onApply}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                background: "rgba(52,201,140,0.12)",
                border: "1px solid rgba(52,201,140,0.35)",
                borderRadius: 6,
                padding: "8px 20px",
                fontSize: "0.82rem",
                fontFamily: "var(--font-rajdhani)",
                fontWeight: 600,
                letterSpacing: "0.05em",
                color: "#34c98c",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
            >
              <Check size={14} />
              Apply Fix to Editor
            </button>
            <button
              onClick={onClose}
              style={{
                background: "transparent",
                border: "1px solid var(--border-subtle)",
                borderRadius: 6,
                padding: "8px 16px",
                fontSize: "0.82rem",
                color: "var(--text-muted)",
                cursor: "pointer",
              }}
            >
              Discard
            </button>
          </div>
        </>
      )}
    </motion.div>
  );
}
