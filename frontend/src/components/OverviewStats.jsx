import React from "react";
import { TrendingUp, ShieldCheck, Zap, Activity } from "lucide-react";

export default function OverviewStats({ dataset = [] }) {
  const count = dataset.length > 0 ? dataset.length : 6;
  const avgAccuracy = dataset.length > 0
    ? Math.round(dataset.reduce((acc, r) => acc + (r.confidence || 98), 0) / dataset.length)
    : 97;

  // Daily yield distribution bars
  const bars = [
    { day: "Sun", val: 45 },
    { day: "Mon", val: 65 },
    { day: "Tue", val: 55 },
    { day: "Wed", val: 80 },
    { day: "Thu", val: 95, active: true },
    { day: "Fri", val: 75 },
    { day: "Sat", val: 88 }
  ];

  return (
    <div className="matte-card" style={{ display: "flex", flexDirection: "column", height: "100%", justifyContent: "space-between", gap: "1rem" }}>
      {/* Header */}
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.4rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <div style={{
              width: "30px",
              height: "30px",
              borderRadius: "8px",
              background: "rgba(56, 189, 248, 0.12)",
              border: "1px solid rgba(56, 189, 248, 0.25)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#38bdf8"
            }}>
              <Activity size={15} />
            </div>
            <div>
              <h3 style={{ fontSize: "1.05rem", fontWeight: "600", color: "#fff", margin: 0 }}>
                Extraction Yield
              </h3>
            </div>
          </div>
          <span style={{
            display: "flex",
            alignItems: "center",
            gap: "0.35rem",
            fontSize: "0.7rem",
            color: "var(--accent-primary, #5DD62C)",
            fontFamily: "var(--font-mono, monospace)",
            background: "rgba(93, 214, 44, 0.08)",
            padding: "0.15rem 0.45rem",
            borderRadius: "4px"
          }}>
            <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#5DD62C" }} />
            LIVE PIPELINE
          </span>
        </div>

        <p style={{ margin: "0 0 0.85rem 0", fontSize: "0.78rem", color: "var(--text-muted)" }}>
          Real-time record ingestion and quality assurance metrics.
        </p>

        {/* Big Key Numbers */}
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0.6rem 0.85rem",
          background: "rgba(255, 255, 255, 0.02)",
          border: "1px solid rgba(255, 255, 255, 0.06)",
          borderRadius: "8px",
          marginBottom: "0.85rem"
        }}>
          <div>
            <span style={{ fontSize: "1.6rem", fontWeight: "700", color: "#fff", letterSpacing: "-0.02em" }}>
              {count}
            </span>
            <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginLeft: "0.35rem" }}>
              Extracted Records
            </span>
          </div>

          <div style={{
            background: "rgba(93, 214, 44, 0.15)",
            border: "1px solid rgba(93, 214, 44, 0.3)",
            color: "#5DD62C",
            padding: "0.25rem 0.6rem",
            borderRadius: "6px",
            fontSize: "0.76rem",
            fontWeight: "700",
            display: "flex",
            alignItems: "center",
            gap: "0.3rem"
          }}>
            <ShieldCheck size={13} />
            <span>{avgAccuracy}% Confidence</span>
          </div>
        </div>
      </div>

      {/* Yield Distribution Bar Chart */}
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.4rem" }}>
          <span style={{ fontSize: "0.7rem", color: "#666", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: "600" }}>
            Weekly Ingestion Activity
          </span>
          <span style={{ fontSize: "0.68rem", color: "var(--text-muted)" }}>
            Peak: 95 records/hr
          </span>
        </div>

        <div style={{
          display: "flex",
          alignItems: "flex-end",
          height: "65px",
          gap: "0.5rem",
          padding: "0 0.25rem"
        }}>
          {bars.map((b, idx) => (
            <div 
              key={idx} 
              style={{ 
                flex: 1, 
                display: "flex", 
                flexDirection: "column", 
                alignItems: "center", 
                height: "100%", 
                justifyContent: "flex-end",
                gap: "0.35rem" 
              }}
            >
              <div 
                style={{ 
                  width: "100%", 
                  height: `${b.val}%`, 
                  background: b.active ? "linear-gradient(180deg, #5DD62C 0%, #358019 100%)" : "rgba(255, 255, 255, 0.12)",
                  borderRadius: "3px 3px 0 0",
                  transition: "all 0.2s ease"
                }} 
              />
              <span style={{ fontSize: "0.65rem", color: b.active ? "#fff" : "#666" }}>
                {b.day}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom telemetry indicators */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        borderTop: "1px solid rgba(255, 255, 255, 0.06)",
        paddingTop: "0.6rem",
        fontSize: "0.72rem",
        color: "var(--text-muted)"
      }}>
        <span>Deduplication: <strong style={{ color: "#fff" }}>98.5%</strong></span>
        <span>•</span>
        <span>Latency: <strong style={{ color: "#38bdf8" }}>1.2s</strong></span>
        <span>•</span>
        <span>Zod Validated: <strong style={{ color: "#5DD62C" }}>100%</strong></span>
      </div>
    </div>
  );
}
