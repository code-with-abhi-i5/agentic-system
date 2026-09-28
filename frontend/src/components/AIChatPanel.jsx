import React, { useState, useRef, useEffect } from "react";
import {
  MessageSquare,
  X,
  Send,
  Bot,
  User,
  Sparkles,
  Lightbulb,
  ArrowRight,
  Database,
  Loader2,
} from "lucide-react";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const generateContextualQuestions = (title = "") => {
  const t = (title || "").toLowerCase();

  // 1. YouTube / Creators / Channels / Video Content
  if (t.includes("youtube") || t.includes("channel") || t.includes("creator") || t.includes("video")) {
    const subTopic = (t.includes("blockchain") || t.includes("crypto") || t.includes("web3"))
      ? "blockchain and crypto"
      : (t.includes("fullstack") || t.includes("web") || t.includes("frontend") || t.includes("dev") || t.includes("code") || t.includes("program"))
      ? "programming and web development"
      : (t.includes("ai") || t.includes("ml") || t.includes("machine learning"))
      ? "AI and machine learning"
      : "key content";

    return [
      "Which YouTube channel has the highest confidence rating?",
      `What are the primary ${subTopic} topics and focus areas covered by these channels?`,
      "Can you list all creators or channels along with their source links and details?",
    ];
  }

  // 2. Colleges / Universities / Schools / Education / Campus
  if (
    t.includes("college") ||
    t.includes("collage") ||
    t.includes("universit") ||
    t.includes("institute") ||
    t.includes("campus") ||
    t.includes("school") ||
    t.includes("academic") ||
    t.includes("education")
  ) {
    return [
      "Which college or institution has the highest rating or confidence score?",
      "What are the locations, courses, and educational categories of these institutions?",
      "Can you compare the listed institutions along with their verified source links?",
    ];
  }

  // 3. Blockchain / Crypto / Web3 / DeFi / NFT
  if (t.includes("crypto") || t.includes("blockchain") || t.includes("web3") || t.includes("defi") || t.includes("nft")) {
    return [
      "Which blockchain entities in this dataset have the highest confidence score?",
      "What are the primary categories and tech stacks represented?",
      "Show me the key founders and source links mentioned.",
    ];
  }

  // 4. Jobs / Hiring / Careers / Roles
  if (t.includes("job") || t.includes("hiring") || t.includes("career") || t.includes("role") || t.includes("developer")) {
    return [
      "Which roles or job titles are most common in this dataset?",
      "What are the top required skills and tech stacks listed?",
      "What locations and work arrangements are available?",
    ];
  }

  // 5. Healthcare / Hospitals / Clinics / Medical
  if (t.includes("hospital") || t.includes("clinic") || t.includes("doctor") || t.includes("health") || t.includes("medical")) {
    return [
      "Which hospital or healthcare center has the highest rating or confidence score?",
      "What are the primary medical specialties and facilities offered?",
      "Can you list the facility locations and source links?",
    ];
  }

  // 6. Startups / Companies / Funding / VCs
  if (t.includes("startup") || t.includes("fund") || t.includes("invest") || t.includes("company") || t.includes("companies")) {
    return [
      "Which companies have the highest funding or valuation?",
      "What are the leading industries and categories represented?",
      "Who are the key founders and what tech stacks do they use?",
    ];
  }

  // 7. Universal dynamic fallback using the actual title
  const cleanTitle = title.replace(/^(top|list of|best|find|get|show me|all)\s*\d*\s*/i, "").trim() || "entries";
  return [
    `Which ${cleanTitle} have the highest confidence score?`,
    `What are the main categories or specializations in this dataset?`,
    `Can you summarize the top ${cleanTitle} with key details?`,
  ];
};

