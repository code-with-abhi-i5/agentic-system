import React, { useState, useEffect } from "react";
import { Activity, ShieldCheck } from "lucide-react";
import LiveSwarmTracker from "./LiveSwarmTracker";
import OverviewStats from "./OverviewStats";

export default function SwarmTelemetryPanel({
  dataset = [],
  tasks = [],
  currentStep = 0,
  logs = [],
  isRunning = false
}) {
  const [activeTab, setActiveTab] = useState("swarm");

  // Automatically switch to swarm view when extraction starts
  useEffect(() => {
    if (isRunning) {
      setActiveTab("swarm");
    }
  }, [isRunning]);

  const recordCount = Array.isArray(dataset) ? dataset.length : 0;

  // Segmented Pill Control rendered cleanly inside the card header
  const headerTabs = (
    <div style={{
      display: "inline-flex",
      alignItems: "center",
      background: "rgba(255, 255, 255, 0.05)",
      border: "1px solid rgba(255, 255, 255, 0.1)",
      borderRadius: "6px",
      padding: "2px",
      gap: "2px"
    }}>
      <button
        type="button"
        onClick={() => setActiveTab("swarm")}
        title="View live sub-agent swarm pipeline"
        style={{
          padding: "0.22rem 0.55rem",
          fontSize: "0.72rem",
          fontWeight: "600",
          borderRadius: "4px",
          border: "none",
          background: activeTab === "swarm" ? "rgba(16, 185, 129, 0.22)" : "transparent",
          color: activeTab === "swarm" ? "#10b981" : "var(--text-muted)",
          display: "flex",
          alignItems: "center",
          gap: "0.35rem",
          cursor: "pointer",
          transition: "all 0.15s ease"
        }}
      >
        <ShieldCheck size={12} />
        <span>Swarm Pipeline</span>
        {isRunning && (
          <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#10b981", animation: "pulse 1.5s infinite" }} />
        )}
      </button>

      <button
        type="button"
        onClick={() => setActiveTab("yield")}
        title="View real-time extraction yield and QA stats"
        style={{
          padding: "0.22rem 0.55rem",
          fontSize: "0.72rem",
          fontWeight: "600",
          borderRadius: "4px",
          border: "none",
          background: activeTab === "yield" ? "rgba(56, 189, 248, 0.22)" : "transparent",
          color: activeTab === "yield" ? "#38bdf8" : "var(--text-muted)",
          display: "flex",
          alignItems: "center",
          gap: "0.35rem",
          cursor: "pointer",
          transition: "all 0.15s ease"
        }}
      >
        <Activity size={12} />
        <span>Yield & QA</span>
        {recordCount > 0 && (
          <span style={{
            background: "rgba(56, 189, 248, 0.25)",
            color: "#38bdf8",
            fontSize: "0.62rem",
            padding: "0.05rem 0.32rem",
            borderRadius: "3px",
            fontWeight: "700"
          }}>
            {recordCount}
          </span>
        )}
      </button>
    </div>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {activeTab === "swarm" ? (
        <LiveSwarmTracker
          currentStep={currentStep}
          logs={logs}
          isRunning={isRunning}
          headerActions={headerTabs}
        />
      ) : (
        <OverviewStats
          dataset={dataset}
          tasks={tasks}
          isRunning={isRunning}
          headerActions={headerTabs}
        />
      )}
    </div>
  );
}
