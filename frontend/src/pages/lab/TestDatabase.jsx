import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import LabTable, { Action } from "./LabTable";
import testApiService from "../../api/services/testApiService";
import testCategoryApiService from "../../api/services/testCategoryApiService";
import "./lab.css";
import "./test-database.css";
const unwrap = (r) =>
  Array.isArray(r) ? r : r?.data || r?.items || r?.rows || [];
export default function TestDatabase() {
  const nav = useNavigate(),
    [tests, setTests] = useState([]),
    [categories, setCategories] = useState([]),
    [cat, setCat] = useState("All"),
    [q, setQ] = useState(""),
    [error, setError] = useState("");
  const load = useCallback(async () => {
    try {
      const [t, c] = await Promise.all([
        testApiService.list(),
        testCategoryApiService.list(),
      ]);
      setTests(unwrap(t));
      setCategories(unwrap(c));
    } catch (e) {
      setError(e.message);
    }
  }, []);
  useEffect(() => {
    load();
  }, [load]);
  const rows = useMemo(
    () =>
      tests.filter(
        (x) =>
          (cat === "All" || String(x.categoryId) === String(cat)) &&
          (!q || x.name?.toLowerCase().includes(q.toLowerCase())),
      ),
    [tests, cat, q],
  );
  const cols = [
    { key: "order", label: "ORDER", render: (v, r, i) => v || i + 1 },
    { key: "name", label: "NAME" },
    { key: "typeLabel", label: "TEST TYPE" },
    { key: "shortName", label: "SHORT NAME" },
    { key: "categoryName", label: "CATEGORY" },
    {
      key: "action",
      label: "",
      render: (_, r) => (
        <>
          <Action onClick={() => nav(`/lab/tests/${r.id}/edit/${r.type}`)}>
            ✎ Edit
          </Action>
          <Action>◉ view</Action>
        </>
      ),
    },
  ];
  return (
    <div className="lab-page">
      <div className="lab-toolbar">
        <h1>Test database</h1>
        <span className="lab-right">
          <button
            className="lab-btn primary"
            onClick={() => nav("/lab/tests/select-type")}
          >
            ＋ Add new
          </button>{" "}
          <button className="lab-btn primary">＋ Import</button>
        </span>
      </div>
      <p style={{ fontSize: 12 }}>
        <b>Important:</b> It is required that your laboratory proofreads and
        updates the provided reference range before using it for printing lab
        reports.
      </p>
      {error && <div className="td-error">{error}</div>}
      <div className="lab-category-row">
        <b>⚑ Filter by category:</b>
        <button
          className={"lab-category " + (cat === "All" ? "active" : "")}
          onClick={() => setCat("All")}
        >
          All
        </button>
        {categories.map((x) => (
          <button
            key={x.id}
            className={
              "lab-category " + (String(cat) === String(x.id) ? "active" : "")
            }
            onClick={() => setCat(x.id)}
          >
            {x.name}
          </button>
        ))}
      </div>
      <div className="lab-toolbar">
        <input
          className="lab-input lab-search"
          placeholder="⌕  Search in page"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <span className="lab-muted">
          💡 ProTip! Select a category to order tests.
        </span>
      </div>
      <LabTable columns={cols} rows={rows} />
    </div>
  );
}
