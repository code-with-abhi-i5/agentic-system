import React from "react";
import { Search, Bell } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function TopHeader({ activeTab }) {
  const { user } = useAuth();

  const getTitle = () => {
    switch (activeTab) {
      case "dashboard": return "Dashboard";
      case "mission-control": return "Mission Control";
      case "overview": return "Market Overview";
      case "datasets": return "Datasets";
      default: return "Portfolio";
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "2rem" }}>
      {/* Left Area */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        <div style={{ fontSize: "0.75rem", color: "#666" }}>
          Kortex / <span style={{ color: "#aaa" }}>{getTitle()}</span>
        </div>
        <h2 style={{ fontSize: "2rem", fontWeight: "600", color: "#fff", letterSpacing: "-0.02em" }}>
          Welcome to {getTitle()} !
        </h2>
      </div>

      {/* Right Area */}
      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        {/* Search */}
        <div style={{ position: "relative" }}>
          <Search size={14} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "#888" }} />
          <input 
            type="text" 
            placeholder="Search" 
            className="matte-input"
            style={{ paddingLeft: "36px", width: "200px" }}
          />
        </div>

        {/* Bell Icon */}
        <button style={{ background: "transparent", border: "none", color: "#e5e5e5", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Bell size={18} />
        </button>

        {/* Action Button (Like Deposit) */}
        <button className="matte-btn-white" style={{ marginLeft: "0.5rem" }}>
          Export
        </button>
      </div>
    </div>
  );
}
