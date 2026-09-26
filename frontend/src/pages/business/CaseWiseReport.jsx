import { useState } from "react";
import "./business.css";
const types = [
  "LabCase",
  "UsgCase",
  "DigitalXrayCase",
  "XrayCase",
  "OutsourceLabCase",
  "EcgCase",
  "CtScanCase",
  "MriCase",
  "EpsCase",
  "OpgCase",
  "CardiologyCase",
  "EegCase",
  "MammographyCase",
];
export default function CaseWiseReport() {
  const [selected, setSelected] = useState(["LabCase", "OutsourceLabCase"]);
  const toggle = (x) =>
    setSelected((s) => (s.includes(x) ? s.filter((y) => y !== x) : [...s, x]));
  return (
    <div className="business-page">
      <div className="case-card">
        <h2>▢ &nbsp; Case wise business report</h2>
        <div className="case-body">
          <label>
            <input type="checkbox" defaultChecked /> Exclude cancelled cases
          </label>
          <div className="mini-form" style={{ marginTop: 18 }}>
            <label>
              Collection centre*
              <select className="biz-select">
                <option>Main</option>
              </select>
            </label>
            <label>
              On*
              <input className="biz-input" value="21/09/2026" readOnly />
            </label>
          </div>
          <b style={{ display: "block", marginTop: 18 }}>Case types*</b>
          <div className="checks">
            {types.map((x) => (
              <label key={x}>
                <input
                  type="checkbox"
                  checked={selected.includes(x)}
                  onChange={() => toggle(x)}
                />{" "}
                {x}
              </label>
            ))}
          </div>
        </div>
        <div className="case-footer">
          <button
            className="biz-btn primary"
            onClick={() =>
              alert("Report generated for " + selected.length + " case types")
            }
          >
            Generate
          </button>
        </div>
      </div>
    </div>
  );
}
