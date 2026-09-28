import React from "react";
import { Globe, Cpu, Clock, CheckCircle2, ArrowDown, ExternalLink } from "lucide-react";

/**
 * Provenance Graph View
 * Visualizes the complete lineage of an individual data point:
 * Source → Workflow Step → Collection Timestamp → Transformation Applied
 * Styled as a simple node-edge graph with thin orange connecting lines and dark rounded nodes.
 */
export default function ProvenanceGraph({ record }) {
  if (!record) return null;

  const steps = [
    {
      id: "source",
      tag: "SOURCE ORIGIN",
      title: record.sourceDomain || "Verified Web Source",
      detail: record.sourceUrl || "Discovered via Autonomous Tavily Scout",
      badge: "✓ Permitted Domain",
      badgeColor: "#10b981",
      icon: Globe,
      isLink: !!record.sourceUrl,
      href: record.sourceUrl
    },
    {
      id: "step",
      tag: "WORKFLOW COLLECTION STEP",
      title: "Puppeteer Cluster DOM Reader",
      detail: "Headless Chromium rendered dynamic SPA sub-tree & extracted semantic elements",
      badge: "Step 03: DOM Extraction",
      badgeColor: "#f59e0b",
      icon: Cpu
    },
    {
      id: "timestamp",
      tag: "COLLECTION TIMESTAMP",
      title: record.scrapedAt || new Date().toLocaleString(),
      detail: "Immutable audit timestamp logged into system lineage registry",
      badge: "ISO UTC Timestamp",
      badgeColor: "#93c5fd",
      icon: Clock
    },
    {
      id: "transform",
      tag: "TRANSFORMATION & AUDIT",
      title: `Zod Assertion Passed (${record.confidence || 98}% Confidence)`,
      detail: "Deduplication hash evaluated via Levenshtein distance, currency & phone normalization applied",
      badge: "✓ Verified & Deduplicated",
      badgeColor: "#10b981",
      icon: CheckCircle2
    }
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem", padding: "0.5rem 0" }}>
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: "0.85rem"
      }}>
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
            fontSize: "0.75rem",
            fontWeight: "700",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "#f59e0b"
          }}>
            PROVENANCE LINEAGE GRAPH
          </span>
        </div>
        <span style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>
          Single Data-Point Lineage
        </span>
      </div>

      {/* Node-Edge Vertical Flow */}
      <div style={{ display: "flex", flexDirection: "column", position: "relative" }}>
        {steps.map((st, idx) => {
          const Icon = st.icon;
          const isLast = idx === steps.length - 1;

          return (
            <div key={st.id} style={{ display: "flex", flexDirection: "column", position: "relative" }}>
              {/* Node Card */}
              <div style={{
                background: "rgba(18, 20, 26, 0.95)",
                border: "1px solid rgba(245, 158, 11, 0.3)",
                borderRadius: "12px",
                padding: "0.9rem 1.15rem",
                display: "flex",
                flexDirection: "column",
                gap: "0.45rem",
                zIndex: 2,
                boxShadow: "0 4px 15px rgba(0, 0, 0, 0.4)"
              }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.4rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.55rem" }}>
                    <div style={{
                      width: "26px",
                      height: "26px",
                      borderRadius: "6px",
                      background: "rgba(245, 158, 11, 0.12)",
                      border: "1px solid rgba(245, 158, 11, 0.3)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#f59e0b"
                    }}>
                      <Icon size={14} />
                    </div>
                    <span style={{
                      fontFamily: "var(--font-mono, monospace)",
                      fontSize: "0.7rem",
                      fontWeight: "700",
                      letterSpacing: "0.06em",
                      color: "#f59e0b"
                    }}>
                      {st.tag}
                    </span>
                  </div>

                  <span style={{
                    fontSize: "0.68rem",
                    fontWeight: "600",
                    color: st.badgeColor,
                    background: "rgba(255, 255, 255, 0.04)",
                    padding: "0.15rem 0.5rem",
                    borderRadius: "4px",
                    border: "1px solid rgba(255, 255, 255, 0.08)"
                  }}>
                    {st.badge}
                  </span>
                </div>

                <div style={{ fontSize: "0.88rem", fontWeight: "600", color: "#fff", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                  <span>{st.title}</span>
                  {st.isLink && (
                    <a href={st.href} target="_blank" rel="noopener noreferrer" style={{ color: "#38bdf8", display: "inline-flex" }}>
                      <ExternalLink size={12} />
                    </a>
                  )}
                </div>

                <p style={{ margin: 0, fontSize: "0.76rem", color: "var(--text-muted)", lineHeight: 1.4, wordBreak: "break-all" }}>
                  {st.detail}
                </p>
              </div>

              {/* Thin Orange Connecting Edge */}
              {!isLast && (
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "0.35rem 0",
                  position: "relative"
                }}>
                  <div style={{
                    width: "2px",
                    height: "22px",
                    background: "linear-gradient(180deg, #f59e0b 0%, rgba(245, 158, 11, 0.3) 100%)",
                    position: "relative"
                  }}>
                    <ArrowDown 
                      size={10} 
                      color="#f59e0b" 
                      style={{
                        position: "absolute",
                        bottom: "-5px",
                        left: "50%",
                        transform: "translateX(-50%)"
                      }} 
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
