import DataTable, {
  TableBadge,
  TableAction,
} from "../../components/common/DataTable";
import { dueRows } from "./mockData";
import "./business.css";
export default function DueReports() {
  const cols = [
    { key: "reg", label: "REG. NO." },
    {
      key: "date",
      label: "DATE",
      render: (v) => <span style={{ whiteSpace: "pre-line" }}>{v}</span>,
    },
    { key: "patient", label: "PATIENT" },
    { key: "ref", label: "REFERRED BY" },
    { key: "total", label: "TOTAL" },
    { key: "paid", label: "PAID" },
    { key: "discount", label: "DISCOUNT" },
    {
      key: "status",
      label: "STATUS",
      render: (v) => <TableBadge tone="warning">{v}</TableBadge>,
    },
    {
      key: "action",
      label: "ACTIONS",
      render: () => (
        <>
          <TableAction>View bill</TableAction> ⋯
        </>
      ),
    },
  ];
  return (
    <div className="business-page">
      <h1>Due report</h1>
      <input className="biz-input" value="22/08/2026 - 21/09/2026" readOnly />
      <div style={{ marginTop: 14 }}>
        <DataTable columns={cols} rows={dueRows} />
      </div>
      <Support />
    </div>
  );
}
function Support() {
  return (
    <div className="support-pill">
      💬 Get Support
      <br />
      <small>● Offline</small>
    </div>
  );
}
