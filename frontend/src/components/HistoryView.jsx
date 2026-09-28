import React, { useState, useEffect } from "react";
import { History, CheckCircle2, ArrowRight, Clock, Database, Globe, Filter, Sparkles, AlertCircle } from "lucide-react";
import { getBackendTasks } from "../services/api";

export default function HistoryView({ onLoadWorkflowDataset }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const data = await getBackendTasks();
        if (Array.isArray(data)) {
          setTasks(data);
        }
      } catch (err) {
        console.error("Failed to fetch task history:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {/* Header */}
      <div className="glass-panel" style={{ padding: "1.5rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <div style={{
            width: "36px",
            height: "36px",
            borderRadius: "10px",
            background: "rgba(255, 255, 255, 0.08)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff"
          }}>
            <History style={{ width: "18px", height: "18px" }} />
          </div>
          <div>
            <h2 style={{ fontSize: "1.15rem", fontWeight: "700", color: "#fff" }}>
              Autonomous Workflow Execution History
            </h2>
            <p style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
              Audit past data extraction runs, inspect collected datasets, and trace lineage
            </p>
          </div>
        </div>
      </div>

      {/* History Items List */}
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {loading ? (
          <div className="glass-panel" style={{ padding: "3rem", textAlign: "center", color: "var(--text-muted)" }}>
            <span style={{ fontSize: "0.85rem" }}>Loading execution history...</span>
          </div>
        ) : tasks.length === 0 ? (
          <div className="glass-panel" style={{
            padding: "3.5rem 2rem",
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "1rem"
          }}>
            <div style={{
              width: "48px",
              height: "48px",
              borderRadius: "14px",
              background: "rgba(255, 255, 255, 0.05)",
              border: "1px solid rgba(99, 102, 241, 0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff"
            }}>
              <Sparkles style={{ width: "24px", height: "24px" }} />
            </div>
            <div>
              <h3 style={{ fontSize: "1rem", fontWeight: "700", color: "#fff", marginBottom: "0.4rem" }}>
                No Workflow History Recorded Yet
              </h3>
              <p style={{ fontSize: "0.78rem", color: "var(--text-muted)", maxWidth: "420px", lineHeight: "1.5" }}>
                When you trigger data intelligence extractions in Mission Control, every pipeline run, agent log, and deduplicated record count will be audited here.
              </p>
            </div>
          </div>
        ) : (
          tasks.map((task) => {
            const taskId = task.taskId || task.id || `TASK-${task._id?.slice(-4)}`;
            const prompt = task.prompt || "Extraction Workflow";
            const status = task.status || "COMPLETED";
            const dateStr = task.createdAt ? new Date(task.createdAt).toLocaleString() : "Recent";
            const recordsCount = task.stats?.recordsCount ?? task.recordsCount ?? 0;
            const duplicatesRemoved = task.stats?.duplicatesRemoved ?? task.duplicatesRemoved ?? 0;
            const sourcesCount = task.stats?.sourcesCount ?? task.sourcesCount ?? 0;
            const duration = task.stats?.duration || task.duration || "N/A";

            return (
              <div
                key={taskId}
                className="glass-panel"
                style={{
                  padding: "1.35rem 1.5rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "1.5rem",
                  flexWrap: "wrap"
                }}
              >
                {/* Left: Task Info */}
                <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem", maxWidth: "650px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                    <span style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "0.75rem",
                      fontWeight: "700",
                      color: "var(--cyan-primary)",
                      background: "rgba(6, 182, 212, 0.1)",
                      padding: "0.2rem 0.5rem",
                      borderRadius: "6px"
                    }}>
                      {taskId}
                    </span>
                    <span className={`badge ${status === "COMPLETED" ? "badge-emerald" : "badge-indigo"}`}>
                      <CheckCircle2 style={{ width: "12px", height: "12px" }} />
                      <span>{status}</span>
                    </span>
                    <span style={{ fontSize: "0.72rem", color: "var(--text-subtle)", display: "flex", alignItems: "center", gap: "0.3rem" }}>
                      <Clock style={{ width: "11px", height: "11px" }} />
                      <span>{dateStr} ({duration})</span>
                    </span>
                  </div>

                  <h4 style={{ fontSize: "0.92rem", fontWeight: "600", color: "#fff", lineHeight: "1.4" }}>
                    "{prompt}"
                  </h4>

                  {/* Metrics row */}
                  <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginTop: "0.2rem", fontSize: "0.75rem", color: "var(--text-muted)" }}>
                    <span style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
                      <Database style={{ width: "13px", height: "13px", color: "#fff" }} />
                      <span><strong>{recordsCount}</strong> Records</span>
                    </span>
                    <span>•</span>
                    <span style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
                      <Filter style={{ width: "13px", height: "13px", color: "var(--amber-primary)" }} />
                      <span><strong>{duplicatesRemoved}</strong> Duplicates Filtered</span>
                    </span>
                    <span>•</span>
                    <span style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
                      <Globe style={{ width: "13px", height: "13px", color: "var(--cyan-primary)" }} />
                      <span><strong>{sourcesCount}</strong> Sources</span>
                    </span>
                  </div>
                </div>

                {/* Right: Load in Table Button */}
                <div>
                  <button
                    onClick={() => onLoadWorkflowDataset(task)}
                    className="matte-btn-white"
                    style={{ padding: "0.55rem 1rem", fontSize: "0.8rem" }}
                  >
                    <span>Explore Dataset</span>
                    <ArrowRight style={{ width: "14px", height: "14px" }} />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
