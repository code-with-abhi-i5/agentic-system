import React, { useState, useMemo } from "react";
import {
  CheckCircle2,
  X,
  GripVertical,
  Eye,
  EyeOff,
  Pencil,
  Type,
  Hash,
  Link,
  Mail,
  Calendar,
  ToggleLeft,
  Sparkles,
  ArrowRight,
  AlertCircle,
  Shield,
} from "lucide-react";

const TYPE_OPTIONS = [
  { value: "string", label: "Text", icon: Type, color: "var(--text-muted)" },
  { value: "number", label: "Number", icon: Hash, color: "var(--cyan-primary)" },
  { value: "url", label: "URL", icon: Link, color: "#fff" },
  { value: "email", label: "Email", icon: Mail, color: "var(--purple-primary)" },
  { value: "date", label: "Date", icon: Calendar, color: "var(--amber-primary)" },
  { value: "boolean", label: "Boolean", icon: ToggleLeft, color: "var(--emerald-primary)" },
];

export default function SchemaReviewModal({
  isOpen,
  proposedSchema = [],
  sampleRecords = [],
  totalRecords = 0,
  datasetTitle = "",
  taskId = "",
  onConfirm,
  onClose,
}) {
  const [schema, setSchema] = useState(() =>
    proposedSchema.map((s) => ({ ...s, editing: false, newLabel: s.label }))
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewTab, setPreviewTab] = useState("schema"); // "schema" | "preview"

  // Sync schema if proposedSchema changes
  React.useEffect(() => {
    if (proposedSchema.length > 0) {
      setSchema(proposedSchema.map((s) => ({ ...s, editing: false, newLabel: s.label })));
    }
  }, [proposedSchema]);

  const includedFields = useMemo(() => schema.filter((s) => s.included !== false), [schema]);

  const handleToggleInclude = (index) => {
    setSchema((prev) =>
      prev.map((s, i) =>
        i === index ? { ...s, included: !s.included } : s
      )
    );
  };

  const handleTypeChange = (index, newType) => {
    setSchema((prev) =>
      prev.map((s, i) =>
        i === index ? { ...s, type: newType } : s
      )
    );
  };

  const handleLabelEdit = (index) => {
    setSchema((prev) =>
      prev.map((s, i) =>
        i === index ? { ...s, editing: true, newLabel: s.label } : s
      )
    );
  };

  const handleLabelSave = (index) => {
    setSchema((prev) =>
      prev.map((s, i) =>
        i === index ? { ...s, label: s.newLabel || s.label, editing: false } : s
      )
    );
  };

  const handleLabelChange = (index, value) => {
    setSchema((prev) =>
      prev.map((s, i) =>
        i === index ? { ...s, newLabel: value } : s
      )
    );
  };

  const handleConfirm = async () => {
    setIsSubmitting(true);

    const approvedSchema = schema.map(({ editing, newLabel, ...rest }) => rest);
    const excludedFields = schema
      .filter((s) => s.included === false)
      .map((s) => s.field);

    try {
      await onConfirm({
        taskId,
        approvedSchema,
        fieldMappings: {},
        excludedFields,
      });
    } catch (err) {
      console.error("Schema confirmation failed:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const getTypeIcon = (type) => {
    const opt = TYPE_OPTIONS.find((t) => t.value === type);
    return opt || TYPE_OPTIONS[0];
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="schema-review-modal"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="schema-review-header">
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
              <Shield style={{ width: "22px", height: "22px" }} />
            </div>
            <div>
              <h2 style={{ fontSize: "1.15rem", fontWeight: "800", color: "#fff", margin: 0 }}>
                Schema Review & Editor
              </h2>
              <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", margin: 0 }}>
                Review AI-detected fields before saving • {totalRecords} records pending
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid var(--border-subtle)",
              borderRadius: "10px",
              padding: "0.5rem",
              cursor: "pointer",
              color: "var(--text-muted)",
              transition: "all 0.15s ease",
            }}
          >
            <X style={{ width: "18px", height: "18px" }} />
          </button>
        </div>

        {/* Dataset Title */}
        {datasetTitle && (
          <div style={{
            padding: "0.75rem 1.5rem",
            background: "rgba(6, 182, 212, 0.06)",
            borderBottom: "1px solid rgba(6, 182, 212, 0.15)",
            display: "flex",
            alignItems: "center",
            gap: "0.6rem",
            fontSize: "0.82rem",
          }}>
            <Sparkles style={{ width: "14px", height: "14px", color: "var(--cyan-primary)" }} />
            <span style={{ color: "var(--text-muted)" }}>Dataset:</span>
            <span style={{ color: "#fff", fontWeight: "700" }}>{datasetTitle}</span>
          </div>
        )}

        {/* Tab Switcher */}
        <div style={{
          display: "flex",
          padding: "0.5rem 1.5rem 0",
          gap: "0.25rem",
          borderBottom: "1px solid var(--border-subtle)",
        }}>
          {[
            { id: "schema", label: `Fields (${schema.length})` },
            { id: "preview", label: "Data Preview" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setPreviewTab(tab.id)}
              style={{
                padding: "0.65rem 1.1rem",
                fontSize: "0.85rem",
                fontWeight: "700",
                color: previewTab === tab.id ? "#fff" : "var(--text-muted)",
                background: "transparent",
                border: "none",
                borderBottom: previewTab === tab.id ? "2px solid #fff" : "2px solid transparent",
                cursor: "pointer",
                transition: "all 0.15s ease",
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="schema-review-body">
          {previewTab === "schema" ? (
            <div className="schema-fields-list">
              {schema.map((field, index) => {
                const typeInfo = getTypeIcon(field.type);
                const TypeIcon = typeInfo.icon;
                const isIncluded = field.included !== false;

                return (
                  <div
                    key={field.field}
                    className={`schema-field-row ${!isIncluded ? "excluded" : ""}`}
                  >
                    {/* Drag Handle */}
                    <div className="field-drag-handle">
                      <GripVertical style={{ width: "14px", height: "14px", color: "var(--text-subtle)" }} />
                    </div>

                    {/* Field Name */}
                    <div className="field-name-col">
                      <code style={{
                        fontSize: "0.78rem",
                        color: isIncluded ? "var(--cyan-primary)" : "var(--text-subtle)",
                        background: "rgba(6, 182, 212, 0.08)",
                        padding: "0.2rem 0.5rem",
                        borderRadius: "6px",
                        fontFamily: "var(--font-mono)",
                      }}>
                        {field.field}
                      </code>
                    </div>

                    {/* Label (Editable) */}
                    <div className="field-label-col">
                      {field.editing ? (
                        <input
                          type="text"
                          value={field.newLabel}
                          onChange={(e) => handleLabelChange(index, e.target.value)}
                          onBlur={() => handleLabelSave(index)}
                          onKeyDown={(e) => e.key === "Enter" && handleLabelSave(index)}
                          autoFocus
                          style={{
                            background: "rgba(7, 9, 14, 0.8)",
                            border: "1px solid #fff",
                            borderRadius: "8px",
                            padding: "0.35rem 0.6rem",
                            fontSize: "0.82rem",
                            color: "#fff",
                            width: "100%",
                            outline: "none",
                          }}
                        />
                      ) : (
                        <div
                          onClick={() => handleLabelEdit(index)}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.4rem",
                            cursor: "pointer",
                            fontSize: "0.85rem",
                            color: isIncluded ? "#e2e8f0" : "var(--text-subtle)",
                            fontWeight: "600",
                          }}
                        >
                          <span>{field.label}</span>
                          <Pencil style={{ width: "11px", height: "11px", color: "var(--text-subtle)", opacity: 0.6 }} />
                        </div>
                      )}
                    </div>

                    {/* Type Selector */}
                    <div className="field-type-col">
                      <div style={{ position: "relative", display: "inline-flex", alignItems: "center", gap: "0.4rem" }}>
                        <TypeIcon style={{ width: "14px", height: "14px", color: typeInfo.color }} />
                        <select
                          value={field.type}
                          onChange={(e) => handleTypeChange(index, e.target.value)}
                          style={{
                            background: "rgba(255,255,255,0.04)",
                            border: "1px solid var(--border-subtle)",
                            borderRadius: "8px",
                            padding: "0.3rem 0.6rem",
                            fontSize: "0.78rem",
                            color: isIncluded ? "#cbd5e1" : "var(--text-subtle)",
                            cursor: "pointer",
                            outline: "none",
                          }}
                        >
                          {TYPE_OPTIONS.map((opt) => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Fill Rate */}
                    <div className="field-fill-col">
                      <div style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.4rem",
                        fontSize: "0.75rem",
                        color: field.fillRate >= 80 ? "var(--emerald-primary)" : field.fillRate >= 50 ? "var(--amber-primary)" : "var(--rose-primary)",
                      }}>
                        <div style={{
                          width: "36px",
                          height: "4px",
                          background: "var(--bg-tertiary)",
                          borderRadius: "999px",
                          overflow: "hidden",
                        }}>
                          <div style={{
                            width: `${field.fillRate || 0}%`,
                            height: "100%",
                            background: field.fillRate >= 80 ? "var(--emerald-primary)" : field.fillRate >= 50 ? "var(--amber-primary)" : "var(--rose-primary)",
                            borderRadius: "999px",
                            transition: "width 0.3s ease",
                          }} />
                        </div>
                        <span style={{ fontWeight: "700", minWidth: "28px" }}>{field.fillRate || 0}%</span>
                      </div>
                    </div>

                    {/* Include Toggle */}
                    <div className="field-toggle-col">
                      <button
                        onClick={() => handleToggleInclude(index)}
                        style={{
                          width: "32px",
                          height: "32px",
                          borderRadius: "8px",
                          border: "1px solid",
                          borderColor: isIncluded ? "rgba(16, 185, 129, 0.4)" : "var(--border-subtle)",
                          background: isIncluded ? "rgba(16, 185, 129, 0.1)" : "rgba(255,255,255,0.03)",
                          color: isIncluded ? "var(--emerald-primary)" : "var(--text-subtle)",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          transition: "all 0.15s ease",
                        }}
                      >
                        {isIncluded ? (
                          <Eye style={{ width: "15px", height: "15px" }} />
                        ) : (
                          <EyeOff style={{ width: "15px", height: "15px" }} />
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* Data Preview Tab */
            <div style={{ overflowX: "auto" }}>
              <table style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: "0.8rem",
              }}>
                <thead>
                  <tr>
                    {includedFields.map((f) => (
                      <th
                        key={f.field}
                        style={{
                          padding: "0.75rem",
                          background: "rgba(13, 16, 23, 0.95)",
                          color: "var(--text-muted)",
                          fontWeight: "700",
                          fontSize: "0.72rem",
                          textTransform: "uppercase",
                          letterSpacing: "0.06em",
                          borderBottom: "1px solid var(--border-subtle)",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {f.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {sampleRecords.map((record, idx) => (
                    <tr key={idx}>
                      {includedFields.map((f) => (
                        <td
                          key={f.field}
                          style={{
                            padding: "0.7rem",
                            borderBottom: "1px solid var(--border-subtle)",
                            color: "#e2e8f0",
                            maxWidth: "200px",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {record[f.field] !== undefined ? String(record[f.field]) : "—"}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
              <div style={{
                padding: "0.75rem",
                textAlign: "center",
                fontSize: "0.78rem",
                color: "var(--text-subtle)",
                borderTop: "1px solid var(--border-subtle)",
              }}>
                Showing 3 sample records of {totalRecords} total
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="schema-review-footer">
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", fontSize: "0.78rem", color: "var(--text-muted)" }}>
            <AlertCircle style={{ width: "14px", height: "14px", color: "var(--amber-primary)" }} />
            <span>
              <strong style={{ color: "var(--emerald-primary)" }}>{includedFields.length}</strong> fields included •{" "}
              <strong style={{ color: "var(--text-subtle)" }}>{schema.length - includedFields.length}</strong> excluded
            </span>
          </div>

          <div style={{ display: "flex", gap: "0.75rem" }}>
            <button onClick={onClose} className="matte-nav-inactive" style={{ padding: "0.6rem 1.2rem", fontSize: "0.84rem", border: "1px solid rgba(255,255,255,0.1)", background: "transparent", borderRadius: "8px", cursor: "pointer", color: "#fff" }}>
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={isSubmitting || includedFields.length === 0}
              className="matte-btn-white"
              style={{ padding: "0.6rem 1.4rem", fontSize: "0.84rem" }}
            >
              {isSubmitting ? (
                <>
                  <span className="btn-spinner" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 style={{ width: "16px", height: "16px" }} />
                  <span>Approve & Save Dataset</span>
                  <ArrowRight style={{ width: "14px", height: "14px" }} />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
