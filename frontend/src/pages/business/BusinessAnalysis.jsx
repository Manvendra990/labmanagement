import { useEffect, useState } from "react";
import { businessApiService } from "../../api";
import { apiArray } from "../../api/core/apiData";
import "./business.css";
import "./business-update.css";
export default function BusinessAnalysis() {
  const [rows, setRows] = useState([]),
    [error, setError] = useState("");
  useEffect(() => {
    businessApiService
      .monthly()
      .then((x) => setRows(apiArray(x)))
      .catch((e) => setError(e.message));
  }, []);
  return (
    <div className="business-page analysis-page">
      <h1>Business analysis</h1>
      {error ? (
        <p className="api-error">{error}</p>
      ) : (
        <div className="analysis-table-wrap">
          <table className="analysis-table">
            <thead>
              <tr>
                <th>DAY</th>
                <th>UPI</th>
                <th>CASH</th>
                <th>CARD</th>
                <th>INSURANCE</th>
                <th>TOTAL</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={r.id || i}>
                  <td>{r.day || r.date}</td>
                  <td>{r.upi}</td>
                  <td>{r.cash}</td>
                  <td>{r.card}</td>
                  <td>{r.insurance}</td>
                  <td>{r.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
