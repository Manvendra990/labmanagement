import { useEffect, useState } from "react";
import DataTable from "../../components/common/DataTable";
import { businessApiService } from "../../api";
import { apiArray, apiObject } from "../../api/core/apiData";
import "./business.css";
export default function DailyBusiness() {
  const [data, setData] = useState({ summary: {}, transactions: [] }),
    [error, setError] = useState("");
  useEffect(() => {
    businessApiService
      .daily()
      .then((p) => {
        const o = apiObject(p);
        setData({
          summary: o.summary || {},
          transactions: apiArray(o.transactions || o),
        });
      })
      .catch((e) => setError(e.message));
  }, []);
  const s = data.summary,
    m = (v) => `Rs.${Number(v || 0).toLocaleString("en-IN")}`;
  const cols = [
    { key: "id", label: "ID" },
    { key: "registrationNo", label: "REG. NO." },
    { key: "patientName", label: "PATIENT NAME" },
    { key: "referrerName", label: "REFERRED BY" },
    { key: "amount", label: "AMOUNT", render: m },
    { key: "paymentMode", label: "METHOD" },
    { key: "receivedBy", label: "RECEIVED BY" },
  ];
  return (
    <div className="business-page">
      <h1>Daily business</h1>
      <div className="summary">
        <div className="summary-top">
          <div className="summary-item">
            <small>Total income</small>
            <strong>{m(s.totalIncome)}</strong>
          </div>
          <div className="summary-item">
            <small>Collection charge</small>
            <strong>{m(s.collectionCharge)}</strong>
          </div>
          <div className="summary-item">
            <small>Expenses</small>
            <strong>{m(s.expenses)}</strong>
          </div>
          <div className="summary-item">
            <small>Net income</small>
            <strong>{m(s.netIncome)}</strong>
          </div>
        </div>
      </div>
      {error ? (
        <p className="api-error">{error}</p>
      ) : (
        <DataTable columns={cols} rows={data.transactions} />
      )}
    </div>
  );
}
