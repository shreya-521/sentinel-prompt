"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const SCAN_MESSAGES = [
  "Initializing adversarial scan engine...",
  "Parsing abstract syntax tree...",
  "Checking OWASP Top 10 vectors...",
  "Analyzing injection surface...",
  "Scanning for hardcoded secrets...",
  "Evaluating authentication flows...",
  "Mapping CWE vulnerabilities...",
  "Cross-referencing threat database...",
  "Generating risk assessment...",
  "Compiling security report...",
];

export default function ScanAnimation() {
  const [msgIdx, setMsgIdx] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMsgIdx((i) => (i + 1) % SCAN_MESSAGES.length);
      setProgress((p) => Math.min(p + 10, 95));
    }, 600);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="flex flex-col items-center justify-center flex-1 gap-8 p-8"
      style={{ background: "var(--bg-deep)" }}
    >
      {/* Central scanner orb */}
      <div className="relative flex items-center justify-center" style={{ width: 120, height: 120 }}>
        {/* Pulse rings */}
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              width: "100%",
              height: "100%",
              borderRadius: "50%",
              border: "1px solid rgba(139,21,21,0.4)",
              animation: `pulse-ring 2s ease-out ${i * 0.6}s infinite`,
            }}
          />
        ))}

        {/* Core */}
        <div
          style={{
            width: 72,
            height: 72,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #4a0a0a, #8b1515)",
            border: "2px solid var(--red-mid)",
            boxShadow: "0 0 30px rgba(139,21,21,0.5), 0 0 60px rgba(139,21,21,0.2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "1.5rem",
          }}
        >
          🔍
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ width: 280 }}>
        <div
          style={{
            height: 3,
            borderRadius: 2,
            background: "var(--bg-elevated)",
            overflow: "hidden",
            marginBottom: 12,
          }}
        >
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
            style={{
              height: "100%",
              background: "linear-gradient(90deg, #8b1515, #ff2d55)",
              boxShadow: "0 0 8px rgba(255,45,85,0.6)",
            }}
          />
        </div>

        {/* Scan message */}
        <motion.div
          key={msgIdx}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          style={{
            fontFamily: "monospace",
            fontSize: "0.78rem",
            color: "var(--red-bright)",
            textAlign: "center",
            letterSpacing: "0.02em",
          }}
        >
          <span style={{ color: "var(--gold-mid)" }}>›</span> {SCAN_MESSAGES[msgIdx]}
        </motion.div>
      </div>

      {/* Sub-label */}
      <div
        style={{
          fontFamily: "var(--font-rajdhani)",
          fontSize: "0.75rem",
          color: "var(--text-muted)",
          letterSpacing: "0.12em",
        }}
      >
        GEMINI FLASH · ADVERSARIAL ANALYSIS
      </div>
    </div>
  );
}
