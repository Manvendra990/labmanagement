import { useState } from "react";
import DataTable from "../../components/common/DataTable";
import "./business.css";
export default function Expenses() {
  const [rows, setRows] = useState([]),
    [q, setQ] = useState("");
  const add = () =>
    setRows((r) => [
      ...r,
      {
        id: Date.now(),
        spent: "21/09/2026",
        name: "Office supplies",
        amount: "Rs.750",
        category: "General",
        mode: "Cash",
        by: "Demo Lab Owner",
        on: "21/09/2026",
        notes: "Monthly supplies",
      },
    ]);
  const cols = [
    ["spent", "SPENT ON"],
    ["name", "NAME"],
    ["amount", "AMOUNT"],
    ["category", "CATEGORY"],
    ["mode", "MODE"],
    ["by", "ADDED BY"],
    ["on", "ADDED ON"],
    ["notes", "NOTES"],
  ].map(([key, label]) => ({ key, label }));
  const filtered = rows.filter((x) =>
    Object.values(x).join(" ").toLowerCase().includes(q.toLowerCase()),
  );
  return (
    <div className="business-page">
      <div className="biz-title">
        <h1>Expenses</h1>
        <span className="feature">★ Premium feature</span>
        <span className="feature">BETA</span>
      </div>
      <div className="page-actions">
        <button className="biz-btn">Export</button>
        <button className="biz-btn">Manage categories</button>
      </div>
      <b>
        Have feedback to improve expenses?{" "}
        <span style={{ color: "#1769e8" }}>Please share it here.</span>
      </b>
      <div className="info-strip" style={{ maxWidth: 320 }}>
        ⓘ &nbsp; How expenses work?
      </div>
      <div className="biz-toolbar">
        <button className="biz-btn">‹</button>
        <select className="biz-select">
          <option>September</option>
        </select>
        <button className="biz-btn">›</button>
        <select className="biz-select">
          <option>2026</option>
        </select>
      </div>
      <div className="biz-tabs">
        <button className="biz-tab active">Expenses</button>
        <button className="biz-tab">Analysis</button>
      </div>
      <div className="biz-toolbar">
        <button className="biz-btn primary" onClick={add}>
          ＋ Add new
        </button>
        <input
          className="biz-input"
          placeholder="⌕  Search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <button className="biz-btn">☷ Filters</button>
      </div>
      <DataTable
        columns={cols}
        rows={filtered}
        emptyText="No expense records"
      />
      <p>
        Records in page: {filtered.length} / {rows.length}
      </p>
    </div>
  );
}
