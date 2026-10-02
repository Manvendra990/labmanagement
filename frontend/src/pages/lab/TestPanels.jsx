import { useMemo, useState } from "react";
import LabTable from "./LabTable";
import { panels } from "./mockData";
import "./lab.css";

const getId = (item) => item?.id ?? item?._id ?? "";

const getTests = (panel) => {
  const value = panel?.tests ?? panel?.includedTests ?? [];

  if (Array.isArray(value)) {
    return value
      .map((test) =>
        typeof test === "string"
          ? test
          : (test?.name ?? test?.testName ?? test?.title ?? ""),
      )
      .filter(Boolean);
  }

  if (typeof value === "string") {
    return value
      .split(",")
      .map((test) => test.trim())
      .filter(Boolean);
  }

  return [];
};

// Uses saved ratelist entries first, with demo entries for the
// panels shown in the reference screenshot.
const ratelistFallbacks = {
  "Complete Blood Count (CBC)": ["CB with GBP", "Complete Blood Count (CBC)"],
  "CBC (with absolute counts)": [
    "Antenatal Package",
    "Cardiac package",
    "CBC (with absolute counts)",
    "Dialysis package",
    "Fitness Package",
    "Full body checkup (Female)",
    "Full body checkup (Male)",
    "Preoperative",
    "Thyroid package",
  ],
  "CBC with ESR": [
    "Anemia package",
    "Arthritis Package",
    "CBC with ESR",
    "Fever package",
  ],
  "BT & CT": ["BT & CT"],
  "Coagulation Profile": ["Coagulation Profile"],
  "Blood Sugar Fasting & PP": ["Blood Sugar Fasting & PP", "Diabetic package"],
};

const getRatelistEntries = (panel) => {
  const value =
    panel?.ratelistEntries ??
    panel?.ratelist_entries ??
    panel?.ratelist ??
    panel?.entries ??
    panel?.packages;

  let entries = [];

  if (Array.isArray(value)) {
    entries = value
      .map((entry) =>
        typeof entry === "string" ? entry : (entry?.name ?? entry?.title ?? ""),
      )
      .filter(Boolean);
  } else if (typeof value === "string") {
    entries = value
      .split(",")
      .map((entry) => entry.trim())
      .filter(Boolean);
  }

  if (entries.length) return entries;

  return ratelistFallbacks[panel?.name] ?? (panel?.name ? [panel.name] : []);
};

