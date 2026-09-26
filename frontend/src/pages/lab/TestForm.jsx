import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import testCategoryApiService from "../../api/services/testCategoryApiService";
import unitApiService from "../../api/services/unitApiService";
import inputTypeApiService from "../../api/services/inputTypeApiService";
import testApiService from "../../api/services/testApiService";
import "./test-database.css";
const unwrap = (r) =>
  Array.isArray(r) ? r : r?.data || r?.items || r?.rows || [];
const emptyParam = (order = 1) => ({
  order,
  name: "",
  unitId: "",
  inputType: "single_line",
  groupBy: "",
  defaultResult: "",
  optional: false,
  parentIndex: null,
});
export default function TestForm() {
  const { type, id } = useParams(),
    nav = useNavigate(),
    editing = !!id;
  const [categories, setCategories] = useState([]),
    [units, setUnits] = useState([]),
    [inputTypes, setInputTypes] = useState([]),
    [unitModal, setUnitModal] = useState(false),
    [unitName, setUnitName] = useState(""),
    [unitError, setUnitError] = useState(""),
    [savingUnit, setSavingUnit] = useState(false),
    [error, setError] = useState(""),
    [saving, setSaving] = useState(false);
  const [f, setF] = useState({
    type: type || "single",
    name: "",
    shortName: "",
    categoryId: "",
    price: "",
    unitId: "",
    inputType: "single_line",
    defaultResult: "",
    optional: false,
    displayName: true,
    method: "",
    instrument: "",
    interpretation: "",
    parameters: [emptyParam(1), emptyParam(2)],
  });
  useEffect(() => {
    Promise.all([
      testCategoryApiService.list(),
      unitApiService.list(),
      inputTypeApiService.list(),
    ])
      .then(([c, u, i]) => {
        setCategories(unwrap(c));
        setUnits(unwrap(u));
        setInputTypes(unwrap(i));
      })
      .catch((e) => setError(e.message));
  }, []);
  useEffect(() => {
    if (editing)
      testApiService
        .getById(id)
        .then((r) => {
          const x = r?.data || r;
          setF({
            ...f,
            ...x,
            type: x.type || type,
            parameters: x.parameters?.length ? x.parameters : f.parameters,
          });
        })
        .catch((e) => setError(e.message));
  }, [editing, id]);
  const set = (k, v) => setF((x) => ({ ...x, [k]: v }));
  const setP = (idx, k, v) =>
    setF((x) => ({
      ...x,
      parameters: x.parameters.map((p, i) =>
        i === idx ? { ...p, [k]: v } : p,
      ),
    }));
  async function addUnit(e) {
    e.preventDefault();
    if (!unitName.trim()) {
      setUnitError("Please enter the unit name.");
      return;
    }
    setSavingUnit(true);
    try {
      await unitApiService.create({ name: unitName.trim() });
      const r = await unitApiService.list();
      setUnits(unwrap(r));
      setUnitName("");
      setUnitError("");
      setUnitModal(false);
    } catch (e) {
      setUnitError(e.message);
    } finally {
      setSavingUnit(false);
    }
  }
  async function submit(e) {
    e.preventDefault();
    if (!f.name.trim()) {
      setError("Please enter the test name.");
      return;
    }
    if (!f.categoryId) {
      setError("Please select a category.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const payload = {
        ...f,
        price: Number(f.price || 0),
        categoryId: Number(f.categoryId),
        unitId: f.unitId ? Number(f.unitId) : null,
        parameters: ["multi", "nested"].includes(f.type)
          ? f.parameters.map((p, i) => ({
              ...p,
              order: Number(p.order || i + 1),
              unitId: p.unitId ? Number(p.unitId) : null,
            }))
          : [],
      };
      editing
        ? await testApiService.update(id, payload)
        : await testApiService.create(payload);
      nav("/lab/tests");
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  }
  const unitSelect = (value, onChange) => (
    <div className="td-unit">
      <select value={value || ""} onChange={(e) => onChange(e.target.value)}>
        <option value="">Select unit</option>
        {units.map((u) => (
          <option key={u.id} value={u.id}>
            {u.name}
          </option>
        ))}
      </select>
      <button type="button" onClick={() => setUnitModal(true)}>
        ＋ Add new
      </button>
    </div>
  );
  const inputSelect = (value, onChange) => (
    <select value={value || ""} onChange={(e) => onChange(e.target.value)}>
      {inputTypes.map((x) => (
        <option key={x.value} value={x.value}>
          {x.label}
        </option>
      ))}
    </select>
  );
  return (
    <div className="td-page">
      <div className="td-crumb">
        Test database › Select type ›{" "}
        {editing
          ? "Edit test"
          : `New test (${f.type === "single" ? "single parameter" : f.type === "multi" ? "multi parameter" : f.type === "nested" ? "multi parameter nested" : "document"})`}
      </div>
      <h1>
        {editing
          ? "Edit test"
          : `New test (${f.type === "single" ? "single parameter" : f.type === "multi" ? "multi parameter" : f.type === "nested" ? "multi parameter nested" : "document"})`}
      </h1>
      <h3>Test details</h3>
      <p className="td-note">
        ⓘ Ratelist entry will be created for this test automatically.
      </p>
      {error && <div className="td-error">{error}</div>}
      <form onSubmit={submit} className="td-form">
        <div className="td-grid">
          <label>
            Name
            <input
              value={f.name}
              onChange={(e) => set("name", e.target.value)}
            />
          </label>
          <label>
            Short name
            <input
              value={f.shortName}
              onChange={(e) => set("shortName", e.target.value)}
            />
          </label>
          <label>
            Category
            <select
              value={f.categoryId}
              onChange={(e) => set("categoryId", e.target.value)}
            >
              <option value="">Select category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </label>
          {f.type === "nested" && (
            <label>
              Template
              <select>
                <option>default</option>
              </select>
            </label>
          )}
          <label>
            Price
            <input
              type="number"
              min="0"
              step="0.01"
              value={f.price}
              onChange={(e) => set("price", e.target.value)}
            />
          </label>
        </div>
        {f.type === "single" && (
          <>
            <div className="td-grid td-gap">
              <label>Unit{unitSelect(f.unitId, (v) => set("unitId", v))}</label>
              <label>
                Input type{inputSelect(f.inputType, (v) => set("inputType", v))}
              </label>
            </div>
            <label className="td-wide">
              Default result
              <textarea
                value={f.defaultResult}
                onChange={(e) => set("defaultResult", e.target.value)}
              />
            </label>
            <label className="td-check">
              <input
                type="checkbox"
                checked={f.optional}
                onChange={(e) => set("optional", e.target.checked)}
              />{" "}
              Optional
            </label>
          </>
        )}
        {["multi", "nested"].includes(f.type) && (
          <section className="td-parameters">
            <h3>Parameters</h3>
            {f.parameters.map((p, idx) => (
              <div className="td-param" key={idx}>
                <button
                  type="button"
                  className="td-remove"
                  onClick={() =>
                    setF((x) => ({
                      ...x,
                      parameters: x.parameters.filter((_, i) => i !== idx),
                    }))
                  }
                >
                  − Remove
                </button>
                <label>
                  Order
                  <input
                    type="number"
                    value={p.order}
                    onChange={(e) => setP(idx, "order", e.target.value)}
                  />
                </label>
                <label>
                  Name
                  <input
                    value={p.name}
                    onChange={(e) => setP(idx, "name", e.target.value)}
                  />
                </label>
                <label>
                  Unit{unitSelect(p.unitId, (v) => setP(idx, "unitId", v))}
                </label>
                <label>
                  Input type
                  {inputSelect(p.inputType, (v) => setP(idx, "inputType", v))}
                </label>
                {f.type === "nested" && (
                  <label>
                    Group By
                    <input
                      value={p.groupBy}
                      onChange={(e) => setP(idx, "groupBy", e.target.value)}
                    />
                  </label>
                )}
                <label>
                  Default result
                  <textarea
                    value={p.defaultResult}
                    onChange={(e) => setP(idx, "defaultResult", e.target.value)}
                  />
                </label>
                <label className="td-check">
                  <input
                    type="checkbox"
                    checked={p.optional}
                    onChange={(e) => setP(idx, "optional", e.target.checked)}
                  />{" "}
                  Optional
                </label>
              </div>
            ))}
            <button
              type="button"
              className="td-link"
              onClick={() =>
                setF((x) => ({
                  ...x,
                  parameters: [
                    ...x.parameters,
                    emptyParam(x.parameters.length + 1),
                  ],
                }))
              }
            >
              ＋ Add more parameters
            </button>
          </section>
        )}
        {f.type === "document" && (
          <>
            <label className="td-check">
              <input
                type="checkbox"
                checked={f.displayName}
                onChange={(e) => set("displayName", e.target.checked)}
              />{" "}
              Display test name in report
            </label>
            <label className="td-editor">
              Default result
              <textarea
                value={f.defaultResult}
                onChange={(e) => set("defaultResult", e.target.value)}
              />
            </label>
          </>
        )}
        {f.type !== "document" && (
          <>
            <div className="td-tabs">
              More details <span>Format options</span>
            </div>
            <div className="td-grid">
              <label>
                Method
                <input
                  value={f.method}
                  onChange={(e) => set("method", e.target.value)}
                />
              </label>
              <label>
                Instrument
                <input
                  value={f.instrument}
                  onChange={(e) => set("instrument", e.target.value)}
                />
              </label>
            </div>
            <label className="td-editor">
              Interpretation
              <textarea
                value={f.interpretation}
                onChange={(e) => set("interpretation", e.target.value)}
              />
            </label>
          </>
        )}
        <button className="td-save" disabled={saving}>
          {saving ? "Saving..." : "Save"}
        </button>
      </form>
      {unitModal && (
        <div className="td-overlay">
          <form className="td-modal" onSubmit={addUnit}>
            <div className="td-modal-head">
              <b>Add new Unit</b>
              <button type="button" onClick={() => setUnitModal(false)}>
                ×
              </button>
            </div>
            <label>
              * Unit
              <input
                autoFocus
                value={unitName}
                onChange={(e) => {
                  setUnitName(e.target.value);
                  if (e.target.value.trim()) setUnitError("");
                }}
              />
            </label>
            {unitError && <small className="td-field-error">{unitError}</small>}
            <button className="td-save" disabled={savingUnit}>
              {savingUnit ? "Creating..." : "Create"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
