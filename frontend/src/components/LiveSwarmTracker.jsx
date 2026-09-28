import React, { useState } from "react";
import { Search, Globe, ShieldCheck, Wrench, CheckCircle2, ChevronDown, ChevronUp, Lock, X } from "lucide-react";
import SelfHealingTimeline from "./SelfHealingTimeline";

export default function LiveSwarmTracker({ currentStep, isRunning }) {
  const [showHealingDetails, setShowHealingDetails] = useState(false);

  const activeAgents = [
    {
      name: "Tavily URL Scout",
      role: "Source Discovery",
      icon: Search,
      status: currentStep >= 2 ? (currentStep > 2 ? "Completed" : "Hunting") : "Queued",
      complianceBadge: "✓ COMPLIANT",
      badgeColor: "#10b981",
    },
    {
      name: "Puppeteer Cluster",
      role: "DOM Extraction",
      icon: Globe,
      status: currentStep >= 3 ? (currentStep > 3 ? "Completed" : "Extracting") : "Queued",
      complianceBadge: "✓ 8 REQ/S",
      badgeColor: "#f59e0b",
    },
    {
      name: "Vision Self-Healer",
      role: "DOM & Visual Recovery",
      icon: Wrench,
      status: currentStep >= 3 ? "Healed" : "Standby",
      complianceBadge: "✓ RESILIENT",
      badgeColor: "#38bdf8",
    },
    {
      name: "Zod Schema Guard",
      role: "Fuzzy Deduplication",
      icon: ShieldCheck,
      status: currentStep >= 4 ? (currentStep > 4 ? "Completed" : "Validating") : "Queued",
      complianceBadge: "✓ ASSERTED",
      badgeColor: "#10b981",
    }
  ];

  return (
    <div className="matte-card" style={{ display: "flex", flexDirection: "column", height: "100%", justifyContent: "space-between", gap: "0.85rem" }}>
      {/* Header */}
      <div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.4rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <div style={{
              width: "30px",
              height: "30px",
              borderRadius: "8px",
              background: "rgba(16, 185, 129, 0.12)",
              border: "1px solid rgba(16, 185, 129, 0.25)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#10b981"
            }}>
              <ShieldCheck size={16} />
            </div>
            <div>
              <h3 style={{ fontSize: "1.05rem", fontWeight: "600", color: "#fff", margin: 0 }}>
                Active LangGraph Swarm
              </h3>
            </div>
          </div>
          <span style={{
            fontFamily: "var(--font-mono, monospace)",
            fontSize: "0.66rem",
            fontWeight: "700",
            letterSpacing: "0.05em",
            color: "#10b981",
            background: "rgba(16, 185, 129, 0.1)",
            padding: "0.15rem 0.5rem",
            borderRadius: "4px",
            border: "1px solid rgba(16, 185, 129, 0.25)"
          }}>
            ETHICAL ENFORCED
          </span>
        </div>

        <p style={{ margin: "0 0 0.75rem 0", fontSize: "0.78rem", color: "var(--text-muted)" }}>
          Autonomous sub-agent swarm pipeline with ethical guardrails and self-healing.
        </p>

        {/* Ethical Guardrail Summary Bar */}
        <div style={{
          background: "rgba(255, 255, 255, 0.02)",
          border: "1px solid rgba(255, 255, 255, 0.06)",
          borderRadius: "8px",
          padding: "0.45rem 0.65rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          fontSize: "0.68rem",
          fontFamily: "var(--font-mono, monospace)",
          color: "var(--text-muted)"
        }}>
          <span style={{ color: "#10b981" }}>✓ ROBOTS.TXT: 100%</span>
          <span>•</span>
          <span style={{ color: "#f59e0b" }}>RATE: 8 REQ/S</span>
          <span>•</span>
          <span>0 BLOCKED</span>
        </div>
      </div>

      {/* Agents List */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.45rem" }}>
        {activeAgents.map((agent, i) => {
          const Icon = agent.icon;
          return (
            <div 
              key={i} 
              style={{ 
                display: "flex", 
                alignItems: "center", 
                justifyContent: "space-between",
                padding: "0.4rem 0.6rem",
                borderRadius: "6px",
                background: "rgba(255, 255, 255, 0.015)",
                border: "1px solid rgba(255, 255, 255, 0.03)"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.65rem" }}>
                <div style={{ 
                  padding: "0.3rem", 
                  borderRadius: "6px", 
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.05)"
                }}>
                  <Icon size={13} color="#aaa" />
                </div>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <span style={{ fontSize: "0.8rem", color: "#fff", fontWeight: "500", lineHeight: 1.2 }}>{agent.name}</span>
                  <span style={{ fontSize: "0.68rem", color: "#666" }}>{agent.role}</span>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                <span style={{
                  fontFamily: "var(--font-mono, monospace)",
                  fontSize: "0.64rem",
                  letterSpacing: "0.04em",
                  color: agent.badgeColor,
                  background: "rgba(255, 255, 255, 0.03)",
                  border: "1px solid rgba(255, 255, 255, 0.06)",
                  padding: "0.15rem 0.4rem",
                  borderRadius: "4px",
                  whiteSpace: "nowrap"
                }}>
                  {agent.complianceBadge}
                </span>

                <span 
                  style={{ 
                    padding: "0.18rem 0.5rem", 
                    fontSize: "0.68rem",
                    borderRadius: "4px",
                    background: "rgba(255, 255, 255, 0.05)",
                    color: agent.status === "Completed" || agent.status === "Healed" ? "#10b981" : "#aaa",
                    fontWeight: "500"
                  }}
                >
                  {agent.status}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Feature 1: Compact Self-Healing Telemetry Trigger */}
      <div style={{ borderTop: "1px solid rgba(255, 255, 255, 0.06)", paddingTop: "0.5rem" }}>
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "rgba(245, 158, 11, 0.06)",
          border: "1px solid rgba(245, 158, 11, 0.2)",
          borderRadius: "6px",
          padding: "0.45rem 0.65rem",
          fontSize: "0.72rem"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: "#f59e0b" }}>
            <Wrench size={12} />
            <span style={{ fontWeight: "600" }}>Self-Healing: Resilient</span>
          </div>
          <button
            onClick={() => setShowHealingDetails(true)}
            style={{
              background: "rgba(245, 158, 11, 0.15)",
              border: "1px solid rgba(245, 158, 11, 0.3)",
              color: "#f59e0b",
              borderRadius: "4px",
              padding: "0.2rem 0.55rem",
              fontSize: "0.7rem",
              cursor: "pointer",
              fontWeight: "600",
              transition: "all 0.15s ease"
            }}
          >
            View Trace
          </button>
        </div>

        {/* Modal Dialog for Self-Healing Telemetry Trail */}
        {showHealingDetails && (
          <div 
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 9999,
              background: "rgba(0, 0, 0, 0.78)",
              backdropFilter: "blur(8px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "1.5rem"
            }}
            onClick={() => setShowHealingDetails(false)}
          >
            <div 
              style={{
                maxWidth: "680px",
                width: "100%",
                background: "#12141a",
                border: "1px solid rgba(245, 158, 11, 0.35)",
                borderRadius: "16px",
                padding: "1.5rem",
                boxShadow: "0 25px 60px -15px rgba(0, 0, 0, 0.9)",
                color: "#fff"
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <Wrench size={16} color="#f59e0b" />
                  <h3 style={{ fontSize: "1.05rem", fontWeight: "700", margin: 0, color: "#fff" }}>
                    Self-Healing Telemetry Trace
                  </h3>
                </div>
                <button
                  onClick={() => setShowHealingDetails(false)}
                  style={{
                    background: "transparent",
                    border: "none",
                    color: "var(--text-muted)",
                    cursor: "pointer",
                    padding: "0.3rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                >
                  <X size={18} />
                </button>
              </div>

              <SelfHealingTimeline 
                sourceDomain="techcrunch.com / crunchbase.com"
                errorType="DOM Selector Drift (Sub-tree shifted)"
                healedSelector="div[data-testid='company-header'] ~ div.metrics"
                status="RE_VALIDATED"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
