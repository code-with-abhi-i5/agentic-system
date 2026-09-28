import React from "react";
import {
  LayoutDashboard,
  Briefcase,
  BarChart2,
  Layers,
  Folder,
  Award,
  CreditCard,
  Settings,
  Eye,
  HelpCircle,
  Sparkles
} from "lucide-react";
export default function Sidebar({ activeTab, setActiveTab }) {

  return (
    <aside className="sidebar matte-sidebar" style={{ width: "240px", padding: "1.5rem", justifyContent: "space-between" }}>
      <div>
        {/* Branding Header */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "2.5rem" }}>
          <Sparkles style={{ color: "#fff", width: "24px", height: "24px" }} />
          <h2 style={{ fontFamily: "'newblack', sans-serif", fontSize: "1.8rem", fontWeight: "normal", color: "#fff", margin: 0, letterSpacing: "0.02em" }}>Cerkit</h2>
        </div>

        {/* MENU Group */}
        <div style={{ marginBottom: "1.5rem" }}>
          <div style={{ fontSize: "0.65rem", fontWeight: "700", color: "#666", marginBottom: "0.75rem", letterSpacing: "0.05em" }}>MENU</div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>

            <button className={`matte-nav-inactive ${activeTab === 'mission-control' ? 'matte-nav-active' : ''}`} style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.65rem 1rem", width: "100%", cursor: "pointer", textAlign: "left" }} onClick={() => setActiveTab('mission-control')}>
              <Briefcase size={16} /> <span style={{ fontSize: "0.85rem", fontWeight: "500" }}>Mission Control</span>
            </button>
            <button className={`matte-nav-inactive ${activeTab === 'overview' ? 'matte-nav-active' : ''}`} style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.65rem 1rem", width: "100%", cursor: "pointer", textAlign: "left" }} onClick={() => setActiveTab('overview')}>
              <BarChart2 size={16} /> <span style={{ fontSize: "0.85rem", fontWeight: "500" }}>Market Overview</span>
            </button>
            <button className={`matte-nav-inactive ${activeTab === 'datasets' ? 'matte-nav-active' : ''}`} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.65rem 1rem", width: "100%", cursor: "pointer", textAlign: "left" }} onClick={() => setActiveTab('datasets')}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <Layers size={16} /> <span style={{ fontSize: "0.85rem", fontWeight: "500" }}>Datasets</span>
              </div>
              <span style={{ background: "#333", color: "#fff", fontSize: "0.7rem", padding: "0.1rem 0.4rem", borderRadius: "999px" }}>12</span>
            </button>
          </div>
        </div>




      </div>


    </aside>
  );
}
