"use client";

import { ScanResult, Vulnerability } from "@/lib/types";
import VulnerabilityCard from "./VulnerabilityCard";
import { motion } from "framer-motion";

interface Props {
  result: ScanResult;
  onFix: (v: Vulnerability) => void;
}

export default function ScanPanel({ result, onFix }: Props) {
  const { vulnerabilities } = result;

  if (vulnerabilities.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center flex-1 gap-4 p-8">
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: "50%",
            background: "rgba(52,201,140,0.1)",
            border: "2px solid rgba(52,201,140,0.3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "1.8rem",
          }}
        >
          ✓
        </div>
        <div className="text-center">
          <div
            className="font-display"
            style={{ color: "#34c98c", fontSize: "1.1rem" }}
          >
            No Vulnerabilities Detected
          </div>
          <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginTop: 6 }}>
            {result.summary}
          </p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="flex flex-col flex-1 overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{ minHeight: 0 }}
    >
      {/* Header */}
      <div
        className="px-4 py-3 flex-shrink-0 flex items-center justify-between"
        style={{ borderBottom: "1px solid var(--border-subtle)" }}
      >
        <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", letterSpacing: "0.05em" }}>
          VULNERABILITIES · {vulnerabilities.length} found · {result.scan_duration_ms}ms
        </div>
        <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
          {result.language.toUpperCase()}
        </div>
      </div>

      {/* Summary bar */}
      <div
        className="px-4 py-2 flex-shrink-0"
        style={{ borderBottom: "1px solid var(--border-subtle)", background: "rgba(10,10,15,0.4)" }}
      >
        <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>
          {result.summary}
        </p>
      </div>

      {/* List */}
      <div
        className="flex-1 overflow-y-auto"
        style={{ padding: "12px 12px", display: "flex", flexDirection: "column", gap: 8 }}
      >
        {vulnerabilities.map((v, i) => (
          <VulnerabilityCard key={v.id} vulnerability={v} onFix={onFix} index={i} />
        ))}
      </div>
    </motion.div>
  );
}
