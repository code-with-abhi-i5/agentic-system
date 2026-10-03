import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate, useLocation, useNavigate, useParams } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import TopHeader from "./components/TopHeader";
import OverviewStats from "./components/OverviewStats";
import PromptStudio from "./components/PromptStudio";
import LiveSwarmTracker from "./components/LiveSwarmTracker";
import SwarmTelemetryPanel from "./components/SwarmTelemetryPanel";
import DataTable from "./components/DataTable";
import SourceInspectorDrawer from "./components/SourceInspectorDrawer";
import ExportModal from "./components/ExportModal";
import HistoryView from "./components/HistoryView";
import GovernanceView from "./components/GovernanceView";
import SchemaReviewModal from "./components/SchemaReviewModal";
import AIChatPanel from "./components/AIChatPanel";
import DataLineageFlow from "./components/DataLineageFlow";
import ResearchReportModal from "./components/ResearchReportModal";
import { useAuth } from "./context/AuthContext";
import { getBackendDatasets, getBackendTasks, getDatasetRecords, launchBackendTask, confirmSchema, cancelBackendTask, deleteBackendDataset } from "./services/api";
import { calculateFreshness } from "./utils/freshness";
import confetti from "canvas-confetti";
import { Trash2 } from "lucide-react";

export default function App() {
  const { user, isAuthenticated } = useAuth();
  
  const location = useLocation();
  const navigate = useNavigate();
  
  // Derive activeTab from URL path
  const activeTab = location.pathname === "/" ? "mission-control" : location.pathname.substring(1);
  
  const setActiveTab = (tab) => {
    navigate(`/${tab}`);
  };
  const [dataset, setDataset] = useState([]);
  const [allDatasets, setAllDatasets] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [logs, setLogs] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [currentTaskId, setCurrentTaskId] = useState(null);
  const [inspectingRecord, setInspectingRecord] = useState(null);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isBackendConnected, setIsBackendConnected] = useState(false);

  // Feature 1: Schema Review State
  const [showSchemaReview, setShowSchemaReview] = useState(false);
  const [schemaReviewData, setSchemaReviewData] = useState(null);

  // Feature 2: AI Chat State
  const [showAIChat, setShowAIChat] = useState(false);
  const [currentDatasetId, setCurrentDatasetId] = useState(null);
  const [currentDatasetTitle, setCurrentDatasetTitle] = useState("");

  // Feature 3: Data Lineage State
  const [lineageData, setLineageData] = useState(null);

  // Feature 4: Research Report State
  const [showReportModal, setShowReportModal] = useState(false);

  // Sync with Backend on Mount
  const refreshBackendData = async () => {
    try {
      const backendDatasets = await getBackendDatasets();
      if (backendDatasets && backendDatasets.length > 0) {
        setIsBackendConnected(true);
        setAllDatasets(backendDatasets);
        // Load the most recent dataset's records for main table
        const latest = backendDatasets[0];
        setDataset(latest?.records || []);
        setCurrentDatasetId(latest?._id || null);
        setCurrentDatasetTitle(latest?.title || "");
        // Load lineage if available
        if (latest?.lineage) {
          setLineageData(latest.lineage);
        }
      } else {
        setIsBackendConnected(true);
      }

      const backendTasks = await getBackendTasks();
      if (backendTasks && Array.isArray(backendTasks)) {
        setTasks(backendTasks);
      }
    } catch (err) {
      console.warn("Backend not yet reachable:", err.message);
      setIsBackendConnected(false);
    }
  };

  useEffect(() => {
    refreshBackendData();
  }, [user]);

  // Autonomous Extraction calling real Backend SSE Task API
  const handleLaunchExtraction = async ({ prompt, maxRecords, strictDeduplication }) => {
    setIsRunning(true);
    setCurrentTaskId(null);
    setCurrentStep(1);
    setLineageData(null);

    const timeStr = new Date().toTimeString().split(" ")[0];
    setLogs([
      {
        time: timeStr,
        agent: "IntentAnalyzer",
        type: "info",
        msg: `Incoming prompt received: "${prompt.slice(0, 60)}...". Compiling dynamic Zod schema.`
      }
    ]);

    await launchBackendTask(
      { prompt, maxRecords, strictDeduplication },
      {
        onTaskCreated: (taskId) => {
          setCurrentTaskId(taskId);
        },
        onStatus: (status) => {
          if (status.includes("Planning")) setCurrentStep(1);
          else if (status.includes("Discovering") || status.includes("Tavily")) setCurrentStep(2);
          else if (status.includes("Scraping") || status.includes("Puppeteer") || status.includes("Extracting")) setCurrentStep(3);
          else if (status.includes("Deduplication") || status.includes("Validation")) setCurrentStep(4);
        },
        onLog: (log) => {
          if (log) setLogs((prev) => [...prev, log]);
        },
        onProgress: (progress) => {
          if (progress >= 85) setCurrentStep(5);
        },
        onDataset: (newDataset) => {
          if (newDataset?.records?.length) {
            setDataset((prev) => [...newDataset.records, ...prev]);
            setCurrentDatasetId(newDataset._id || null);
            setCurrentDatasetTitle(newDataset.title || "");
          }
        },
        // Feature 1: Schema Review Handler
        onSchemaReview: (data) => {
          setSchemaReviewData(data);
          setShowSchemaReview(true);
          setCurrentStep(5);
          setIsRunning(false);
          setLogs((prev) => [
            ...prev,
            {
              time: new Date().toTimeString().split(" ")[0],
              agent: "SchemaDetector",
              type: "success",
              msg: `Schema detected with ${data.proposedSchema?.length || 0} fields. Awaiting your review...`,
            },
          ]);
        },
        // Feature 3: Lineage Updates
        onLineageUpdate: (data) => {
          setLineageData((prev) => ({
            ...(prev || {}),
            [data.stage]: data.data,
          }));
        },
        onAwaitingConfirmation: () => {
          // SSE stream has ended, waiting for schema confirmation
          setIsRunning(false);
        },
        onDone: () => {
          setCurrentStep(5);
          setIsRunning(false);
          refreshBackendData();
          try {
            confetti({ particleCount: 60, spread: 70, origin: { y: 0.7 } });
          } catch (e) {}
        },
        onError: (err) => {
          setIsRunning(false);
          setLogs((prev) => [
            ...prev,
            {
              time: new Date().toTimeString().split(" ")[0],
              agent: "Engine",
              type: "error",
              msg: `Execution error: ${err.message}`
            }
          ]);
        }
      }
    );
  };

  const handleCancelExtraction = async () => {
    if (!currentTaskId) return;
    try {
      await cancelBackendTask(currentTaskId);
      setIsRunning(false);
      setLogs(prev => [...prev, {
        time: new Date().toTimeString().split(" ")[0],
        agent: "System",
        type: "error",
        msg: "Task execution cancelled by user."
      }]);
    } catch (e) {
      console.error("Cancel task failed", e);
    }
  };

  // Feature 1: Handle Schema Confirmation
  const handleSchemaConfirm = async ({ taskId, approvedSchema, fieldMappings, excludedFields }) => {
    try {
      const result = await confirmSchema(taskId, {
        approvedSchema,
        fieldMappings,
        excludedFields,
      });

      if (result.success && result.data?.dataset) {
        const newDataset = result.data.dataset;
        setDataset(newDataset.records || []);
        setCurrentDatasetId(newDataset._id || null);
        setCurrentDatasetTitle(newDataset.title || "");

        // Update lineage with storage stage
        if (newDataset.lineage) {
          setLineageData(newDataset.lineage);
        }

        setShowSchemaReview(false);
        setSchemaReviewData(null);

        // Refresh backend data
        refreshBackendData();

        // Confetti celebration
        try {
          confetti({ particleCount: 80, spread: 80, origin: { y: 0.6 } });
        } catch (e) {}

        setLogs((prev) => [
          ...prev,
          {
            time: new Date().toTimeString().split(" ")[0],
            agent: "Engine",
            type: "success",
            msg: `Dataset saved with ${newDataset.records?.length || 0} records and custom schema applied! 🎉`,
          },
        ]);
      }
    } catch (err) {
      console.error("Schema confirmation error:", err);
      setLogs((prev) => [
        ...prev,
        {
          time: new Date().toTimeString().split(" ")[0],
          agent: "Engine",
          type: "error",
          msg: `Schema confirmation failed: ${err.message}`,
        },
      ]);
    }
  };

  const handleSelectDataset = (ds) => {
    if (!ds) return;
    setCurrentDatasetId(ds._id);
    setCurrentDatasetTitle(ds.title || ds.prompt || "");
    if (ds.records && ds.records.length > 0) {
      setDataset(ds.records);
    }
    if (ds.lineage) {
      setLineageData(ds.lineage);
    }
  };

  const handleOpenAIChat = (meta) => {
    if (meta?.id) setCurrentDatasetId(meta.id);
    if (meta?.title) setCurrentDatasetTitle(meta.title);
    if (meta?.records && meta.records.length > 0) setDataset(meta.records);
    setShowAIChat(true);
  };

  const handleOpenReport = (meta) => {
    if (meta?.id) setCurrentDatasetId(meta.id);
    if (meta?.title) setCurrentDatasetTitle(meta.title);
    setShowReportModal(true);
  };

  const handleOpenExport = (meta) => {
    if (meta?.id) setCurrentDatasetId(meta.id);
    if (meta?.title) setCurrentDatasetTitle(meta.title);
    if (meta?.records && meta.records.length > 0) setDataset(meta.records);
    setIsExportModalOpen(true);
  };

  const handleLoadWorkflowDataset = (task) => {
    if (task.datasetId?.records?.length) {
      setDataset(task.datasetId.records);
      setCurrentDatasetId(task.datasetId._id || null);
      setCurrentDatasetTitle(task.datasetId.title || "");
      if (task.datasetId.lineage) {
        setLineageData(task.datasetId.lineage);
      }
    }
    setActiveTab("datasets");
  };

  const handleDeleteDataset = async (datasetId) => {
    if (!datasetId) return;
    try {
      await deleteBackendDataset(datasetId);

      // Remove from allDatasets in memory
      setAllDatasets((prev) => prev.filter((d) => String(d._id) !== String(datasetId) && String(d.id) !== String(datasetId)));

      // If active dataset is the one deleted, clear it
      if (String(currentDatasetId) === String(datasetId)) {
        setCurrentDatasetId(null);
        setCurrentDatasetTitle("");
        setDataset([]);
        setLineageData(null);
        setCurrentStep(0);
      }

      setLogs((prev) => [
        ...prev,
        {
          time: new Date().toTimeString().split(" ")[0],
          agent: "System",
          type: "info",
          msg: `Dataset deleted successfully from database.`,
        },
      ]);

      // If currently on the deleted dataset view, redirect back to datasets catalog
      if (location.pathname.startsWith(`/datasets/${datasetId}`)) {
        navigate("/datasets");
      }
    } catch (err) {
      console.error("Failed to delete dataset:", err);
      alert(`Could not delete dataset: ${err.message}`);
    }
  };


  return (
    <div className="app-container matte-bg" style={{ minHeight: "100vh", display: "flex", color: "#e5e5e5" }}>
      {/* 1. Left Navigation Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        datasetCount={allDatasets.length}
        taskCount={tasks.length}
        isBackendConnected={isBackendConnected}
        onGoToLanding={() => setCurrentView("landing")}
      />

      {/* 2. Main Viewport */}
      <div className="main-viewport">
        {/* Top Header */}
        <TopHeader
          activeTab={activeTab}
          onNewTaskClick={() => setActiveTab("mission-control")}
          onExportClick={() => setIsExportModalOpen(true)}
          onGoToLanding={() => setCurrentView("landing")}
        />

        {/* Content Area */}
        <main className="content-wrapper">
          <Routes>
            <Route path="/" element={<Navigate to="/mission-control" replace />} />
            
            {/* TAB 1: MISSION CONTROL (Prompt Studio + Live Swarm Tracker + Data Table) */}
            <Route path="/mission-control" element={
              <>
              {/* Grid Layout Top Section - 2-Column Responsive Layout */}
              <div className="matte-grid-layout">
                {/* Column 1: Prompt Studio */}
                <PromptStudio
                  onLaunchExtraction={handleLaunchExtraction}
                  onCancelExtraction={handleCancelExtraction}
                  isRunning={isRunning}
                />

                {/* Column 2: Swarm Engine & Yield Telemetry */}
                <SwarmTelemetryPanel
                  dataset={dataset}
                  tasks={tasks}
                  currentStep={currentStep}
                  logs={logs}
                  isRunning={isRunning}
                />
              </div>

              {/* Bottom Section: Data Table */}
              <div style={{ marginTop: "1rem", width: "100%" }}>
                <DataTable
                  dataset={dataset}
                  datasetId={currentDatasetId}
                  onInspectSource={(record) => setInspectingRecord(record)}
                  onExportClick={handleOpenExport}
                  onChatClick={handleOpenAIChat}
                  onReportClick={handleOpenReport}
                  onDeleteClick={handleDeleteDataset}
                />
              </div>
              </>
            } />

            {/* TAB 2: EXECUTIVE OVERVIEW */}
            <Route path="/overview" element={
              <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
              <OverviewStats dataset={dataset} tasks={tasks} isRunning={isRunning} />

              {(() => {
                const hasRecords = Array.isArray(dataset) && dataset.length > 0;
                const schemaConformanceRate = hasRecords
                  ? Math.round((dataset.filter((r) => r.company || r.title || r.name).length / dataset.length) * 100)
                  : 0;

                const totalDupesRemoved = Array.isArray(tasks)
                  ? tasks.reduce((sum, t) => sum + (t.stats?.duplicatesRemoved || 0), 0)
                  : 0;
                const totalRecordsIngested = Array.isArray(tasks)
                  ? tasks.reduce((sum, t) => sum + (t.stats?.recordsCount || 0), 0)
                  : dataset.length;
                const dedupEfficiency = (totalRecordsIngested + totalDupesRemoved) > 0
                  ? Math.round((totalRecordsIngested / (totalRecordsIngested + totalDupesRemoved)) * 100)
                  : (hasRecords ? 100 : 0);

                const verifiedSourcesCount = hasRecords
                  ? dataset.filter((r) => r.sourceUrl && (r.sourceUrl.startsWith("http://") || r.sourceUrl.startsWith("https://"))).length
                  : 0;
                const sourceVerificationRate = hasRecords
                  ? Math.round((verifiedSourcesCount / dataset.length) * 100)
                  : 0;

                return (
                  <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))",
                    gap: "1.5rem"
                  }}>
                    <div className="matte-card">
                      <h3 style={{ fontSize: "1.1rem", fontWeight: "600", color: "#fff", marginBottom: "0.5rem" }}>
                        Autonomous Scraping vs Manual Scrapers
                      </h3>
                      <p style={{ fontSize: "0.8rem", color: "#888", marginBottom: "1.5rem" }}>
                        How Cerkit AI eliminates workflow maintenance overhead
                      </p>
                      <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem", fontSize: "0.82rem" }}>
                        <div style={{ padding: "0.85rem 1rem", borderRadius: "8px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", color: "#ccc" }}>
                          ✓ <strong>Zero-Maintenance Scrapers:</strong> Vision Self-Healer repairs drifted DOM selectors automatically.
                        </div>
                        <div style={{ padding: "0.85rem 1rem", borderRadius: "8px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", color: "#ccc" }}>
                          ✓ <strong>Source Provenance:</strong> Every record is audited with live URL citations and corroboration scores.
                        </div>
                        <div style={{ padding: "0.85rem 1rem", borderRadius: "8px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", color: "#ccc" }}>
                          ✓ <strong>Live Telemetry:</strong> Managed <strong>{allDatasets.length}</strong> dataset(s) across <strong>{tasks.length}</strong> workflow execution(s).
                        </div>
                      </div>
                    </div>

                    <div className="matte-card">
                      <h3 style={{ fontSize: "1.1rem", fontWeight: "600", color: "#fff", marginBottom: "0.5rem" }}>
                        Data Cleanliness Guardrails
                      </h3>
                      <p style={{ fontSize: "0.8rem", color: "#888", marginBottom: "1.5rem" }}>
                        Live quality metrics computed from active dataset and task history
                      </p>
                      <div style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
                        <div>
                          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", marginBottom: "0.4rem" }}>
                            <span style={{ color: "#aaa" }}>Schema Conformance</span>
                            <span style={{ color: "#fff", fontWeight: "600" }}>
                              {hasRecords ? `${schemaConformanceRate}%` : "—"}
                            </span>
                          </div>
                          <div style={{ height: "5px", background: "rgba(255,255,255,0.08)", borderRadius: "999px", overflow: "hidden" }}>
                            <div style={{ width: `${hasRecords ? schemaConformanceRate : 0}%`, height: "100%", background: "#5DD62C", transition: "width 0.4s ease" }}></div>
                          </div>
                        </div>

                        <div>
                          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", marginBottom: "0.4rem" }}>
                            <span style={{ color: "#aaa" }}>Duplicate Elimination Rate</span>
                            <span style={{ color: "#fff", fontWeight: "600" }}>
                              {hasRecords 
                                ? (totalDupesRemoved > 0 ? `${totalDupesRemoved} removed (${dedupEfficiency}% clean)` : "100% Unique") 
                                : "—"}
                            </span>
                          </div>
                          <div style={{ height: "5px", background: "rgba(255,255,255,0.08)", borderRadius: "999px", overflow: "hidden" }}>
                            <div style={{ width: `${hasRecords ? dedupEfficiency : 0}%`, height: "100%", background: "#38bdf8", transition: "width 0.4s ease" }}></div>
                          </div>
                        </div>

                        <div>
                          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", marginBottom: "0.4rem" }}>
                            <span style={{ color: "#aaa" }}>Source Verification Completeness</span>
                            <span style={{ color: "#fff", fontWeight: "600" }}>
                              {hasRecords ? `${sourceVerificationRate}% (${verifiedSourcesCount}/${dataset.length} cited)` : "—"}
                            </span>
                          </div>
                          <div style={{ height: "5px", background: "rgba(255,255,255,0.08)", borderRadius: "999px", overflow: "hidden" }}>
                            <div style={{ width: `${hasRecords ? sourceVerificationRate : 0}%`, height: "100%", background: "#10b981", transition: "width 0.4s ease" }}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()}
              </div>
            } />

            {/* TAB 3: DATASETS EXPLORER */}
            <Route path="/datasets" element={
              <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                <div className="matte-card">
                  <h2 style={{ fontSize: "1.15rem", fontWeight: "600", color: "#fff", marginBottom: "0.25rem" }}>
                    Centralized Dataset Repository
                  </h2>
                  <p style={{ fontSize: "0.85rem", color: "#888" }}>
                    Search, filter, inspect provenance, and export your collected business intelligence
                  </p>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1rem" }}>
                  {allDatasets.map((ds) => (
                    <div 
                      key={ds._id} 
                      className="matte-card" 
                      style={{ cursor: "pointer", transition: "all 0.2s", display: "flex", flexDirection: "column", justifyContent: "space-between" }}
                      onClick={() => {
                        handleSelectDataset(ds);
                        navigate(`/datasets/${ds._id}`);
                      }}
                    >
                      <div>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "0.5rem", marginBottom: "0.5rem" }}>
                          <h3 style={{ fontSize: "1rem", color: "#fff", fontWeight: "600", margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", flex: 1 }}>
                            {ds.title || ds.prompt || "Untitled Dataset"}
                          </h3>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (window.confirm(`Are you sure you want to permanently delete "${ds.title || ds.prompt || "this dataset"}" from the database?`)) {
                                handleDeleteDataset(ds._id);
                              }
                            }}
                            title="Delete dataset permanently from database"
                            style={{
                              background: "rgba(239, 68, 68, 0.1)",
                              border: "1px solid rgba(239, 68, 68, 0.25)",
                              borderRadius: "6px",
                              color: "#ef4444",
                              padding: "0.35rem 0.5rem",
                              cursor: "pointer",
                              display: "inline-flex",
                              alignItems: "center",
                              justifyContent: "center",
                              transition: "all 0.15s ease"
                            }}
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", color: "#888", fontSize: "0.8rem", marginBottom: "0.75rem" }}>
                          <span>{new Date(ds.createdAt).toLocaleDateString()}</span>
                          {(() => {
                            const fresh = calculateFreshness(ds.createdAt);
                            return (
                              <span style={{
                                fontFamily: "var(--font-mono, monospace)",
                                fontSize: "0.7rem",
                                letterSpacing: "0.04em",
                                padding: "0.15rem 0.45rem",
                                borderRadius: "4px",
                                background: fresh.badgeColor,
                                color: fresh.textColor,
                                border: `1px solid ${fresh.isStale ? "rgba(245, 158, 11, 0.3)" : "rgba(255, 255, 255, 0.08)"}`
                              }}>
                                ● {fresh.label}
                              </span>
                            );
                          })()}
                          <span style={{ color: "var(--emerald-primary)", fontWeight: "600" }}>{ds.records?.length || 0} Records</span>
                        </div>
                      </div>
                      <div style={{ display: "flex", gap: "0.5rem" }}>
                        <button 
                          className="matte-btn-white" 
                          style={{ flex: 1, padding: "0.5rem", fontSize: "0.8rem" }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSelectDataset(ds);
                            navigate(`/datasets/${ds._id}`);
                          }}
                        >
                          View Data
                        </button>
                      </div>
                    </div>
                  ))}
                  {allDatasets.length === 0 && (
                     <div style={{ color: "#666", padding: "2rem", textAlign: "center", width: "100%", gridColumn: "1 / -1" }}>
                       No datasets generated yet. Run an extraction in Mission Control to start!
                     </div>
                  )}
                </div>
              </div>
            } />
            
            <Route path="/datasets/:id" element={
              <DatasetViewerRoute 
                allDatasets={allDatasets}
                onSelectDataset={handleSelectDataset}
                lineageData={lineageData}
                onInspectSource={setInspectingRecord}
                onExportClick={handleOpenExport}
                onChatClick={handleOpenAIChat}
                onReportClick={handleOpenReport}
                onDeleteDataset={handleDeleteDataset}
              />
            } />

            {/* TAB 4: WORKFLOW HISTORY */}
            <Route path="/history" element={
              <HistoryView onLoadWorkflowDataset={handleLoadWorkflowDataset} />
            } />

            {/* TAB 5: SOURCE GOVERNANCE */}
            <Route path="/governance" element={
              <GovernanceView />
            } />
          </Routes>
        </main>
      </div>

      {/* 3. Deep Source Inspector Slide-Over Drawer */}
      <SourceInspectorDrawer
        record={inspectingRecord}
        onClose={() => setInspectingRecord(null)}
      />

      {/* 4. Export Modal (CSV / Excel / JSON / Google Sheets) */}
      <ExportModal
        dataset={dataset}
        datasetId={currentDatasetId}
        datasetTitle={currentDatasetTitle}
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
      />

      {/* Feature 1: Schema Review Modal */}
      <SchemaReviewModal
        isOpen={showSchemaReview}
        proposedSchema={schemaReviewData?.proposedSchema || []}
        sampleRecords={schemaReviewData?.sampleRecords || []}
        totalRecords={schemaReviewData?.totalRecords || 0}
        datasetTitle={schemaReviewData?.datasetTitle || ""}
        taskId={schemaReviewData?.taskId || ""}
        onConfirm={handleSchemaConfirm}
        onClose={() => {
          setShowSchemaReview(false);
          setSchemaReviewData(null);
        }}
      />

      {/* Feature 2: AI Chat Panel */}
      <AIChatPanel
        isOpen={showAIChat}
        onClose={() => setShowAIChat(false)}
        datasetId={currentDatasetId}
        datasetTitle={currentDatasetTitle}
        totalRecords={dataset.length}
      />

      {/* Feature 4: Research Report Modal */}
      <ResearchReportModal
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        datasetId={currentDatasetId}
        datasetTitle={currentDatasetTitle}
      />

    </div>
  );
}
function DatasetViewerRoute({
  allDatasets = [],
  onSelectDataset,
  lineageData,
  onInspectSource,
  onExportClick,
  onChatClick,
  onReportClick,
  onDeleteDataset,
}) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeMeta, setActiveMeta] = useState(null);

  useEffect(() => {
    if (!id) return;
    const found = (allDatasets || []).find((d) => d._id === id);
    if (found) {
      setActiveMeta(found);
      if (onSelectDataset) onSelectDataset(found);
    } else {
      getDatasetRecords(id, { page: 1, limit: 1 }).then((res) => {
        if (res?.title || res?.datasetId) {
          const meta = { _id: res.datasetId || id, title: res.title, prompt: res.prompt, records: res.records };
          setActiveMeta(meta);
          if (onSelectDataset) onSelectDataset(meta);
        }
      }).catch(() => {});
    }
  }, [id, allDatasets]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      <button 
        onClick={() => navigate("/datasets")} 
        className="matte-nav-inactive" 
        style={{ width: "fit-content", padding: "0.5rem 1rem", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", cursor: "pointer", background: "transparent", color: "#fff" }}
      >
        ← Back to Repositories
      </button>
      <DataLineageFlow lineage={activeMeta?.lineage || lineageData} isVisible={!!(activeMeta?.lineage || lineageData)} />
      <DataTable
        datasetId={id}
        onInspectSource={onInspectSource}
        onExportClick={(meta) => onExportClick({ id, title: activeMeta?.title, ...meta })}
        onChatClick={(meta) => onChatClick({ id, title: activeMeta?.title, ...meta })}
        onReportClick={(meta) => onReportClick({ id, title: activeMeta?.title, ...meta })}
        onDeleteClick={onDeleteDataset}
      />
    </div>
  );
}