export default function TestPanels() {
  const [rows, setRows] = useState(panels);
  const [helpOpen, setHelpOpen] = useState(false);
  const [editingPanel, setEditingPanel] = useState(null);
  const [form, setForm] = useState(null);
  const [newTest, setNewTest] = useState("");
  const [error, setError] = useState("");
  const [viewingPanel, setViewingPanel] = useState(null);
  const [viewHelpOpen, setViewHelpOpen] = useState(false);

  const categories = useMemo(
    () => [...new Set(rows.map((panel) => panel.category).filter(Boolean))],
    [rows],
  );

  const displayRows = useMemo(
    () =>
      rows.map((panel, index) => ({
        ...panel,
        order: index + 1,
        tests: getTests(panel),
        ratelistEntries: getRatelistEntries(panel),
      })),
    [rows],
  );

  const openView = (panel) => {
    setViewingPanel(panel);
    setViewHelpOpen(false);
  };

  const closeView = () => {
    setViewingPanel(null);
    setViewHelpOpen(false);
  };

  const openEdit = (panel) => {
    setEditingPanel(panel);
    setForm({
      name: panel.name || "",
      category: panel.category || "",
      tests: getTests(panel),
      interpretation:
        panel.interpretation ?? panel.notes ?? panel.clinicalNotes ?? "",
      hideInterpretation: Boolean(
        panel.hideInterpretation ?? panel.hideIndividualInterpretation,
      ),
      hideMethod: Boolean(panel.hideMethod ?? panel.hideIndividualMethod),
    });
    setNewTest("");
    setError("");
  };

  const closeModal = () => {
    setEditingPanel(null);
    setForm(null);
    setNewTest("");
    setError("");
  };

  const updateForm = (key, value) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const addTest = () => {
    const name = newTest.trim();
    if (!name) return;

    if (form.tests.some((test) => test.toLowerCase() === name.toLowerCase())) {
      setError("This test has already been added.");
      return;
    }

    updateForm("tests", [...form.tests, name]);
    setNewTest("");
    setError("");
  };

  const savePanel = (event) => {
    event.preventDefault();

    if (!form.name.trim()) {
      setError("Please enter the panel name.");
      return;
    }

    if (!form.category) {
      setError("Please select a category.");
      return;
    }

    const updatedPanel = {
      ...editingPanel,
      name: form.name.trim(),
      category: form.category,
      tests: form.tests,
      interpretation: form.interpretation,
      hideInterpretation: form.hideInterpretation,
      hideMethod: form.hideMethod,
    };

    const isNew = String(getId(editingPanel)).startsWith("new-");

    setRows((current) =>
      isNew
        ? [...current, updatedPanel]
        : current.map((panel) =>
            String(getId(panel)) === String(getId(editingPanel))
              ? updatedPanel
              : panel,
          ),
    );

    closeModal();
  };

  const columns = [
    {
      key: "order",
      label: "ORDER",
      render: (value) => (
        <div className="tp-order">
          <span className="tp-order-arrows" aria-hidden="true">
            <span>⌃</span>
            <span>⌄</span>
          </span>
          <span>{value}.</span>
        </div>
      ),
    },
    {
      key: "name",
      label: "NAME",
    },
    {
      key: "category",
      label: "CATEGORY",
    },
    {
      key: "tests",
      label: "TESTS",
      render: (value) => {
        const tests = Array.isArray(value) ? value : [];

        return (
          <div className="tp-table-tests">
            <div className="tp-test-preview">
              {tests.slice(0, 4).join(", ")}
              {tests.length > 4 ? "..." : ""}
            </div>

            {tests.length > 0 && (
              <div className="tp-test-tooltip-wrap">
                <button
                  type="button"
                  className="tp-test-count"
                  aria-label={`Show all ${tests.length} tests`}
                >
                  ({tests.length} tests) <span>⌄</span>
                </button>

                <div className="tp-test-tooltip" role="tooltip">
                  <strong>Tests :</strong>
                  <span>{tests.join(", ")}</span>
                </div>
              </div>
            )}
          </div>
        );
      },
    },
    {
      key: "ratelistEntries",
      label: "RATELIST ENTRIES",
      render: (value) => {
        const entries = Array.isArray(value) ? value : [];

        return (
          <div className="tp-ratelist" title={entries.join(", ")}>
            {entries.length ? entries.join(", ") : "—"}
          </div>
        );
      },
    },
    {
      key: "actions",
      label: "",
      render: (_, row) => (
        <div className="tp-row-actions">
          <button
            type="button"
            className="tp-edit-button"
            onClick={() => openEdit(row)}
          >
            <span aria-hidden="true">✎</span> Edit
          </button>

          <button
            type="button"
            className="tp-view-button"
            onClick={() => openView(row)}
          >
            <span aria-hidden="true">⊙</span> View
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="lab-page tp-page">
      <div className="tp-page-heading">
        <h1>
          <span>Test</span> panels
        </h1>

        <button
          type="button"
          className="lab-btn primary"
          onClick={() =>
            openEdit({
              id: `new-${Date.now()}`,
              name: "",
              category: categories[0] || "",
              tests: [],
              ratelistEntries: [],
            })
          }
        >
          <span className="tp-plus">＋</span> Add new
        </button>
      </div>

      <button
        type="button"
        className="tp-help-bar"
        onClick={() => setHelpOpen((open) => !open)}
        aria-expanded={helpOpen}
      >
        <span className="tp-help-left">
          <span className="tp-help-icon">ⓘ</span>
          How to reorder?
        </span>
        <span className={`tp-chevron ${helpOpen ? "tp-chevron-open" : ""}`}>
          ⌄
        </span>
      </button>

      {helpOpen && (
        <div className="tp-help-content">
          Use the arrows in the Order column to change the order of test panels.
          The displayed order is currently the panel order.
        </div>
      )}

      <div className="tp-table-wrap">
        <LabTable columns={columns} rows={displayRows} />
      </div>

      
{viewingPanel && (
  <div
    className="tp-overlay tp-view-overlay"
    onMouseDown={(event) => {
      if (event.target === event.currentTarget) closeView();
    }}
  >
    <div className="tp-modal tp-view-modal">
      <div className="tp-modal-header">
        <strong>View test panel</strong>

        <button
          type="button"
          className="tp-close"
          onClick={closeView}
          aria-label="Close"
        >
          ×
        </button>
      </div>

      <div className="tp-modal-body">
        <div className="tp-view-title-row">
          <h2>{viewingPanel.name}</h2>

          <span className="tp-watch-video">
            <span>▷</span> Watch Video
          </span>
        </div>

        <div className="tp-view-flags">
          <div>
            <span className="tp-view-dot">●</span>
            Individual test interpretations, notes, comments are hidden.
          </div>

          <div>
            <span className="tp-view-dot">●</span>
            Individual test methods and instruments are not displayed.
          </div>

          <div>
            <strong>●</strong> Category: {viewingPanel.category || "—"}
          </div>
        </div>

        {/* Tests included in this panel */}
        <div className="tp-view-content-grid">
          <div className="tp-view-tests-section">
            <table className="tp-view-data-table">
              <thead>
                <tr>
                  <th>ORDER</th>
                  <th>LAB TESTS</th>
                </tr>
              </thead>

              <tbody>
                {getTests(viewingPanel).map((test, index) => (
                  <tr key={`${test}-${index}`}>
                    <td>{index + 1}.</td>
                    <td>{test}</td>
                  </tr>
                ))}

                {!getTests(viewingPanel).length && (
                  <tr>
                    <td colSpan={2}>No tests added.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="tp-view-help-section">
            <button
              type="button"
              className="tp-view-help-toggle"
              onClick={() => setViewHelpOpen((open) => !open)}
              aria-expanded={viewHelpOpen}
            >
              <span>ⓘ &nbsp; How to reorder?</span>
              <span>{viewHelpOpen ? "⌃" : "⌄"}</span>
            </button>

            {viewHelpOpen && (
              <div className="tp-view-help-description">
                The order of tests in this panel determines the order
                in which they appear in the report.
              </div>
            )}
          </div>
        </div>

        {/* Clinical notes */}
        <div className="tp-view-notes-section">
          <div className="tp-view-section-heading">Note:</div>

          <div className="tp-view-clinical-notes">
            <strong>Clinical Notes:</strong>

            <p>
              {viewingPanel.interpretation ||
                viewingPanel.notes ||
                viewingPanel.clinicalNotes ||
                "No clinical notes available for this panel."}
            </p>
          </div>
        </div>

        {/* Ratelist entries */}
        <div className="tp-view-ratelist-section">
          <div className="tp-view-section-heading">
            Available in ratelist under names:
          </div>

          <table className="tp-view-data-table tp-view-ratelist-table">
            <thead>
              <tr>
                <th>S. NO.</th>
                <th>NAME</th>
                <th>FEE</th>
              </tr>
            </thead>

            <tbody>
              {getRatelistEntries(viewingPanel).map((entry, index) => (
                <tr key={`${entry}-${index}`}>
                  <td>{index + 1}.</td>
                  <td>{entry}</td>
                  <td>
                    {(() => {
                      const originalEntries =
                        viewingPanel.ratelistEntries ??
                        viewingPanel.ratelist_entries ??
                        viewingPanel.ratelist ??
                        viewingPanel.entries ??
                        viewingPanel.packages ??
                        [];

                      const original = Array.isArray(originalEntries)
                        ? originalEntries.find((item) =>
                            typeof item === "string"
                              ? item === entry
                              : (item?.name ?? item?.title) === entry
                          )
                        : null;

                      const fee = original?.fee ?? original?.price;

                      return fee != null
                        ? `₹${Number(fee).toLocaleString("en-IN")}`
                        : "—";
                    })()}
                  </td>
                </tr>
              ))}

              {!getRatelistEntries(viewingPanel).length && (
                <tr>
                  <td colSpan={3}>No ratelist entries available.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="tp-modal-footer">
        <button
          type="button"
          className="tp-cancel"
          onClick={closeView}
        >
          Close
        </button>
      </div>
    </div>
  </div>
)}

      {editingPanel && form && (
        <div
          className="tp-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeModal();
          }}
        >
          <form className="tp-modal" onSubmit={savePanel}>
            <div className="tp-modal-header">
              <strong>
                {String(getId(editingPanel)).startsWith("new-")
                  ? "Add test panel"
                  : "Edit test panel"}
              </strong>

              <button
                type="button"
                className="tp-close"
                onClick={closeModal}
                aria-label="Close"
              >
                ×
              </button>
            </div>

            <div className="tp-modal-body">
              <div className="tp-field">
                <label>Name</label>
                <input
                  value={form.name}
                  onChange={(event) => updateForm("name", event.target.value)}
                  required
                />
              </div>

              <div className="tp-field">
                <label>Category</label>
                <select
                  value={form.category}
                  onChange={(event) =>
                    updateForm("category", event.target.value)
                  }
                  required
                >
                  <option value="">Select category</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                  {form.category && !categories.includes(form.category) && (
                    <option value={form.category}>{form.category}</option>
                  )}
                </select>
              </div>

              <label className="tp-checkbox">
                <input
                  type="checkbox"
                  checked={form.hideInterpretation}
                  onChange={(event) =>
                    updateForm("hideInterpretation", event.target.checked)
                  }
                />
                Hide individual test interpretation, notes, comments from
                report.
              </label>

              <label className="tp-checkbox">
                <input
                  type="checkbox"
                  checked={form.hideMethod}
                  onChange={(event) =>
                    updateForm("hideMethod", event.target.checked)
                  }
                />
                Hide individual test method and instrument from report.
              </label>

              <div className="tp-field">
                <label>Tests</label>

                <div className="tp-test-box">
                  <div className="tp-test-chips">
                    {form.tests.map((test, index) => (
                      <span className="tp-chip" key={`${test}-${index}`}>
                        {test}
                        <button
                          type="button"
                          onClick={() =>
                            updateForm(
                              "tests",
                              form.tests.filter((item) => item !== test),
                            )
                          }
                          aria-label={`Remove ${test}`}
                        >
                          ×
                        </button>
                      </span>
                    ))}

                    {!form.tests.length && (
                      <span className="tp-empty">No tests added</span>
                    )}
                  </div>

                  <div className="tp-add-test">
                    <input
                      value={newTest}
                      onChange={(event) => setNewTest(event.target.value)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter") {
                          event.preventDefault();
                          addTest();
                        }
                      }}
                      placeholder="Search by test name or enter a test"
                    />
                    <button type="button" onClick={addTest}>
                      + Add
                    </button>
                  </div>
                </div>

                <small>Add tests by entering their names.</small>
              </div>

              <div className="tp-library-note">
                ✦ You can update the interpretation below.
              </div>

              <div className="tp-field">
                <label>Interpretation / Clinical Notes</label>
                <div className="tp-editor-toolbar">
                  <span>¶</span>
                  <span>Insert image</span>
                  <span>System Font</span>
                  <span>Paragraph</span>
                  <span>12pt</span>
                </div>

                <textarea
                  className="tp-interpretation"
                  value={form.interpretation}
                  onChange={(event) =>
                    updateForm("interpretation", event.target.value)
                  }
                  placeholder="Enter clinical notes and interpretation..."
                />
              </div>

              {error && <div className="tp-error">{error}</div>}
            </div>

            <div className="tp-modal-footer">
              <button className="tp-save" type="submit">
                Save
              </button>
              <button className="tp-cancel" type="button" onClick={closeModal}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
