import React from "react";
import { Wrench, AlertTriangle, Cpu, CheckCircle2, ArrowRight } from "lucide-react";

/**
 * Self-Healing Workflow Status Trail Component
 * Styled with monospace small-caps status labels and orange accent markers.
 * Trail: Failed → Diagnosing → Patched → Re-validated
 */
export default function SelfHealingTimeline({ 
  sourceDomain = "crunchbase.com", 
  errorType = "DOM Selector Drift (Element not found in DOM)", 
  healedSelector = ".company-card__metrics > div.value",
  status = "RE_VALIDATED" // "FAILED" | "DIAGNOSING" | "PATCHED" | "RE_VALIDATED"
}) {
  const steps = [
    {
      id: "FAILED",
      label: "FAILED",
      desc: "Schema mismatch / missing element",
      icon: AlertTriangle,
      color: "#ef4444",
      bg: "rgba(239, 68, 68, 0.12)",
      border: "rgba(239, 68, 68, 0.35)",
    },
    {
      id: "DIAGNOSING",
      label: "DIAGNOSING",
      desc: "Multimodal Vision OCR inspection",
      icon: Cpu,
      color: "#f59e0b", // Orange accent
      bg: "rgba(245, 158, 11, 0.12)",
      border: "rgba(245, 158, 11, 0.35)",
    },
    {
      id: "PATCHED",
      label: "PATCHED",
      desc: "Auto-synthesized dynamic selector",
      icon: Wrench,
      color: "#fbbf24", // Warm orange/amber
      bg: "rgba(251, 191, 36, 0.12)",
      border: "rgba(251, 191, 36, 0.35)",
    },
    {
      id: "RE_VALIDATED",
      label: "RE-VALIDATED",
      desc: "Zod assertions 100% passed",
      icon: CheckCircle2,
      color: "#10b981",
      bg: "rgba(16, 185, 129, 0.12)",
      border: "rgba(16, 185, 129, 0.35)",
    }
  ];

  return (
    <div style={{
      background: "rgba(245, 158, 11, 0.04)",
      border: "1px solid rgba(245, 158, 11, 0.25)",
      borderRadius: "14px",
      padding: "1.1rem 1.35rem",
      display: "flex",
      flexDirection: "column",
      gap: "0.85rem",
      margin: "0.75rem 0"
    }}>
      {/* Header with Monospace Label */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.5rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <div style={{
            width: "8px",
            height: "8px",
            borderRadius: "50%",
            background: "#f59e0b",
            boxShadow: "0 0 10px #f59e0b"
          }} />
          <span style={{
            fontFamily: "var(--font-mono, monospace)",
            fontSize: "0.74rem",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            fontWeight: "700",
            color: "#f59e0b"
          }}>
            SELF-HEALING WORKFLOW RECOVERY
          </span>
        </div>

        <span style={{
          fontFamily: "var(--font-mono, monospace)",
          fontSize: "0.7rem",
          color: "var(--text-muted)",
          background: "rgba(255, 255, 255, 0.04)",
          padding: "0.2rem 0.6rem",
          borderRadius: "6px",
          border: "1px solid rgba(255, 255, 255, 0.08)"
        }}>
          TARGET: {sourceDomain}
        </span>
      </div>

      {/* Cause / Diagnostics Note */}
      <div style={{ fontSize: "0.8rem", color: "#d1d5db" }}>
        <span style={{ color: "var(--text-muted)" }}>Detected Anomaly: </span>
        <span style={{ fontFamily: "var(--font-mono, monospace)", color: "#fca5a5" }}>{errorType}</span>
      </div>

      {/* 4-Step Monospace Status Trail */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))",
        gap: "0.6rem",
        alignItems: "center"
      }}>
        {steps.map((st, idx) => {
          const Icon = st.icon;
          const isActive = true; // Shows completed recovery trail

          return (
            <div key={st.id} style={{
              background: st.bg,
              border: `1px solid ${st.border}`,
              borderRadius: "10px",
              padding: "0.65rem 0.85rem",
              display: "flex",
              flexDirection: "column",
              gap: "0.25rem",
              position: "relative"
            }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{
                  fontFamily: "var(--font-mono, monospace)",
                  fontSize: "0.72rem",
                  fontWeight: "700",
                  letterSpacing: "0.06em",
                  color: st.color
                }}>
                  {st.label}
                </span>
                <Icon style={{ width: "13px", height: "13px", color: st.color }} />
              </div>
              <span style={{ fontSize: "0.68rem", color: "var(--text-muted)", lineHeight: 1.3 }}>
                {st.desc}
              </span>
            </div>
          );
        })}
      </div>

      {/* Patched Dynamic Selector Callout */}
      {healedSelector && (
        <div style={{
          background: "rgba(0, 0, 0, 0.4)",
          border: "1px dashed rgba(245, 158, 11, 0.3)",
          borderRadius: "8px",
          padding: "0.5rem 0.85rem",
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          fontSize: "0.75rem"
        }}>
          <span style={{ color: "#f59e0b", fontWeight: "600", fontFamily: "var(--font-mono, monospace)" }}>
            PATCH:
          </span>
          <code style={{ color: "#93c5fd", fontFamily: "var(--font-mono, monospace)" }}>
            {healedSelector}
          </code>
        </div>
      )}
    </div>
  );
}
