import { useNavigate } from "react-router-dom";
import "./test-database.css";
const types = [
  ["single", "Single parameter", "Eg. HB, TLC"],
  ["multi", "Multiple parameters", "Eg. DLC, Blood group"],
  [
    "nested",
    "Multiple nested parameters",
    "Eg. Urine routine, Semen Examination",
  ],
  [
    "document",
    "Document",
    "Eg. FNAC, histo-pathology reports, culture and sensitivity reports.",
  ],
];
export default function TestTypeSelect() {
  const nav = useNavigate();
  return (
    <div className="td-page">
      <div className="td-crumb">Test database › Select type</div>
      <div className="td-select-grid">
        <section className="td-library">
          <h2>
            Import test from library <small>Recommended</small>
          </h2>
          <div className="td-library-center">
            <div className="td-cloud">⇩</div>
            <p>
              Library consists of many tests ready to use. You can just preview
              the test details and import them.
            </p>
            <button>Continue</button>
          </div>
        </section>
        <div className="td-or">OR</div>
        <section className="td-manual">
          <h2>Add test manually</h2>
          <p>Select the type of test result</p>
          {types.map(([k, n, d], i) => (
            <button
              key={k}
              className="td-type"
              onClick={() => nav(`/lab/tests/new/${k}`)}
            >
              <b>{i + 1}</b>
              <span>
                <strong>{n}</strong>
                <small>{d}</small>
              </span>
            </button>
          ))}
        </section>
      </div>
    </div>
  );
}
