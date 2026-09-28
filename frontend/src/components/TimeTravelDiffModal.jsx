import React, { useState, useEffect } from "react";
import { 
  GitBranch, 
  History, 
  Clock, 
  ArrowRight, 
  CheckCircle2, 
  AlertTriangle, 
  PlusCircle, 
  MinusCircle, 
  RefreshCw, 
  Calendar, 
  Globe, 
  Bell, 
  X, 
  TrendingUp, 
  Database,
  Filter
} from "lucide-react";
import { getDatasetDiff, getDatasetVersions, configureDatasetSchedule } from "../services/api";

export default function TimeTravelDiffModal({ datasetId, datasetTitle, isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState("diff"); // "diff" | "cron"
  const [filterType, setFilterType] = useState("ALL"); // "ALL" | "MUTATED" | "ADDED" | "REMOVED"
  const [loading, setLoading] = useState(false);
  const [diffData, setDiffData] = useState(null);
  const [versions, setVersions] = useState([]);
  const [selectedCompareVersionId, setSelectedCompareVersionId] = useState("");
  const [error, setError] = useState(null);

  // Swarm Cron Form State
  const [cronEnabled, setCronEnabled] = useState(false);
  const [cronFrequency, setCronFrequency] = useState("weekly");
  const [webhookUrl, setWebhookUrl] = useState("");
  const [savingSchedule, setSavingSchedule] = useState(false);
  const [scheduleStatusMessage, setScheduleStatusMessage] = useState("");

  // Load versions and diff on open or datasetId change
  useEffect(() => {
    if (!isOpen || !datasetId) return;

    const loadData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch versions history
        const vers = await getDatasetVersions(datasetId);
        setVersions(vers || []);

        // Default comparison with the most recent prior version if available
        const prior = vers.find((v) => !v.isCurrent);
        const compareWithId = prior ? prior.id : null;
        if (compareWithId) setSelectedCompareVersionId(compareWithId);

        // Fetch diff
        const diff = await getDatasetDiff(datasetId, compareWithId);
        setDiffData(diff);
      } catch (err) {
        console.error("Diff load error:", err);
        setError("Could not compute time-travel diff. Ensure historical versions exist.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [isOpen, datasetId]);

  // Handle comparative version change
  const handleVersionChange = async (verId) => {
    setSelectedCompareVersionId(verId);
    setLoading(true);
    setError(null);
    try {
      const diff = await getDatasetDiff(datasetId, verId || null);
      setDiffData(diff);
    } catch (err) {
      setError(err.message || "Failed to compare versions.");
    } finally {
      setLoading(false);
    }
  };

  // Handle saving Swarm Cron schedule
  const handleSaveSchedule = async (e) => {
    e.preventDefault();
    setSavingSchedule(true);
    setScheduleStatusMessage("");
    try {
      const res = await configureDatasetSchedule(datasetId, {
        enabled: cronEnabled,
        frequency: cronFrequency,
        webhookUrl
      });
      setScheduleStatusMessage(res.data?.message || "Schedule updated successfully!");
    } catch (err) {
      setScheduleStatusMessage(`Failed to update schedule: ${err.message}`);
    } finally {
      setSavingSchedule(false);
    }
  };

  if (!isOpen) return null;

  const summary = diffData?.summary || {
    addedCount: 0,
    removedCount: 0,
    mutatedCount: 0,
    unchangedCount: 0,
    driftPercentage: 0
  };

  // Filter records based on selected filter
  const recordsToDisplay = (diffData?.allRecordsWithDiff || []).filter((r) => {
    if (filterType === "ALL") return true;
    return r._diffType === filterType;
  });

  return (
    <div 
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(0, 0, 0, 0.78)",
        backdropFilter: "blur(10px)",
        padding: "1.5rem"
      }}
      onClick={onClose}
    >
      <div 
        style={{
          width: "100%",
          maxWidth: "1100px",
          maxHeight: "90vh",
          backgroundColor: "#111217",
          border: "1px solid rgba(255, 255, 255, 0.12)",
          borderRadius: "16px",
          display: "flex",
          flexDirection: "column",
          boxShadow: "0 25px 60px -15px rgba(0, 0, 0, 0.9), 0 0 40px rgba(56, 189, 248, 0.08)",
          overflow: "hidden",
          color: "#f3f4f6"
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{
          padding: "1.25rem 1.75rem",
          borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "linear-gradient(90deg, rgba(20, 22, 30, 0.9) 0%, rgba(17, 18, 23, 0.9) 100%)"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.85rem" }}>
            <div style={{
              width: "38px",
              height: "38px",
              borderRadius: "10px",
              background: "rgba(56, 189, 248, 0.12)",
              border: "1px solid rgba(56, 189, 248, 0.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#38bdf8"
            }}>
              <History style={{ width: "20px", height: "20px" }} />
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                <h2 style={{ fontSize: "1.15rem", fontWeight: "600", margin: 0, color: "#fff" }}>
                  AI Change Tracker
                </h2>
                <span style={{
                  padding: "0.15rem 0.5rem",
                  borderRadius: "999px",
                  fontSize: "0.72rem",
                  fontWeight: "600",
                  background: "rgba(56, 189, 248, 0.15)",
                  color: "#38bdf8",
                  border: "1px solid rgba(56, 189, 248, 0.3)"
                }}>
                  Time-Travel Delta
                </span>
              </div>
              <p style={{ margin: 0, fontSize: "0.82rem", color: "var(--text-muted)" }}>
                {datasetTitle || "Dataset Timeline & Drift Cross-Examination"}
              </p>
            </div>
          </div>

          {/* Tab Navigation & Close */}
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <div style={{
              display: "flex",
              background: "rgba(255, 255, 255, 0.04)",
              padding: "0.25rem",
              borderRadius: "10px",
              border: "1px solid rgba(255, 255, 255, 0.08)"
            }}>
              <button
                onClick={() => setActiveTab("diff")}
                style={{
                  background: activeTab === "diff" ? "rgba(56, 189, 248, 0.18)" : "transparent",
                  color: activeTab === "diff" ? "#38bdf8" : "var(--text-muted)",
                  border: activeTab === "diff" ? "1px solid rgba(56, 189, 248, 0.35)" : "none",
                  padding: "0.4rem 0.85rem",
                  borderRadius: "7px",
                  fontSize: "0.82rem",
                  fontWeight: "500",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.4rem"
                }}
              >
                <History style={{ width: "14px", height: "14px" }} />
                <span>Changes Explorer</span>
              </button>
              <button
                onClick={() => setActiveTab("cron")}
                style={{
                  background: activeTab === "cron" ? "rgba(245, 158, 11, 0.18)" : "transparent",
                  color: activeTab === "cron" ? "#f59e0b" : "var(--text-muted)",
                  border: activeTab === "cron" ? "1px solid rgba(245, 158, 11, 0.35)" : "none",
                  padding: "0.4rem 0.85rem",
                  borderRadius: "7px",
                  fontSize: "0.82rem",
                  fontWeight: "500",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.4rem"
                }}
              >
                <Clock style={{ width: "14px", height: "14px" }} />
                <span>Autonomous Swarm Cron</span>
              </button>
            </div>

            <button
              onClick={onClose}
              style={{
                background: "transparent",
                border: "none",
                color: "var(--text-muted)",
                cursor: "pointer",
                padding: "0.4rem",
                borderRadius: "8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <X style={{ width: "18px", height: "18px" }} />
            </button>
          </div>
        </div>

        {/* Modal Content Body */}
        <div style={{ flex: 1, overflowY: "auto", padding: "1.5rem" }}>
          {activeTab === "diff" ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              {/* Version Comparison Selector Bar */}
              <div style={{
                background: "rgba(255, 255, 255, 0.02)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                borderRadius: "12px",
                padding: "0.85rem 1.25rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: "1rem"
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.85rem" }}>
                  <span style={{ fontSize: "0.84rem", color: "var(--text-muted)" }}>Comparing:</span>
                  <div style={{
                    padding: "0.35rem 0.75rem",
                    borderRadius: "8px",
                    background: "rgba(56, 189, 248, 0.12)",
                    border: "1px solid rgba(56, 189, 248, 0.25)",
                    fontSize: "0.82rem",
                    fontWeight: "600",
                    color: "#38bdf8"
                  }}>
                    {diffData?.currentDataset ? `Current v${diffData.currentDataset.version || 1}` : "Current Version"}
                  </div>
                  <ArrowRight style={{ width: "14px", height: "14px", color: "var(--text-muted)" }} />
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <span style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>Against:</span>
                    <select
                      value={selectedCompareVersionId}
                      onChange={(e) => handleVersionChange(e.target.value)}
                      style={{
                        background: "#181a20",
                        color: "#fff",
                        border: "1px solid rgba(255, 255, 255, 0.15)",
                        borderRadius: "8px",
                        padding: "0.35rem 0.75rem",
                        fontSize: "0.82rem",
                        outline: "none"
                      }}
                    >
                      {versions.length > 0 ? (
                        versions
                          .filter((v) => !v.isCurrent)
                          .map((v) => (
                            <option key={v.id} value={v.id}>
                              v{v.version} — {new Date(v.createdAt).toLocaleDateString()} ({v.recordsCount} records)
                            </option>
                          ))
                      ) : (
                        <option value="">No historical version found (Initial snapshot)</option>
                      )}
                    </select>
                  </div>
                </div>

                {/* Drift Percentage Pill */}
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <TrendingUp style={{ width: "15px", height: "15px", color: summary.driftPercentage > 0 ? "#f59e0b" : "#10b981" }} />
                  <span style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>Total Drift:</span>
                  <span style={{
                    fontSize: "0.86rem",
                    fontWeight: "700",
                    color: summary.driftPercentage > 0 ? "#f59e0b" : "#10b981"
                  }}>
                    {summary.driftPercentage}%
                  </span>
                </div>
              </div>

              {/* 4 Stat Badges (Git Summary) */}
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "1rem"
              }}>
                {/* Added Card */}
                <div 
                  onClick={() => setFilterType(filterType === "ADDED" ? "ALL" : "ADDED")}
                  style={{
                    background: filterType === "ADDED" ? "rgba(16, 185, 129, 0.18)" : "rgba(16, 185, 129, 0.06)",
                    border: `1px solid ${filterType === "ADDED" ? "#10b981" : "rgba(16, 185, 129, 0.25)"}`,
                    borderRadius: "12px",
                    padding: "1rem",
                    cursor: "pointer",
                    transition: "all 0.18s ease"
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.4rem" }}>
                    <span style={{ fontSize: "0.8rem", color: "#10b981", fontWeight: "600" }}>🟢 Added</span>
                    <PlusCircle style={{ width: "16px", height: "16px", color: "#10b981" }} />
                  </div>
                  <div style={{ fontSize: "1.5rem", fontWeight: "700", color: "#fff" }}>
                    +{summary.addedCount}
                  </div>
                  <span style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>
                    New entities discovered
                  </span>
                </div>

                {/* Removed Card */}
                <div 
                  onClick={() => setFilterType(filterType === "REMOVED" ? "ALL" : "REMOVED")}
                  style={{
                    background: filterType === "REMOVED" ? "rgba(239, 68, 68, 0.18)" : "rgba(239, 68, 68, 0.06)",
                    border: `1px solid ${filterType === "REMOVED" ? "#ef4444" : "rgba(239, 68, 68, 0.25)"}`,
                    borderRadius: "12px",
                    padding: "1rem",
                    cursor: "pointer",
                    transition: "all 0.18s ease"
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.4rem" }}>
                    <span style={{ fontSize: "0.8rem", color: "#ef4444", fontWeight: "600" }}>🔴 Removed</span>
                    <MinusCircle style={{ width: "16px", height: "16px", color: "#ef4444" }} />
                  </div>
                  <div style={{ fontSize: "1.5rem", fontWeight: "700", color: "#fff" }}>
                    -{summary.removedCount}
                  </div>
                  <span style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>
                    Delisted or vanished entities
                  </span>
                </div>

                {/* Mutated Card */}
                <div 
                  onClick={() => setFilterType(filterType === "MUTATED" ? "ALL" : "MUTATED")}
                  style={{
                    background: filterType === "MUTATED" ? "rgba(245, 158, 11, 0.18)" : "rgba(245, 158, 11, 0.06)",
                    border: `1px solid ${filterType === "MUTATED" ? "#f59e0b" : "rgba(245, 158, 11, 0.25)"}`,
                    borderRadius: "12px",
                    padding: "1rem",
                    cursor: "pointer",
                    transition: "all 0.18s ease"
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.4rem" }}>
                    <span style={{ fontSize: "0.8rem", color: "#f59e0b", fontWeight: "600" }}>🟡 Mutated</span>
                    <AlertTriangle style={{ width: "16px", height: "16px", color: "#f59e0b" }} />
                  </div>
                  <div style={{ fontSize: "1.5rem", fontWeight: "700", color: "#fff" }}>
                    ~{summary.mutatedCount}
                  </div>
                  <span style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>
                    Attribute / funding modifications
                  </span>
                </div>

                {/* Unchanged Card */}
                <div 
                  onClick={() => setFilterType(filterType === "UNCHANGED" ? "ALL" : "UNCHANGED")}
                  style={{
                    background: filterType === "UNCHANGED" ? "rgba(148, 163, 184, 0.18)" : "rgba(255, 255, 255, 0.03)",
                    border: `1px solid ${filterType === "UNCHANGED" ? "#94a3b8" : "rgba(255, 255, 255, 0.1)"}`,
                    borderRadius: "12px",
                    padding: "1rem",
                    cursor: "pointer",
                    transition: "all 0.18s ease"
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.4rem" }}>
                    <span style={{ fontSize: "0.8rem", color: "#94a3b8", fontWeight: "600" }}>⚪ Unchanged</span>
                    <CheckCircle2 style={{ width: "16px", height: "16px", color: "#94a3b8" }} />
                  </div>
                  <div style={{ fontSize: "1.5rem", fontWeight: "700", color: "#fff" }}>
                    {summary.unchangedCount}
                  </div>
                  <span style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>
                    Consistent data records
                  </span>
                </div>
              </div>

              {/* Filter Tabs & Counter */}
              <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
                paddingBottom: "0.75rem",
                marginTop: "0.5rem"
              }}>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  {["ALL", "MUTATED", "ADDED", "REMOVED", "UNCHANGED"].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setFilterType(tab)}
                      style={{
                        background: filterType === tab ? "rgba(255, 255, 255, 0.12)" : "transparent",
                        border: filterType === tab ? "1px solid rgba(255, 255, 255, 0.25)" : "1px solid transparent",
                        color: filterType === tab ? "#fff" : "var(--text-muted)",
                        padding: "0.3rem 0.75rem",
                        borderRadius: "8px",
                        fontSize: "0.78rem",
                        fontWeight: "500",
                        cursor: "pointer"
                      }}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
                <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                  Showing {recordsToDisplay.length} records
                </span>
              </div>

              {/* Diff Records List */}
              {loading ? (
                <div style={{ padding: "3rem", textAlign: "center", color: "var(--text-muted)" }}>
                  <RefreshCw style={{ width: "24px", height: "24px", animation: "spin 1s linear infinite", margin: "0 auto 1rem auto" }} />
                  <p>Calculating fuzzy Levenshtein entity diffs...</p>
                </div>
              ) : recordsToDisplay.length === 0 ? (
                <div style={{
                  padding: "3rem",
                  textAlign: "center",
                  background: "rgba(255, 255, 255, 0.02)",
                  border: "1px dashed rgba(255, 255, 255, 0.1)",
                  borderRadius: "12px",
                  color: "var(--text-muted)"
                }}>
                  <CheckCircle2 style={{ width: "28px", height: "28px", color: "#10b981", margin: "0 auto 0.75rem auto" }} />
                  <p style={{ margin: 0, fontWeight: "500" }}>No records match the selected diff filter.</p>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                  {recordsToDisplay.map((rec, idx) => {
                    const diffType = rec._diffType;
                    const isAdded = diffType === "ADDED";
                    const isRemoved = diffType === "REMOVED";
                    const isMutated = diffType === "MUTATED";

                    let borderColor = "rgba(255, 255, 255, 0.08)";
                    let bgColor = "rgba(255, 255, 255, 0.02)";
                    let badgeLabel = "⚪ UNCHANGED";
                    let badgeColor = "#94a3b8";

                    if (isAdded) {
                      borderColor = "rgba(16, 185, 129, 0.4)";
                      bgColor = "rgba(16, 185, 129, 0.08)";
                      badgeLabel = "🟢 ADDED";
                      badgeColor = "#10b981";
                    } else if (isRemoved) {
                      borderColor = "rgba(239, 68, 68, 0.4)";
                      bgColor = "rgba(239, 68, 68, 0.08)";
                      badgeLabel = "🔴 REMOVED";
                      badgeColor = "#ef4444";
                    } else if (isMutated) {
                      borderColor = "rgba(245, 158, 11, 0.4)";
                      bgColor = "rgba(245, 158, 11, 0.08)";
                      badgeLabel = "🟡 MUTATED";
                      badgeColor = "#f59e0b";
                    }

                    return (
                      <div
                        key={idx}
                        style={{
                          background: bgColor,
                          border: `1px solid ${borderColor}`,
                          borderRadius: "10px",
                          padding: "0.9rem 1.15rem",
                          display: "flex",
                          flexDirection: "column",
                          gap: "0.6rem"
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                            <span style={{
                              fontSize: "0.72rem",
                              fontWeight: "700",
                              color: badgeColor,
                              padding: "0.15rem 0.5rem",
                              borderRadius: "4px",
                              background: "rgba(0, 0, 0, 0.3)"
                            }}>
                              {badgeLabel}
                            </span>
                            <span style={{
                              fontWeight: "600",
                              fontSize: "0.95rem",
                              color: isRemoved ? "#9ca3af" : "#fff",
                              textDecoration: isRemoved ? "line-through" : "none"
                            }}>
                              {rec.company || rec.name || rec.title || "Unknown Entity"}
                            </span>
                            {rec.location && (
                              <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
                                • {rec.location}
                              </span>
                            )}
                          </div>

                          <div style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>
                            {rec.founder || rec.author || ""}
                          </div>
                        </div>

                        {/* If Mutated, show exact attribute before & after diffs */}
                        {isMutated && rec._changes && rec._changes.length > 0 && (
                          <div style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "0.35rem",
                            marginTop: "0.3rem",
                            padding: "0.6rem 0.85rem",
                            background: "rgba(0, 0, 0, 0.35)",
                            borderRadius: "8px",
                            border: "1px solid rgba(245, 158, 11, 0.2)"
                          }}>
                            <div style={{ fontSize: "0.75rem", fontWeight: "600", color: "#f59e0b" }}>
                              Detected Field Mutations:
                            </div>
                            {rec._changes.map((change, cIdx) => (
                              <div 
                                key={cIdx} 
                                style={{ 
                                  display: "flex", 
                                  alignItems: "center", 
                                  gap: "0.5rem", 
                                  fontSize: "0.8rem",
                                  flexWrap: "wrap"
                                }}
                              >
                                <span style={{ color: "var(--text-muted)", textTransform: "capitalize", minWidth: "80px" }}>
                                  {change.field}:
                                </span>
                                <span style={{
                                  color: "#ef4444",
                                  background: "rgba(239, 68, 68, 0.15)",
                                  padding: "0.1rem 0.45rem",
                                  borderRadius: "4px",
                                  textDecoration: "line-through"
                                }}>
                                  {String(change.oldValue)}
                                </span>
                                <ArrowRight style={{ width: "12px", height: "12px", color: "var(--text-muted)" }} />
                                <span style={{
                                  color: "#10b981",
                                  background: "rgba(16, 185, 129, 0.15)",
                                  padding: "0.1rem 0.45rem",
                                  borderRadius: "4px",
                                  fontWeight: "600"
                                }}>
                                  {String(change.newValue)}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ) : (
            /* Autonomous Swarm Cron Configuration Tab */
            <form onSubmit={handleSaveSchedule} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              <div style={{
                background: "rgba(245, 158, 11, 0.08)",
                border: "1px solid rgba(245, 158, 11, 0.25)",
                borderRadius: "12px",
                padding: "1.1rem 1.35rem",
                display: "flex",
                alignItems: "flex-start",
                gap: "0.85rem"
              }}>
                <Clock style={{ width: "20px", height: "20px", color: "#f59e0b", flexShrink: 0, marginTop: "2px" }} />
                <div>
                  <h3 style={{ margin: "0 0 0.35rem 0", fontSize: "0.95rem", color: "#fff", fontWeight: "600" }}>
                    Autonomous Swarm Rescrape Schedule
                  </h3>
                  <p style={{ margin: 0, fontSize: "0.82rem", color: "#d1d5db", lineHeight: 1.5 }}>
                    Keep this dataset perpetually live. The autonomous agent swarm will revisit target sources, compute fresh diffs, and fire webhook alerts whenever market drift or new records are detected.
                  </p>
                </div>
              </div>

              {/* Enable Toggle Switch */}
              <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "1rem 1.25rem",
                background: "rgba(255, 255, 255, 0.02)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                borderRadius: "12px"
              }}>
                <div>
                  <div style={{ fontWeight: "600", fontSize: "0.9rem", color: "#fff" }}>
                    Enable Autonomous Background Rescrape
                  </div>
                  <div style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
                    Automates web crawls and schema alignment via background workers
                  </div>
                </div>

                <label style={{ position: "relative", display: "inline-block", width: "48px", height: "26px" }}>
                  <input
                    type="checkbox"
                    checked={cronEnabled}
                    onChange={(e) => setCronEnabled(e.target.checked)}
                    style={{ opacity: 0, width: 0, height: 0 }}
                  />
                  <span style={{
                    position: "absolute",
                    cursor: "pointer",
                    inset: 0,
                    backgroundColor: cronEnabled ? "#10b981" : "rgba(255, 255, 255, 0.2)",
                    transition: "0.3s",
                    borderRadius: "34px"
                  }}>
                    <span style={{
                      position: "absolute",
                      content: "",
                      height: "18px",
                      width: "18px",
                      left: cronEnabled ? "25px" : "4px",
                      bottom: "4px",
                      backgroundColor: "white",
                      transition: "0.3s",
                      borderRadius: "50%"
                    }} />
                  </span>
                </label>
              </div>

              {/* Cadence Selection */}
              <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                <label style={{ fontSize: "0.85rem", fontWeight: "600", color: "#e5e7eb" }}>
                  Rescrape Cadence:
                </label>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.85rem" }}>
                  {[
                    { id: "daily", label: "Daily", desc: "Every 24 hours at 00:00 UTC" },
                    { id: "weekly", label: "Weekly", desc: "Every Monday at 09:00 UTC" },
                    { id: "monthly", label: "Monthly", desc: "1st of every month" }
                  ].map((cad) => (
                    <div
                      key={cad.id}
                      onClick={() => setCronFrequency(cad.id)}
                      style={{
                        padding: "0.85rem",
                        borderRadius: "10px",
                        background: cronFrequency === cad.id ? "rgba(56, 189, 248, 0.15)" : "rgba(255, 255, 255, 0.02)",
                        border: `1px solid ${cronFrequency === cad.id ? "#38bdf8" : "rgba(255, 255, 255, 0.08)"}`,
                        cursor: "pointer",
                        transition: "0.15s ease"
                      }}
                    >
                      <div style={{ fontWeight: "600", fontSize: "0.85rem", color: cronFrequency === cad.id ? "#38bdf8" : "#fff" }}>
                        {cad.label}
                      </div>
                      <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>
                        {cad.desc}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Webhook Alert URL */}
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <label style={{ fontSize: "0.85rem", fontWeight: "600", color: "#e5e7eb", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                  <Bell style={{ width: "14px", height: "14px", color: "var(--text-muted)" }} />
                  <span>Webhook Notification URL (Optional):</span>
                </label>
                <input
                  type="url"
                  placeholder="https://hooks.slack.com/services/... or your API endpoint"
                  value={webhookUrl}
                  onChange={(e) => setWebhookUrl(e.target.value)}
                  style={{
                    background: "#181a20",
                    border: "1px solid rgba(255, 255, 255, 0.15)",
                    borderRadius: "8px",
                    padding: "0.65rem 0.95rem",
                    color: "#fff",
                    fontSize: "0.85rem",
                    outline: "none"
                  }}
                />
                <span style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>
                  Whenever market drift exceeds 5% or new records are added, a JSON payload is sent to this endpoint.
                </span>
              </div>

              {/* Anti-Cost / Safeguards Information */}
              <div style={{
                background: "rgba(56, 189, 248, 0.06)",
                border: "1px solid rgba(56, 189, 248, 0.2)",
                borderRadius: "10px",
                padding: "0.85rem 1.1rem",
                display: "flex",
                alignItems: "center",
                gap: "0.65rem"
              }}>
                <CheckCircle2 style={{ width: "16px", height: "16px", color: "#38bdf8", flexShrink: 0 }} />
                <span style={{ fontSize: "0.76rem", color: "#93c5fd" }}>
                  <strong>Cost Optimization Active:</strong> Automated ETag HTTP hashing skips LLM reprocessing if target web pages have not changed.
                </span>
              </div>

              {/* Status Message */}
              {scheduleStatusMessage && (
                <div style={{
                  padding: "0.75rem 1rem",
                  borderRadius: "8px",
                  background: scheduleStatusMessage.includes("Failed") ? "rgba(239, 68, 68, 0.15)" : "rgba(16, 185, 129, 0.15)",
                  color: scheduleStatusMessage.includes("Failed") ? "#ef4444" : "#10b981",
                  fontSize: "0.82rem",
                  fontWeight: "500"
                }}>
                  {scheduleStatusMessage}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={savingSchedule}
                style={{
                  background: "linear-gradient(135deg, #38bdf8 0%, #2563eb 100%)",
                  color: "#fff",
                  border: "none",
                  borderRadius: "10px",
                  padding: "0.75rem 1.5rem",
                  fontWeight: "600",
                  fontSize: "0.88rem",
                  cursor: savingSchedule ? "not-allowed" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.5rem"
                }}
              >
                {savingSchedule ? (
                  <>
                    <RefreshCw style={{ width: "16px", height: "16px", animation: "spin 1s linear infinite" }} />
                    <span>Saving Schedule...</span>
                  </>
                ) : (
                  <>
                    <Clock style={{ width: "16px", height: "16px" }} />
                    <span>Save Swarm Schedule</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