export default function AIChatPanel({ isOpen, onClose, datasetId, datasetTitle, totalRecords }) {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [suggestedFollowups, setSuggestedFollowups] = useState(() =>
    generateContextualQuestions(datasetTitle)
  );
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  // Sync contextual questions whenever dataset or title changes
  useEffect(() => {
    setMessages([]);
    const defaultQs = generateContextualQuestions(datasetTitle);
    setSuggestedFollowups(defaultQs);

    if (datasetId) {
      const token = localStorage.getItem("kortex_auth_token");
      const headers = { "Content-Type": "application/json" };
      if (token) headers["Authorization"] = `Bearer ${token}`;

      fetch(`${API_BASE}/datasets/${datasetId}/suggestions`, { headers })
        .then((res) => res.json())
        .then((resData) => {
          if (resData.success && Array.isArray(resData.data?.suggestions) && resData.data.suggestions.length > 0) {
            setSuggestedFollowups(resData.data.suggestions.slice(0, 3));
          }
        })
        .catch(() => {});
    }
  }, [datasetId, datasetTitle]);

  const sendMessage = async (question) => {
    if (!question.trim() || !datasetId || isLoading) return;

    const userMessage = {
      role: "user",
      content: question,
      timestamp: new Date().toLocaleTimeString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);
    setSuggestedFollowups([]);

    try {
      const conversationHistory = messages.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await fetch(`${API_BASE}/datasets/${datasetId}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, conversationHistory }),
      });

      if (!res.ok) throw new Error(`Server returned status: ${res.status}`);
      const data = await res.json();

      const aiMessage = {
        role: "assistant",
        content: data.data?.answer || "I couldn't generate a response.",
        timestamp: new Date().toLocaleTimeString(),
        dataInsight: data.data?.dataInsight,
        relevantRecords: data.data?.relevantRecords || [],
      };

      setMessages((prev) => [...prev, aiMessage]);
      setSuggestedFollowups(data.data?.suggestedFollowups || []);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `Error: ${err.message}. Please try again.`,
          timestamp: new Date().toLocaleTimeString(),
          isError: true,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(inputValue);
  };

  if (!isOpen) return null;

  return (
    <div className="ai-chat-overlay" onClick={onClose}>
      <div className="ai-chat-panel" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="ai-chat-header">
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <div style={{
              width: "40px",
              height: "40px",
              borderRadius: "12px",
              background: "linear-gradient(135deg, rgba(6, 182, 212, 0.2), rgba(99, 102, 241, 0.2))",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}>
              <MessageSquare style={{ width: "20px", height: "20px", color: "var(--cyan-primary)" }} />
            </div>
            <div>
              <h3 style={{ fontSize: "1rem", fontWeight: "800", color: "#fff", margin: 0 }}>
                Chat with Dataset
              </h3>
              <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.72rem", color: "var(--text-muted)" }}>
                <Database style={{ width: "11px", height: "11px" }} />
                <span>{datasetTitle || "Current Dataset"} • {totalRecords || 0} records</span>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="ai-chat-close-btn">
            <X style={{ width: "18px", height: "18px" }} />
          </button>
        </div>

        {/* Messages Area */}
        <div className="ai-chat-messages">
          {messages.length === 0 && (
            <div className="ai-chat-welcome">
              <div style={{
                width: "56px",
                height: "56px",
                borderRadius: "16px",
                background: "rgba(255, 255, 255, 0.05)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "1rem",
              }}>
                <Bot style={{ width: "28px", height: "28px", color: "var(--cyan-primary)" }} />
              </div>
              <h4 style={{ fontSize: "1.05rem", fontWeight: "700", color: "#fff", marginBottom: "0.4rem" }}>
                Ask anything about your data
              </h4>
              <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", maxWidth: "320px", lineHeight: "1.6" }}>
                I can analyze records, find patterns, compute stats, and answer questions about your extracted dataset.
              </p>
            </div>
          )}

          {messages.map((msg, idx) => (
            <div key={idx} className={`ai-chat-bubble ${msg.role}`}>
              <div className="bubble-avatar">
                {msg.role === "user" ? (
                  <User style={{ width: "14px", height: "14px" }} />
                ) : (
                  <Bot style={{ width: "14px", height: "14px" }} />
                )}
              </div>
              <div className="bubble-content">
                <div className={`bubble-text ${msg.isError ? "error" : ""}`}>
                  {msg.content}
                </div>
                {msg.dataInsight && (
                  <div className="bubble-insight">
                    <Lightbulb style={{ width: "13px", height: "13px", color: "var(--amber-primary)", flexShrink: 0 }} />
                    <span>{msg.dataInsight}</span>
                  </div>
                )}
                {msg.relevantRecords && msg.relevantRecords.length > 0 && (
                  <div style={{ marginTop: "0.6rem", display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                    <div className="bubble-records-badge" style={{ alignSelf: "flex-start" }}>
                      <Database style={{ width: "12px", height: "12px" }} />
                      <span>{msg.relevantRecords.length} Filtered Records</span>
                    </div>

                    {/* Inline Mini-Table Matching Existing Table Styling */}
                    <div style={{
                      background: "rgba(0, 0, 0, 0.4)",
                      border: "1px solid rgba(255, 255, 255, 0.08)",
                      borderRadius: "10px",
                      overflowX: "auto",
                      maxHeight: "220px",
                      fontSize: "0.78rem"
                    }}>
                      <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                        <thead>
                          <tr style={{ background: "rgba(255, 255, 255, 0.03)", borderBottom: "1px solid rgba(255, 255, 255, 0.06)" }}>
                            <th style={{ padding: "0.45rem 0.65rem", color: "var(--text-muted)", fontWeight: "600" }}>Entity / Company</th>
                            <th style={{ padding: "0.45rem 0.65rem", color: "var(--text-muted)", fontWeight: "600" }}>Funding / Valuation</th>
                            <th style={{ padding: "0.45rem 0.65rem", color: "var(--text-muted)", fontWeight: "600" }}>Key Detail</th>
                          </tr>
                        </thead>
                        <tbody>
                          {msg.relevantRecords.slice(0, 6).map((rec, rIdx) => (
                            <tr key={rIdx} style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.03)" }}>
                              <td style={{ padding: "0.45rem 0.65rem", color: "#fff", fontWeight: "600" }}>
                                {rec.company || rec.name || rec.title || Object.values(rec)[0] || "—"}
                              </td>
                              <td style={{ padding: "0.45rem 0.65rem", color: "#10b981", fontFamily: "var(--font-mono, monospace)" }}>
                                {rec.funding || rec.valuation || rec.budget || "—"}
                              </td>
                              <td style={{ padding: "0.45rem 0.65rem", color: "var(--text-muted)" }}>
                                {rec.founder || rec.location || rec.category || "—"}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
                <span className="bubble-time">{msg.timestamp}</span>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="ai-chat-bubble assistant">
              <div className="bubble-avatar">
                <Bot style={{ width: "14px", height: "14px" }} />
              </div>
              <div className="bubble-content">
                <div className="ai-typing-indicator">
                  <span className="typing-dot" />
                  <span className="typing-dot" />
                  <span className="typing-dot" />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Follow-ups */}
        {suggestedFollowups.length > 0 && !isLoading && (
          <div className="ai-chat-suggestions">
            {suggestedFollowups.slice(0, 3).map((suggestion, idx) => (
              <button
                key={idx}
                onClick={() => sendMessage(suggestion)}
                className="suggestion-chip"
              >
                <Sparkles style={{ width: "12px", height: "12px", color: "var(--cyan-primary)", flexShrink: 0, marginTop: "2px" }} />
                <span>{suggestion}</span>
                <ArrowRight style={{ width: "11px", height: "11px", color: "var(--text-subtle)", flexShrink: 0, alignSelf: "center" }} />
              </button>
            ))}
          </div>
        )}

        {/* Input Area */}
        <form className="ai-chat-input-area" onSubmit={handleSubmit}>
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask about your dataset..."
            disabled={isLoading || !datasetId}
            className="ai-chat-input"
          />
          <button
            type="submit"
            disabled={isLoading || !inputValue.trim() || !datasetId}
            className="ai-chat-send-btn"
          >
            {isLoading ? (
              <Loader2 style={{ width: "18px", height: "18px", animation: "spin 1s linear infinite" }} />
            ) : (
              <Send style={{ width: "18px", height: "18px" }} />
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
