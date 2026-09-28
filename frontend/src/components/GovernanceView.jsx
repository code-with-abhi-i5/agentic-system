import React, { useState } from "react";
import { ShieldCheck, Lock, Globe, AlertTriangle, CheckCircle, Sliders, Check } from "lucide-react";

export default function GovernanceView() {
  const [robotsCompliance, setRobotsCompliance] = useState(true);
  const [autoDeduplicate, setAutoDeduplicate] = useState(true);
  const [rateLimit, setRateLimit] = useState(8);

  const permittedSources = [
    { domain: "techcrunch.com", status: "Permitted", trustScore: 99, category: "Tech News / Funding" },
    { domain: "ycombinator.com", status: "Permitted", trustScore: 98, category: "Startup Community" },
    { domain: "github.com", status: "Permitted", trustScore: 99, category: "Open Source Tech Stacks" },
    { domain: "crunchbase.com", status: "Permitted", trustScore: 96, category: "B2B Investment Directory" },
    { domain: "yourstory.com", status: "Permitted", trustScore: 95, category: "Indian Ecosystem News" },
    { domain: "bloomberg.com", status: "Permitted", trustScore: 97, category: "Financial Intelligence" },
    { domain: "economictimes.indiatimes.com", status: "Permitted", trustScore: 94, category: "Enterprise Markets" }
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {/* Header */}
      <div className="glass-panel" style={{ padding: "1.5rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <div style={{
            width: "36px",
            height: "36px",
            borderRadius: "10px",
            background: "rgba(16, 185, 129, 0.15)",
            border: "1px solid rgba(16, 185, 129, 0.3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--emerald-primary)"
          }}>
            <ShieldCheck style={{ width: "18px", height: "18px" }} />
          </div>
          <div>
            <h2 style={{ fontSize: "1.15rem", fontWeight: "700", color: "#fff" }}>
              Source Governance & Ethical Scraping Rules
            </h2>
            <p style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
              Ensure compliance with web etiquette, Robots.txt, rate limiting and domain allowlists
            </p>
          </div>
        </div>
      </div>

      {/* Control Grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
        gap: "1.25rem"
      }}>
        {/* Compliance Policy Card */}
        <div className="glass-panel">
          <h3 style={{ fontSize: "0.95rem", fontWeight: "700", color: "#fff", marginBottom: "0.5rem" }}>
            Automated Ethical Guardrails
          </h3>
          <p style={{ fontSize: "0.76rem", color: "var(--text-muted)", marginBottom: "1.25rem" }}>
            The LangGraph orchestrator strictly validates every scraped domain against these policies before initiating browser sessions.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <span style={{ fontSize: "0.85rem", fontWeight: "600", color: "#fff", display: "block" }}>
                  Strict Robots.txt Compliance
                </span>
                <span style={{ fontSize: "0.72rem", color: "var(--text-subtle)" }}>
                  Disallow paths are never crawled or extracted
                </span>
              </div>
              <input
                type="checkbox"
                checked={robotsCompliance}
                onChange={(e) => setRobotsCompliance(e.target.checked)}
                style={{ accentColor: "var(--emerald-primary)", width: "18px", height: "18px" }}
              />
            </div>

            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <span style={{ fontSize: "0.85rem", fontWeight: "600", color: "#fff", display: "block" }}>
                  Autonomous Deduplication
                </span>
                <span style={{ fontSize: "0.72rem", color: "var(--text-subtle)" }}>
                  Merge duplicate entities using Levenshtein distance
                </span>
              </div>
              <input
                type="checkbox"
                checked={autoDeduplicate}
                onChange={(e) => setAutoDeduplicate(e.target.checked)}
                style={{ accentColor: "var(--emerald-primary)", width: "18px", height: "18px" }}
              />
            </div>

            <div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.4rem" }}>
                <span style={{ fontSize: "0.85rem", fontWeight: "600", color: "#fff" }}>
                  Max Request Concurrency: {rateLimit} req/sec
                </span>
                <span style={{ fontSize: "0.72rem", color: "#fff" }}>Safe Zone</span>
              </div>
              <input
                type="range"
                min={2}
                max={20}
                value={rateLimit}
                onChange={(e) => setRateLimit(Number(e.target.value))}
                style={{ width: "100%", accentColor: "#fff" }}
              />
            </div>
          </div>
        </div>

        {/* Permitted Domains Summary Card */}
        <div className="glass-panel">
          <h3 style={{ fontSize: "0.95rem", fontWeight: "700", color: "#fff", marginBottom: "0.5rem" }}>
            Permitted Domain Registry
          </h3>
          <p style={{ fontSize: "0.76rem", color: "var(--text-muted)", marginBottom: "1rem" }}>
            7 pre-cleared high-authority intelligence domains currently active in runtime pool.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", maxHeight: "240px", overflowY: "auto" }}>
            {permittedSources.map((item, i) => (
              <div
                key={i}
                style={{
                  background: "var(--bg-tertiary)",
                  border: "1px solid var(--border-subtle)",
                  borderRadius: "10px",
                  padding: "0.65rem 0.85rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <Globe style={{ width: "14px", height: "14px", color: "var(--cyan-primary)" }} />
                  <div>
                    <span style={{ fontSize: "0.82rem", fontWeight: "700", color: "#fff", display: "block" }}>
                      {item.domain}
                    </span>
                    <span style={{ fontSize: "0.68rem", color: "var(--text-subtle)" }}>
                      {item.category}
                    </span>
                  </div>
                </div>

                <span className="badge badge-emerald">
                  <Check style={{ width: "11px", height: "11px" }} />
                  <span>{item.trustScore}% Trust</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
