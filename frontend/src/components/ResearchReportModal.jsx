import React, { useState } from "react";
import {
  X,
  FileText,
  BarChart3,
  TrendingUp,
  Target,
  MapPin,
  Shield,
  Download,
  Copy,
  CheckCircle2,
  Sparkles,
  ArrowUpRight,
  Loader2,
  Globe,
  Lightbulb,
  AlertTriangle,
  Zap,
} from "lucide-react";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const REPORT_TYPES = [
  { id: "executive", label: "Executive Summary", icon: FileText, description: "C-level strategic insights & market overview" },
  { id: "technical", label: "Technical Analysis", icon: BarChart3, description: "Tech stacks, engineering trends & capabilities" },
  { id: "competitive", label: "Competitive Intel", icon: Target, description: "Market positioning & competitor analysis" },
];

const IMPACT_COLORS = {
  high: { bg: "rgba(244, 63, 94, 0.1)", border: "rgba(244, 63, 94, 0.3)", color: "var(--rose-primary)", label: "HIGH" },
  medium: { bg: "rgba(245, 158, 11, 0.1)", border: "rgba(245, 158, 11, 0.3)", color: "#fff", label: "MEDIUM" },
  low: { bg: "rgba(16, 185, 129, 0.1)", border: "rgba(16, 185, 129, 0.3)", color: "var(--emerald-primary)", label: "LOW" },
};

const PRIORITY_COLORS = {
  high: { bg: "rgba(244, 63, 94, 0.1)", border: "rgba(244, 63, 94, 0.3)", color: "var(--rose-primary)" },
  medium: { bg: "rgba(245, 158, 11, 0.1)", border: "rgba(245, 158, 11, 0.3)", color: "#fff" },
  low: { bg: "rgba(16, 185, 129, 0.1)", border: "rgba(16, 185, 129, 0.3)", color: "var(--emerald-primary)" },
};

