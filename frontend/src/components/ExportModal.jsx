import React, { useState } from "react";
import { X, FileSpreadsheet, FileCode, FileText, Download, CheckCircle2 } from "lucide-react";
import confetti from "canvas-confetti";

export default function ExportModal({ dataset = [], datasetId, datasetTitle, isOpen, onClose }) {
  if (!isOpen) return null;

  const [selectedFormat, setSelectedFormat] = useState("csv");
  const [isExporting, setIsExporting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleDownload = () => {
    setIsExporting(true);

    setTimeout(() => {
      let content = "";
      let filename = `kortex_dataset_${Date.now()}`;
      let mimeType = "text/plain";

      if (selectedFormat === "csv") {
        const headers = ["Company", "Founder", "Role", "Email", "Location", "Funding", "TechStack", "Confidence", "SourceUrl"];
        const rows = dataset.map((d) => [
          `"${d.company || d.name || ''}"`,
          `"${d.founder || d.author || ''}"`,
          `"${d.role || ''}"`,
          `"${d.email || ''}"`,
          `"${d.location || ''}"`,
          `"${d.funding || ''}"`,
          `"${d.techStack || d.category || ''}"`,
          `"${d.confidence || 98}%"`,
          `"${d.sourceUrl || ''}"`
        ]);
        content = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
        filename += ".csv";
        mimeType = "text/csv;charset=utf-8;";
      } else if (selectedFormat === "json") {
        content = JSON.stringify(dataset, null, 2);
        filename += ".json";
        mimeType = "application/json;charset=utf-8;";
      } else {
        // Excel CSV fallback with tab separation
        const headers = ["Company\tFounder\tRole\tEmail\tLocation\tFunding\tTechStack\tConfidence\tSourceUrl"];
        const rows = dataset.map((d) =>
          `${d.company || d.name || ''}\t${d.founder || d.author || ''}\t${d.role || ''}\t${d.email || ''}\t${d.location || ''}\t${d.funding || ''}\t${d.techStack || d.category || ''}\t${d.confidence || 98}%\t${d.sourceUrl || ''}`
        );
        content = [headers, ...rows].join("\n");
        filename += ".xls";
        mimeType = "application/vnd.ms-excel";
      }

      // Trigger browser download
      const blob = new Blob([content], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Celebration Confetti!
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (err) { }

      setIsExporting(false);
      setSuccess(true);

      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 1500);
    }, 600);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
            <div style={{
              width: "32px",
              height: "32px",
              borderRadius: "8px",
              background: "rgba(255, 255, 255, 0.08)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff"
            }}>
              <Download style={{ width: "16px", height: "16px" }} />
            </div>
            <div>
              <h3 style={{ fontSize: "1rem", fontWeight: "700", color: "#fff" }}>
                Export Structured Dataset
              </h3>
              <p style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>
                {datasetTitle ? `${datasetTitle} • ` : ""}{dataset?.length || 0} cleaned & source-backed records
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="matte-nav-inactive"
            style={{ border: "1px solid rgba(255,255,255,0.1)", background: "transparent", color: "#fff", width: "30px", height: "30px", padding: 0, borderRadius: "8px" }}
          >
            <X style={{ width: "15px", height: "15px" }} />
          </button>
        </div>

        {/* Body */}
        <div className="modal-body">
          <label style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: "700", textTransform: "uppercase" }}>
            SELECT EXPORT DESTINATION:
          </label>


          {/* Option: CSV */}
          <div
            onClick={() => setSelectedFormat("csv")}
            className="export-option-card"
            style={{
              borderColor: selectedFormat === "csv" ? "#fff" : "var(--border-subtle)",
              background: selectedFormat === "csv" ? "rgba(255, 255, 255, 0.05)" : "var(--bg-tertiary)"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.85rem" }}>
              <FileSpreadsheet style={{ width: "22px", height: "22px", color: "var(--emerald-primary)" }} />
              <div>
                <span style={{ fontSize: "0.88rem", fontWeight: "700", color: "#fff", display: "block" }}>
                  CSV (Comma Separated)
                </span>
                <span style={{ fontSize: "0.72rem", color: "var(--text-subtle)" }}>
                  Ideal for Pandas, Excel, or CRM database imports
                </span>
              </div>
            </div>
            <span style={{
              width: "18px",
              height: "18px",
              borderRadius: "50%",
              border: "2px solid",
              borderColor: selectedFormat === "csv" ? "#fff" : "var(--border-medium)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: selectedFormat === "csv" ? "#fff" : "transparent"
            }}>
              {selectedFormat === "csv" && <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#fff" }}></span>}
            </span>
          </div>

          {/* Option: Excel */}
          <div
            onClick={() => setSelectedFormat("excel")}
            className="export-option-card"
            style={{
              borderColor: selectedFormat === "excel" ? "#fff" : "var(--border-subtle)",
              background: selectedFormat === "excel" ? "rgba(255, 255, 255, 0.05)" : "var(--bg-tertiary)"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.85rem" }}>
              <FileText style={{ width: "22px", height: "22px", color: "var(--cyan-primary)" }} />
              <div>
                <span style={{ fontSize: "0.88rem", fontWeight: "700", color: "#fff", display: "block" }}>
                  Excel Spreadsheet (.xls)
                </span>
                <span style={{ fontSize: "0.72rem", color: "var(--text-subtle)" }}>
                  Pre-formatted Microsoft Excel workbook with column headers
                </span>
              </div>
            </div>
            <span style={{
              width: "18px",
              height: "18px",
              borderRadius: "50%",
              border: "2px solid",
              borderColor: selectedFormat === "excel" ? "#fff" : "var(--border-medium)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: selectedFormat === "excel" ? "#fff" : "transparent"
            }}>
              {selectedFormat === "excel" && <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#fff" }}></span>}
            </span>
          </div>

          {/* Option: JSON */}
          <div
            onClick={() => setSelectedFormat("json")}
            className="export-option-card"
            style={{
              borderColor: selectedFormat === "json" ? "#fff" : "var(--border-subtle)",
              background: selectedFormat === "json" ? "rgba(255, 255, 255, 0.05)" : "var(--bg-tertiary)"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.85rem" }}>
              <FileCode style={{ width: "22px", height: "22px", color: "var(--amber-primary)" }} />
              <div>
                <span style={{ fontSize: "0.88rem", fontWeight: "700", color: "#fff", display: "block" }}>
                  JSON (Raw Structured Data)
                </span>
                <span style={{ fontSize: "0.72rem", color: "var(--text-subtle)" }}>
                  Full payload with nested source metadata & confidence
                </span>
              </div>
            </div>
            <span style={{
              width: "18px",
              height: "18px",
              borderRadius: "50%",
              border: "2px solid",
              borderColor: selectedFormat === "json" ? "#fff" : "var(--border-medium)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: selectedFormat === "json" ? "#fff" : "transparent"
            }}>
              {selectedFormat === "json" && <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#fff" }}></span>}
            </span>
          </div>

          {/* Actions */}
          <div style={{ marginTop: "1rem", display: "flex", justifyContent: "flex-end", gap: "0.75rem" }}>
            <button onClick={onClose} className="matte-nav-inactive">
              Cancel
            </button>
            <button
              onClick={handleDownload}
              disabled={isExporting || success}
              className="matte-btn-white"
              style={{
                minWidth: "160px",
                background: "#fff",
                color: "#000",
                fontWeight: "700"
              }}
            >
              {success ? (
                <>
                  <CheckCircle2 style={{ width: "16px", height: "16px" }} />
                  <span>Downloaded!</span>
                </>
              ) : isExporting ? (
                <span>Generating...</span>
              ) : (
                <>
                  <Download style={{ width: "16px", height: "16px" }} />
                  <span>Download File</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

