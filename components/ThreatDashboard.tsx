"use client";

import { ScanResult } from "@/lib/types";
import { SEVERITY_COLORS } from "@/lib/vulnerabilities";
import { motion } from "framer-motion";

interface Props {
  result: ScanResult;
}

const SEV_ORDER = ["CRITICAL", "HIGH", "MEDIUM", "LOW", "INFO"] as const;

export default function ThreatDashboard({ result }: Props) {
  const { risk_score, stats, vulnerabilities } = result;

  // Risk ring parameters
  const RADIUS = 26;
  const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
  const strokeDash = (risk_score / 100) * CIRCUMFERENCE;

  const riskColor =
    risk_score >= 80
      ? "#ff2d55"
      : risk_score >= 60
      ? "#ff6b2b"
      : risk_score >= 40
      ? "#ffb800"
      : "#34c98c";

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="px-4 py-3 flex items-center gap-4 flex-wrap"
      style={{
        borderBottom: "1px solid var(--border-subtle)",
        background: "var(--bg-card)",
        flexShrink: 0,
      }}
    >
      {/* Risk Score Ring */}
      <div className="flex items-center gap-3 flex-shrink-0">
        <svg width={64} height={64} style={{ transform: "rotate(-90deg)" }}>
          <circle
            cx={32}
            cy={32}
            r={RADIUS}
            fill="none"
            stroke="rgba(139,80,30,0.15)"
            strokeWidth={5}
          />
          <motion.circle
            cx={32}
            cy={32}
            r={RADIUS}
            fill="none"
            stroke={riskColor}
            strokeWidth={5}
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            initial={{ strokeDashoffset: CIRCUMFERENCE }}
            animate={{ strokeDashoffset: CIRCUMFERENCE - strokeDash }}
            transition={{ duration: 1, ease: "easeOut" }}
            style={{ filter: `drop-shadow(0 0 6px ${riskColor}80)` }}
          />
        </svg>
        <div style={{ marginLeft: -8 }}>
          <div
            className="font-display"
            style={{ fontSize: "1.5rem", color: riskColor, lineHeight: 1 }}
          >
            {risk_score}
          </div>
          <div style={{ fontSize: "0.68rem", color: "var(--text-muted)", letterSpacing: "0.06em" }}>
            RISK SCORE
          </div>
        </div>
      </div>

      {/* Divider */}
      <div style={{ width: 1, height: 40, background: "var(--border-subtle)" }} />

      {/* Severity counts */}
      <div className="flex items-center gap-3 flex-wrap">
        {SEV_ORDER.map((sev) => {
          const count = stats[sev.toLowerCase() as keyof typeof stats] ?? 0;
          if (count === 0) return null;
          return (
            <motion.div
              key={sev}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className={`badge-${sev.toLowerCase()} flex items-center gap-1.5`}
              style={{
                padding: "4px 10px",
                borderRadius: 6,
                fontFamily: "var(--font-rajdhani)",
                fontWeight: 600,
                fontSize: "0.78rem",
                letterSpacing: "0.04em",
              }}
            >
              <span style={{ fontSize: "0.9rem", fontWeight: 700 }}>{count}</span>
              {sev}
            </motion.div>
          );
        })}
      </div>

      {/* Threat bar */}
      <div className="flex-1 min-w-32">
        <div style={{ fontSize: "0.68rem", color: "var(--text-muted)", marginBottom: 4, letterSpacing: "0.05em" }}>
          THREAT DISTRIBUTION
        </div>
        <div
          style={{
            height: 6,
            borderRadius: 3,
            overflow: "hidden",
            background: "var(--bg-elevated)",
            display: "flex",
          }}
        >
          {SEV_ORDER.map((sev) => {
            const count = stats[sev.toLowerCase() as keyof typeof stats] ?? 0;
            const pct = vulnerabilities.length > 0 ? (count / vulnerabilities.length) * 100 : 0;
            if (pct === 0) return null;
            return (
              <motion.div
                key={sev}
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                style={{
                  height: "100%",
                  background: SEVERITY_COLORS[sev],
                  boxShadow: `0 0 6px ${SEVERITY_COLORS[sev]}60`,
                }}
                title={`${sev}: ${count}`}
              />
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
