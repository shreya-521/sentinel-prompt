"use client";

import Link from "next/link";
import { Shield, Zap, Lock, Eye, ChevronRight, Terminal } from "lucide-react";
import { motion } from "framer-motion";

const FEATURES = [
  {
    icon: <Zap size={22} />,
    title: "Gemini Flash Scanning",
    desc: "Powered by Google's Gemini 2.0 Flash for lightning-fast adversarial analysis across all major languages.",
  },
  {
    icon: <Shield size={22} />,
    title: "OWASP Top 10 Coverage",
    desc: "Detects SQL injection, XSS, broken auth, hardcoded secrets, command injection, path traversal and more.",
  },
  {
    icon: <Lock size={22} />,
    title: "1-Click Auto-Fix",
    desc: "AI-generated remediations with side-by-side diff view. Fix vulnerabilities instantly without leaving the dashboard.",
  },
  {
    icon: <Eye size={22} />,
    title: "CWE & CVSS Mapping",
    desc: "Every vulnerability is mapped to its CWE ID and OWASP category for compliance-ready security reports.",
  },
];

const STATS = [
  { value: "10+", label: "Vuln Types" },
  { value: "<3s", label: "Scan Time" },
  { value: "6+", label: "Languages" },
  { value: "100%", label: "AI-Powered" },
];

export default function HomePage() {
  return (
    <div className="relative min-h-screen flex flex-col">
      {/* Grid background */}
      <div className="bg-grid" />

      {/* Ambient orbs */}
      <div
        className="fixed pointer-events-none"
        style={{
          top: "10%",
          left: "15%",
          width: 500,
          height: 500,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(107,21,21,0.12) 0%, transparent 70%)",
          filter: "blur(60px)",
          zIndex: 0,
        }}
      />
      <div
        className="fixed pointer-events-none"
        style={{
          top: "50%",
          right: "10%",
          width: 400,
          height: 400,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(180,100,10,0.08) 0%, transparent 70%)",
          filter: "blur(60px)",
          zIndex: 0,
        }}
      />

      {/* Navbar */}
      <nav
        className="relative z-10 flex items-center justify-between px-8 py-5"
        style={{
          borderBottom: "1px solid var(--border-subtle)",
          backdropFilter: "blur(8px)",
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className="flex items-center justify-center rounded-lg"
            style={{
              width: 36,
              height: 36,
              background: "linear-gradient(135deg, #6b1515, #8b1a1a)",
              border: "1px solid var(--red-mid)",
              boxShadow: "0 0 16px rgba(139,21,21,0.5)",
            }}
          >
            <Shield size={18} color="#f0e8d0" />
          </div>
          <span
            className="font-display text-xl"
            style={{ color: "var(--text-primary)" }}
          >
            Sentinel
            <span style={{ color: "var(--gold-bright)" }}>Prompt</span>
          </span>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/scan"
            className="scan-btn flex items-center gap-2"
            style={{ padding: "8px 20px", fontSize: "0.85rem" }}
          >
            <Terminal size={14} />
            Launch Scanner
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <main className="relative z-10 flex flex-col items-center justify-center flex-1 px-6 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Badge */}
          <div
            className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-8"
            style={{
              background: "rgba(107, 21, 21, 0.2)",
              border: "1px solid rgba(139, 26, 26, 0.4)",
              fontSize: "0.78rem",
              color: "var(--text-secondary)",
              letterSpacing: "0.06em",
            }}
          >
            <span
              className="blink"
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "var(--red-vivid)",
                display: "inline-block",
              }}
            />
            POWERED BY GEMINI 2.0 FLASH — VIBE2SHIP HACKATHON
          </div>

          {/* Headline */}
          <h1
            className="font-display mb-6"
            style={{
              fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
              lineHeight: 1.05,
              color: "var(--text-primary)",
            }}
          >
            AI Security Guardian
            <br />
            <span
              style={{
                background:
                  "linear-gradient(135deg, var(--gold-bright) 0%, var(--red-bright) 60%, var(--red-vivid) 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              for AI-Generated Code
            </span>
          </h1>

          <p
            className="max-w-2xl mx-auto mb-10"
            style={{
              fontSize: "1.1rem",
              lineHeight: 1.7,
              color: "var(--text-secondary)",
            }}
          >
            SentinelPrompt scans your code for critical security vulnerabilities
            — SQL injections, hardcoded secrets, broken auth — and delivers
            instant AI-powered remediations. Built for the age of vibe-coding.
          </p>

          {/* CTA */}
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link
              href="/scan"
              className="scan-btn flex items-center gap-2"
              style={{ fontSize: "1rem", padding: "14px 36px" }}
            >
              <Shield size={16} />
              Start Security Scan
              <ChevronRight size={16} />
            </Link>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          className="flex items-center gap-8 mt-16 flex-wrap justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          {STATS.map((s) => (
            <div key={s.label} className="text-center">
              <div
                className="font-display text-3xl text-glow-gold"
                style={{ color: "var(--gold-bright)" }}
              >
                {s.value}
              </div>
              <div
                style={{ fontSize: "0.75rem", color: "var(--text-muted)", letterSpacing: "0.08em" }}
              >
                {s.label}
              </div>
            </div>
          ))}
        </motion.div>

        {/* Features Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-20 max-w-4xl w-full"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          {FEATURES.map((f, i) => (
            <div key={i} className="glass-card p-6 text-left flex gap-4">
              <div
                className="flex-shrink-0 flex items-center justify-center rounded-lg mt-0.5"
                style={{
                  width: 40,
                  height: 40,
                  background: "linear-gradient(135deg, #4a0a0a, #6b1515)",
                  border: "1px solid var(--red-mid)",
                  color: "#f0a800",
                }}
              >
                {f.icon}
              </div>
              <div>
                <h3
                  className="font-display mb-1"
                  style={{ color: "var(--text-primary)", fontSize: "1rem" }}
                >
                  {f.title}
                </h3>
                <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem", lineHeight: 1.6 }}>
                  {f.desc}
                </p>
              </div>
            </div>
          ))}
        </motion.div>
      </main>

      {/* Footer */}
      <footer
        className="relative z-10 text-center py-6"
        style={{
          borderTop: "1px solid var(--border-subtle)",
          color: "var(--text-muted)",
          fontSize: "0.8rem",
        }}
      >
        SentinelPrompt · Built for Vibe2Ship Hackathon · Powered by Gemini Flash
      </footer>
    </div>
  );
}
