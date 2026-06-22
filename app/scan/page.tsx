"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Home } from "lucide-react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { ScanResult, Language, Vulnerability, FixResult } from "@/lib/types";
import { DEMO_SAMPLES } from "@/lib/vulnerabilities";
import ScanPanel from "@/components/ScanPanel";
import ThreatDashboard from "@/components/ThreatDashboard";
import DiffViewer from "@/components/DiffViewer";
import LanguageSelector from "@/components/LanguageSelector";
import ScanAnimation from "@/components/ScanAnimation";

// Dynamic import for Monaco to avoid SSR issues
const CodeEditor = dynamic(() => import("@/components/CodeEditor"), {
  ssr: false,
  loading: () => (
    <div
      className="shimmer"
      style={{ height: "100%", borderRadius: 8, minHeight: 400 }}
    />
  ),
});

export default function ScanPage() {
  const [code, setCode] = useState(DEMO_SAMPLES[0].code);
  const [language, setLanguage] = useState<Language>(DEMO_SAMPLES[0].language);
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedVuln, setSelectedVuln] = useState<Vulnerability | null>(null);
  const [fixResult, setFixResult] = useState<FixResult | null>(null);
  const [fixing, setFixing] = useState(false);
  const [showDiff, setShowDiff] = useState(false);
  const [activeSample, setActiveSample] = useState(0);

  const handleScan = useCallback(async () => {
    if (!code.trim()) return;
    setScanning(true);
    setError(null);
    setScanResult(null);
    setSelectedVuln(null);
    setFixResult(null);
    setShowDiff(false);

    try {
      const res = await fetch("/api/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, language }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Scan failed");
      setScanResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Scan failed");
    } finally {
      setScanning(false);
    }
  }, [code, language]);

  const handleFix = useCallback(
    async (vuln: Vulnerability) => {
      setSelectedVuln(vuln);
      setFixing(true);
      setFixResult(null);
      setShowDiff(true);

      try {
        const res = await fetch("/api/fix", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code, vulnerability: vuln, language }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Fix failed");
        setFixResult(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Fix failed");
        setShowDiff(false);
      } finally {
        setFixing(false);
      }
    },
    [code, language]
  );

  const handleApplyFix = useCallback(() => {
    if (fixResult) {
      setCode(fixResult.fixed_code);
      setShowDiff(false);
      setFixResult(null);
      setSelectedVuln(null);
      setScanResult(null);
    }
  }, [fixResult]);

  const loadSample = (idx: number) => {
    setActiveSample(idx);
    setCode(DEMO_SAMPLES[idx].code);
    setLanguage(DEMO_SAMPLES[idx].language);
    setScanResult(null);
    setError(null);
    setShowDiff(false);
    setFixResult(null);
  };

  return (
    <div className="relative min-h-screen flex flex-col" style={{ background: "var(--bg-void)" }}>
      <div className="bg-grid" />

      {/* Navbar */}
      <nav
        className="relative z-10 flex items-center justify-between px-6 py-4 flex-shrink-0"
        style={{ borderBottom: "1px solid var(--border-subtle)", backdropFilter: "blur(8px)" }}
      >
        <Link href="/" className="flex items-center gap-3">
          <div
            className="flex items-center justify-center rounded-lg"
            style={{
              width: 32,
              height: 32,
              background: "linear-gradient(135deg, #6b1515, #8b1a1a)",
              border: "1px solid var(--red-mid)",
              boxShadow: "0 0 12px rgba(139,21,21,0.5)",
            }}
          >
            <Shield size={16} color="#f0e8d0" />
          </div>
          <span className="font-display text-lg" style={{ color: "var(--text-primary)" }}>
            Sentinel<span style={{ color: "var(--gold-bright)" }}>Prompt</span>
          </span>
        </Link>

        <div className="flex items-center gap-3">
          {scanResult && (
            <div
              className="flex items-center gap-2 px-3 py-1.5 rounded-full"
              style={{
                background: "rgba(107,21,21,0.2)",
                border: "1px solid var(--red-mid)",
                fontSize: "0.78rem",
                color: "var(--text-secondary)",
              }}
            >
              <span
                className="blink"
                style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--red-vivid)", display: "inline-block" }}
              />
              {scanResult.vulnerabilities.length} vulnerabilities found
            </div>
          )}
          <Link href="/" style={{ color: "var(--text-muted)" }}>
            <Home size={18} />
          </Link>
        </div>
      </nav>

      {/* Sample picker */}
      <div
        className="relative z-10 flex items-center gap-2 px-6 py-3"
        style={{ borderBottom: "1px solid var(--border-subtle)", background: "rgba(10,10,15,0.6)" }}
      >
        <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginRight: 4 }}>
          DEMO:
        </span>
        {DEMO_SAMPLES.map((s, i) => (
          <button
            key={s.id}
            onClick={() => loadSample(i)}
            style={{
              padding: "4px 14px",
              borderRadius: 6,
              fontSize: "0.78rem",
              border: `1px solid ${i === activeSample ? "var(--border-accent)" : "var(--border-subtle)"}`,
              background: i === activeSample ? "rgba(107,21,21,0.2)" : "transparent",
              color: i === activeSample ? "var(--gold-bright)" : "var(--text-muted)",
              cursor: "pointer",
              transition: "all 0.15s ease",
            }}
          >
            {s.title}
          </button>
        ))}
      </div>

      {/* Main Layout */}
      <div className="relative z-10 flex flex-1 overflow-hidden" style={{ minHeight: 0 }}>
        {/* Left panel: Editor */}
        <div
          className="flex flex-col"
          style={{
            width: "45%",
            borderRight: "1px solid var(--border-subtle)",
            background: "var(--bg-surface)",
          }}
        >
          {/* Editor header */}
          <div
            className="flex items-center justify-between px-4 py-3 flex-shrink-0"
            style={{ borderBottom: "1px solid var(--border-subtle)" }}
          >
            <div className="flex items-center gap-2">
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#ff2d55" }} />
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#ffb800" }} />
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#34c98c" }} />
              <span style={{ marginLeft: 8, fontSize: "0.78rem", color: "var(--text-muted)" }}>
                code-input.{language === "javascript" ? "js" : language === "python" ? "py" : language === "sql" ? "sql" : language}
              </span>
            </div>
            <LanguageSelector value={language} onChange={setLanguage} />
          </div>

          {/* Monaco Editor */}
          <div className="flex-1 overflow-hidden" style={{ minHeight: 0 }}>
            <CodeEditor value={code} onChange={setCode} language={language} />
          </div>

          {/* Scan button */}
          <div
            className="flex items-center justify-between px-4 py-3 flex-shrink-0"
            style={{ borderTop: "1px solid var(--border-subtle)", background: "var(--bg-card)" }}
          >
            <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
              {code.split("\n").length} lines · {code.length} chars
            </span>
            <button
              className="scan-btn flex items-center gap-2"
              onClick={handleScan}
              disabled={scanning || !code.trim()}
              style={{ padding: "9px 24px", fontSize: "0.85rem" }}
            >
              {scanning ? (
                <>
                  <span
                    className="blink"
                    style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--red-vivid)", display: "inline-block" }}
                  />
                  Scanning...
                </>
              ) : (
                <>
                  <Shield size={14} />
                  Run Security Scan
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right panel: Results */}
        <div className="flex flex-col flex-1 overflow-hidden" style={{ minHeight: 0 }}>
          {scanning && <ScanAnimation />}

          {!scanning && error && (
            <div className="flex items-center justify-center flex-1 p-8">
              <div
                className="glass-card p-6 text-center max-w-md"
                style={{ borderColor: "rgba(255,45,85,0.3)" }}
              >
                <div style={{ color: "var(--red-bright)", fontSize: "0.9rem" }}>
                  ⚠ {error}
                </div>
              </div>
            </div>
          )}

          {!scanning && !error && !scanResult && (
            <div className="flex items-center justify-center flex-1">
              <div className="text-center">
                <Shield size={48} style={{ color: "var(--border-default)", margin: "0 auto 16px" }} />
                <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
                  Select a demo or paste your code, then click{" "}
                  <span style={{ color: "var(--gold)" }}>Run Security Scan</span>
                </p>
              </div>
            </div>
          )}

          {!scanning && scanResult && (
            <div className="flex flex-col flex-1 overflow-hidden" style={{ minHeight: 0 }}>
              {/* Dashboard stats */}
              <div style={{ flexShrink: 0 }}>
                <ThreatDashboard result={scanResult} />
              </div>

              {/* Vuln list + diff */}
              <div className="flex flex-1 overflow-hidden" style={{ minHeight: 0 }}>
                <AnimatePresence mode="wait">
                  {showDiff && selectedVuln ? (
                    <DiffViewer
                      key="diff"
                      original={code}
                      fixed={fixResult?.fixed_code || ""}
                      explanation={fixResult?.explanation || ""}
                      vulnerability={selectedVuln}
                      loading={fixing}
                      onApply={handleApplyFix}
                      onClose={() => { setShowDiff(false); setFixResult(null); }}
                    />
                  ) : (
                    <ScanPanel
                      key="panel"
                      result={scanResult}
                      onFix={handleFix}
                    />
                  )}
                </AnimatePresence>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
