import React, { useState } from "react";
import { Sparkles, Terminal, ArrowRight, Zap } from "lucide-react";

export default function PromptStudio({ onLaunchExtraction, onCancelExtraction, isRunning }) {
  const [prompt, setPrompt] = useState("");

  const presetSuggestions = [
    "Top Indian AI Startups (Funding & Valuation)",
    "Series A B2B SaaS Founders in US",
    "European Climate Tech Unicorns"
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!prompt.trim() || isRunning) return;
    onLaunchExtraction({
      prompt: prompt || "Find top 50 AI Startups in Bangalore...",
      maxRecords: 50,
      strictDeduplication: true
    });
  };

  const handleSelectPreset = (text) => {
    setPrompt(text);
  };

  return (
    <div className="matte-card" style={{ display: "flex", flexDirection: "column", height: "100%", justifyContent: "space-between", gap: "1rem" }}>
      {/* Top Header Block */}
      <div>
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "0.85rem"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
            <div style={{
              width: "30px",
              height: "30px",
              borderRadius: "8px",
              background: "rgba(93, 214, 44, 0.12)",
              border: "1px solid rgba(93, 214, 44, 0.25)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--accent-primary, #5DD62C)"
            }}>
              <Terminal size={15} />
            </div>
            <h3 style={{ fontSize: "1.05rem", fontWeight: "600", color: "#fff", margin: 0 }}>
              Autonomous Extraction
            </h3>
          </div>
          <span style={{
            fontFamily: "var(--font-mono, monospace)",
            fontSize: "0.68rem",
            color: "var(--text-muted)",
            background: "rgba(255, 255, 255, 0.04)",
            padding: "0.15rem 0.5rem",
            borderRadius: "4px",
            border: "1px solid rgba(255, 255, 255, 0.06)"
          }}>
            LANGGRAPH DAG
          </span>
        </div>

        <p style={{ fontSize: "0.78rem", color: "var(--text-muted)", margin: "0 0 0.85rem 0", lineHeight: 1.45 }}>
          Natural language prompt to live multi-source web extraction with schema synthesis.
        </p>

        {/* Preset Prompt Pills */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
          <span style={{ fontSize: "0.7rem", color: "#666", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Suggested Prompts:
          </span>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
            {presetSuggestions.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectPreset(p)}
                style={{
                  background: prompt === p ? "rgba(93, 214, 44, 0.12)" : "rgba(255, 255, 255, 0.02)",
                  border: `1px solid ${prompt === p ? "rgba(93, 214, 44, 0.3)" : "rgba(255, 255, 255, 0.06)"}`,
                  borderRadius: "6px",
                  padding: "0.35rem 0.65rem",
                  fontSize: "0.74rem",
                  color: prompt === p ? "#fff" : "var(--text-muted)",
                  textAlign: "left",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  transition: "all 0.15s ease",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis"
                }}
              >
                <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>{p}</span>
                <ArrowRight size={11} style={{ opacity: 0.5, flexShrink: 0 }} />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Input & Action Button Area */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        <input 
          type="text" 
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="What data do you need? (e.g. AI Startups in India)" 
          className="matte-input" 
          style={{ 
            width: "100%", 
            padding: "0.65rem 0.85rem", 
            borderRadius: "8px",
            fontSize: "0.82rem",
            background: "rgba(0, 0, 0, 0.4)",
            border: "1px solid rgba(255, 255, 255, 0.1)"
          }}
        />
        {!isRunning ? (
          <button 
            onClick={handleSubmit} 
            disabled={!prompt.trim()} 
            style={{ 
              width: "100%",
              padding: "0.65rem",
              borderRadius: "8px",
              border: "none",
              background: prompt.trim() 
                ? "linear-gradient(135deg, #5DD62C 0%, #3ba616 100%)" 
                : "rgba(255, 255, 255, 0.08)",
              color: prompt.trim() ? "#000" : "#666",
              fontWeight: "600",
              fontSize: "0.85rem",
              cursor: prompt.trim() ? "pointer" : "not-allowed",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.4rem",
              transition: "all 0.2s"
            }}
          >
            <Sparkles size={14} />
            <span>Launch Swarm Extraction</span>
          </button>
        ) : (
          <button 
            onClick={onCancelExtraction} 
            className="matte-btn-dark" 
            style={{ width: "100%", background: "rgba(244, 63, 94, 0.15)", color: "#f43f5e", border: "1px solid rgba(244, 63, 94, 0.3)", padding: "0.65rem", fontSize: "0.85rem" }}
          >
            Stop Execution
          </button>
        )}
      </div>
    </div>
  );
}
