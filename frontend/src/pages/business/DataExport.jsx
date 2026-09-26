import { useState } from "react";
import "./business.css";
export default function DataExport() {
  const [history, setHistory] = useState([]),
    [entity, setEntity] = useState("");
  const run = () => {
    if (!entity) return alert("Please select an entity");
    setHistory([{ id: 1, name: `${entity}_21-09-2026.csv`, status: "Ready" }]);
  };
  return (
    <div className="business-page">
      <div className="biz-title">
        <h1>Data export</h1>
        <span className="feature">★ Premium feature</span>
      </div>
      <div className="warning-strip">
        ⓘ &nbsp; Please utilize the available files from Data export history
        before exporting more data.
      </div>
      <b>Data export history</b>
      {history.length ? (
        <div className="info-strip" style={{ maxWidth: 520 }}>
          ✓ {history[0].name} — {history[0].status}
        </div>
      ) : (
        <div className="export-empty">
          <b>◷</b>
          <strong>No data export history</strong>
          <span>New files will appear here</span>
        </div>
      )}
      <div className="export-form">
        <label>
          Entity
          <br />
          <select
            className="biz-select"
            value={entity}
            onChange={(e) => setEntity(e.target.value)}
          >
            <option value="">Select</option>
            <option>Bill</option>
            <option>Patient</option>
            <option>Transaction</option>
            <option>Lab report</option>
            <option>Expense</option>
          </select>
        </label>
        <label>
          From*
          <br />
          <input className="biz-input" type="date" />
        </label>
        <label>
          To*
          <br />
          <input className="biz-input" type="date" />
        </label>
      </div>
      <div className="limits">
        Max Duration limits:
        <br />
        1. For Bill (Case): 31 days.
        <br />
        2. For Patient: 365 days.
        <br />
        3. For Transaction: 31 days.
        <br />
        4. For Lab report TAT: 31 days.
        <br />
        5. For Expense: 365 days.
        <br />
        6. For Lab report PDF links: 31 days.
      </div>
      <button className="biz-btn primary" onClick={run}>
        Run export
      </button>
    </div>
  );
}