export default function ResearchReportModal({ isOpen, onClose, datasetId, datasetTitle }) {
  const [reportType, setReportType] = useState("executive");
  const [report, setReport] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  const generateReport = async () => {
    if (!datasetId) return;
    setIsLoading(true);
    setError(null);
    setReport(null);

    try {
      const res = await fetch(`${API_BASE}/datasets/${datasetId}/report`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reportType }),
      });

      if (!res.ok) throw new Error(`Server returned status: ${res.status}`);
      const data = await res.json();

      if (data.success && data.data?.report) {
        setReport(data.data.report);
      } else {
        throw new Error("Invalid report response");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyReport = async () => {
    if (!report) return;

    const markdown = generateMarkdown(report);
    try {
      await navigator.clipboard.writeText(markdown);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      const textarea = document.createElement("textarea");
      textarea.value = markdown;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownloadMarkdown = () => {
    if (!report) return;

    const markdown = generateMarkdown(report);
    const blob = new Blob([markdown], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${(report.title || "report").replace(/[^a-zA-Z0-9_-]/g, "_")}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const generateMarkdown = (r) => {
    let md = `# ${r.title}\n\n`;
    md += `> Generated: ${new Date(r.generatedAt).toLocaleString()} | Type: ${r.reportType} | Records: ${r.totalRecords}\n\n`;
    md += `## Executive Summary\n\n${r.executiveSummary}\n\n`;

    if (r.keyFindings?.length) {
      md += `## Key Findings\n\n`;
      r.keyFindings.forEach((f, i) => {
        md += `### ${i + 1}. ${f.finding}\n\n${f.detail}\n\n**Impact**: ${f.impact}\n\n`;
      });
    }

    if (r.marketAnalysis) {
      md += `## Market Analysis\n\n${r.marketAnalysis}\n\n`;
    }

    if (r.trendInsights?.length) {
      md += `## Trend Insights\n\n`;
      r.trendInsights.forEach((t) => {
        md += `- **${t.trend}** (${t.direction}): ${t.description}\n`;
      });
      md += "\n";
    }

    if (r.recommendations?.length) {
      md += `## Recommendations\n\n`;
      r.recommendations.forEach((rec, i) => {
        md += `${i + 1}. **${rec.action}** (${rec.priority})\n   ${rec.rationale}\n\n`;
      });
    }

    return md;
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="report-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="report-modal-header">
          <div style={{ display: "flex", alignItems: "center", gap: "0.85rem" }}>
            <div style={{
              width: "44px",
              height: "44px",
              borderRadius: "14px",
              background: "rgba(255, 255, 255, 0.08)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
            }}>
              <FileText style={{ width: "22px", height: "22px" }} />
            </div>
            <div>
              <h2 style={{ fontSize: "1.15rem", fontWeight: "800", color: "#fff", margin: 0 }}>
                AI Research Report
              </h2>
              <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", margin: 0 }}>
                {datasetTitle || "Dataset"} • Powered by Groq AI
              </p>
            </div>
          </div>
          <button onClick={onClose} style={{
            background: "rgba(255,255,255,0.06)",
            border: "1px solid var(--border-subtle)",
            borderRadius: "10px",
            padding: "0.5rem",
            cursor: "pointer",
            color: "var(--text-muted)",
          }}>
            <X style={{ width: "18px", height: "18px" }} />
          </button>
        </div>

        {/* Body */}
        <div className="report-modal-body">
          {!report && !isLoading && (
            <>
              {/* Report Type Selector */}
              <div style={{ marginBottom: "1.5rem" }}>
                <h4 style={{ fontSize: "0.85rem", fontWeight: "700", color: "#fff", marginBottom: "0.75rem" }}>
                  Select Report Type
                </h4>
                <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
                  {REPORT_TYPES.map((rt) => {
                    const Icon = rt.icon;
                    const isSelected = reportType === rt.id;
                    return (
                      <button
                        key={rt.id}
                        onClick={() => setReportType(rt.id)}
                        style={{
                          flex: "1 1 150px",
                          display: "flex",
                          flexDirection: "column",
                          gap: "0.4rem",
                          padding: "1rem",
                          borderRadius: "14px",
                          border: `1px solid ${isSelected ? "#fff" : "var(--border-subtle)"}`,
                          background: isSelected ? "rgba(255, 255, 255, 0.05)" : "var(--bg-tertiary)",
                          cursor: "pointer",
                          transition: "all 0.15s ease",
                          textAlign: "left",
                        }}
                      >
                        <Icon style={{
                          width: "20px",
                          height: "20px",
                          color: isSelected ? "#fff" : "var(--text-muted)",
                        }} />
                        <span style={{
                          fontSize: "0.85rem",
                          fontWeight: "700",
                          color: isSelected ? "#fff" : "var(--text-muted)",
                        }}>
                          {rt.label}
                        </span>
                        <span style={{
                          fontSize: "0.72rem",
                          color: "var(--text-subtle)",
                        }}>
                          {rt.description}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Generate Button */}
              <button
                onClick={generateReport}
                disabled={!datasetId}
                className="matte-btn-white"
                style={{ width: "100%", padding: "0.85rem", fontSize: "0.92rem", justifyContent: "center" }}
              >
                <Sparkles style={{ width: "18px", height: "18px" }} />
                <span>Generate {REPORT_TYPES.find((r) => r.id === reportType)?.label}</span>
                <ArrowUpRight style={{ width: "16px", height: "16px" }} />
              </button>

              {error && (
                <div style={{
                  padding: "0.75rem 1rem",
                  borderRadius: "10px",
                  background: "rgba(244, 63, 94, 0.1)",
                  border: "1px solid rgba(244, 63, 94, 0.3)",
                  color: "var(--rose-primary)",
                  fontSize: "0.82rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  marginTop: "0.75rem",
                }}>
                  <AlertTriangle style={{ width: "16px", height: "16px", flexShrink: 0 }} />
                  <span>{error}</span>
                </div>
              )}
            </>
          )}

          {/* Loading State */}
          {isLoading && (
            <div style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "3rem 1rem",
              gap: "1.25rem",
            }}>
              <div style={{
                width: "64px",
                height: "64px",
                borderRadius: "18px",
                background: "linear-gradient(135deg, rgba(255, 255, 255, 0.08), rgba(6, 182, 212, 0.15))",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}>
                <Loader2 style={{ width: "32px", height: "32px", color: "#fff", animation: "spin 1.2s linear infinite" }} />
              </div>
              <div style={{ textAlign: "center" }}>
                <h4 style={{ fontSize: "1rem", fontWeight: "700", color: "#fff", marginBottom: "0.4rem" }}>
                  Generating Intelligence Report...
                </h4>
                <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", maxWidth: "360px" }}>
                  AI is analyzing your dataset, identifying patterns, and composing insights. This may take 15-30 seconds.
                </p>
              </div>
              <div className="report-loading-bar">
                <div className="report-loading-progress" />
              </div>
            </div>
          )}

          {/* Generated Report */}
          {report && !isLoading && (
            <div className="report-content">
              {/* Report Title */}
              <div style={{
                padding: "1.25rem",
                background: "linear-gradient(135deg, rgba(99, 102, 241, 0.08), rgba(6, 182, 212, 0.08))",
                borderRadius: "14px",
                border: "1px solid rgba(99, 102, 241, 0.2)",
                marginBottom: "1.5rem",
              }}>
                <h3 style={{ fontSize: "1.2rem", fontWeight: "800", color: "#fff", marginBottom: "0.4rem" }}>
                  {report.title}
                </h3>
                <div style={{ display: "flex", alignItems: "center", gap: "1rem", fontSize: "0.72rem", color: "var(--text-muted)", flexWrap: "wrap" }}>
                  <span>📅 {new Date(report.generatedAt).toLocaleDateString()}</span>
                  <span>📊 {report.totalRecords} records analyzed</span>
                  <span>🤖 {report.modelUsed}</span>
                  {report.dataQualityScore && (
                    <span className="badge badge-emerald" style={{ fontSize: "0.68rem" }}>
                      <Shield style={{ width: "11px", height: "11px" }} />
                      {report.dataQualityScore}% Quality
                    </span>
                  )}
                </div>
              </div>

              {/* Executive Summary */}
              <div className="report-section">
                <h4 className="report-section-title">
                  <Zap style={{ width: "16px", height: "16px", color: "#fff" }} />
                  Executive Summary
                </h4>
                <p style={{ fontSize: "0.88rem", color: "#cbd5e1", lineHeight: "1.75" }}>
                  {report.executiveSummary}
                </p>
              </div>

              {/* Key Findings */}
              {report.keyFindings?.length > 0 && (
                <div className="report-section">
                  <h4 className="report-section-title">
                    <Lightbulb style={{ width: "16px", height: "16px", color: "#fff" }} />
                    Key Findings
                  </h4>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                    {report.keyFindings.map((finding, idx) => {
                      const impact = IMPACT_COLORS[finding.impact] || IMPACT_COLORS.medium;
                      return (
                        <div
                          key={idx}
                          style={{
                            padding: "1rem",
                            borderRadius: "12px",
                            background: "var(--bg-tertiary)",
                            border: "1px solid var(--border-subtle)",
                          }}
                        >
                          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "0.75rem", marginBottom: "0.4rem" }}>
                            <span style={{ fontSize: "0.88rem", fontWeight: "700", color: "#fff" }}>
                              {idx + 1}. {finding.finding}
                            </span>
                            <span style={{
                              fontSize: "0.65rem",
                              fontWeight: "700",
                              padding: "0.15rem 0.5rem",
                              borderRadius: "999px",
                              background: impact.bg,
                              border: `1px solid ${impact.border}`,
                              color: impact.color,
                              whiteSpace: "nowrap",
                            }}>
                              {impact.label}
                            </span>
                          </div>
                          <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", lineHeight: "1.6", margin: 0 }}>
                            {finding.detail}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Geographic Distribution */}
              {report.geographicDistribution?.length > 0 && (
                <div className="report-section">
                  <h4 className="report-section-title">
                    <Globe style={{ width: "16px", height: "16px", color: "var(--cyan-primary)" }} />
                    Geographic Distribution
                  </h4>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                    {report.geographicDistribution.map((geo, idx) => (
                      <div key={idx} style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                        <MapPin style={{ width: "14px", height: "14px", color: "var(--cyan-primary)", flexShrink: 0 }} />
                        <span style={{ fontSize: "0.84rem", color: "#e2e8f0", minWidth: "120px", fontWeight: "600" }}>
                          {geo.region}
                        </span>
                        <div style={{ flex: 1, height: "6px", background: "var(--bg-tertiary)", borderRadius: "999px", overflow: "hidden" }}>
                          <div style={{
                            width: `${geo.percentage}%`,
                            height: "100%",
                            background: `linear-gradient(90deg, var(--cyan-primary), #fff)`,
                            borderRadius: "999px",
                            transition: "width 0.5s ease",
                          }} />
                        </div>
                        <span style={{ fontSize: "0.78rem", color: "var(--text-muted)", fontWeight: "700", minWidth: "50px", textAlign: "right" }}>
                          {geo.count} ({geo.percentage}%)
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Market Analysis */}
              {report.marketAnalysis && (
                <div className="report-section">
                  <h4 className="report-section-title">
                    <BarChart3 style={{ width: "16px", height: "16px", color: "var(--purple-primary)" }} />
                    Market Analysis
                  </h4>
                  <p style={{ fontSize: "0.88rem", color: "#cbd5e1", lineHeight: "1.75" }}>
                    {report.marketAnalysis}
                  </p>
                </div>
              )}

              {/* Trend Insights */}
              {report.trendInsights?.length > 0 && (
                <div className="report-section">
                  <h4 className="report-section-title">
                    <TrendingUp style={{ width: "16px", height: "16px", color: "var(--emerald-primary)" }} />
                    Trend Insights
                  </h4>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                    {report.trendInsights.map((trend, idx) => (
                      <div
                        key={idx}
                        style={{
                          padding: "0.85rem 1rem",
                          borderRadius: "10px",
                          background: "var(--bg-tertiary)",
                          border: "1px solid var(--border-subtle)",
                          display: "flex",
                          alignItems: "flex-start",
                          gap: "0.65rem",
                        }}
                      >
                        <TrendingUp style={{
                          width: "14px",
                          height: "14px",
                          color: trend.direction === "growing" ? "var(--emerald-primary)" : "var(--amber-primary)",
                          flexShrink: 0,
                          marginTop: "2px",
                        }} />
                        <div>
                          <span style={{ fontWeight: "700", color: "#fff", fontSize: "0.84rem" }}>
                            {trend.trend}
                          </span>
                          <p style={{ fontSize: "0.78rem", color: "var(--text-muted)", margin: "0.25rem 0 0 0", lineHeight: "1.5" }}>
                            {trend.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recommendations */}
              {report.recommendations?.length > 0 && (
                <div className="report-section">
                  <h4 className="report-section-title">
                    <Target style={{ width: "16px", height: "16px", color: "var(--rose-primary)" }} />
                    Strategic Recommendations
                  </h4>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                    {report.recommendations.map((rec, idx) => {
                      const priority = PRIORITY_COLORS[rec.priority] || PRIORITY_COLORS.medium;
                      return (
                        <div
                          key={idx}
                          style={{
                            padding: "1rem",
                            borderRadius: "12px",
                            background: "var(--bg-tertiary)",
                            borderLeft: `3px solid ${priority.color}`,
                            border: "1px solid var(--border-subtle)",
                          }}
                        >
                          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.3rem" }}>
                            <span style={{ fontSize: "0.88rem", fontWeight: "700", color: "#fff" }}>
                              {idx + 1}. {rec.action}
                            </span>
                          </div>
                          <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", margin: 0, lineHeight: "1.5" }}>
                            {rec.rationale}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        {report && (
          <div className="report-modal-footer">
            <button onClick={() => { setReport(null); setError(null); }} className="matte-nav-inactive" style={{ border: "1px solid rgba(255,255,255,0.1)", background: "transparent", color: "#fff",  padding: "0.6rem 1rem", fontSize: "0.82rem"  }}>
              <Sparkles style={{ width: "14px", height: "14px" }} />
              <span>New Report</span>
            </button>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <button onClick={handleCopyReport} className="matte-nav-inactive" style={{ border: "1px solid rgba(255,255,255,0.1)", background: "transparent", color: "#fff",  padding: "0.6rem 1rem", fontSize: "0.82rem"  }}>
                {copied ? (
                  <>
                    <CheckCircle2 style={{ width: "14px", height: "14px", color: "var(--emerald-primary)" }} />
                    <span style={{ color: "var(--emerald-primary)" }}>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy style={{ width: "14px", height: "14px" }} />
                    <span>Copy</span>
                  </>
                )}
              </button>
              <button onClick={handleDownloadMarkdown} className="matte-btn-white" style={{ padding: "0.6rem 1rem", fontSize: "0.82rem" }}>
                <Download style={{ width: "14px", height: "14px" }} />
                <span>Download .md</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
