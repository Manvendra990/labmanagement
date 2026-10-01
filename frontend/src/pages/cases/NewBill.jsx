
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Search,
  Plus,
  List,
  X,
  Settings,
  Pencil,
} from "lucide-react";

import {
  billingApiService,
  referrerApiService,
  agentApiService,
} from "../../api";

import { apiArray } from "../../api/core/apiData";
import "./new-bill.css";

const getId = (item) =>
  item?.id ?? item?._id ?? item?.value ?? "";

const getResponseData = (response) => {
  let result = response?.data ?? response;

  // Handle common API response wrappers.
  for (let i = 0; i < 3; i += 1) {
    if (!result || typeof result !== "object") break;

    if (result.bill && typeof result.bill === "object") {
      result = result.bill;
      continue;
    }

    if (
      result.data &&
      typeof result.data === "object" &&
      !Array.isArray(result.data)
    ) {
      result = result.data;
      continue;
    }

    if (
      result.result &&
      typeof result.result === "object" &&
      !Array.isArray(result.result)
    ) {
      result = result.result;
      continue;
    }

    break;
  }

  return result;
};

const getPatientName = (bill, patientData) => {
  const name =
    patientData?.patientName ??
    patientData?.fullName ??
    bill?.patientName ??
    bill?.fullName ??
    (typeof bill?.patient === "string" ? bill.patient : "") ??
    "";

  return String(name).trim();
};

const splitPatientName = (name) => {
  const parts = String(name || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  const titles = ["Mr.", "Mrs.", "Ms.", "Master", "Dr."];

  const title = titles.includes(parts[0]) ? parts[0] : "";
  const names = title ? parts.slice(1) : parts;

  return {
    title,
    firstName: names[0] || "",
    lastName: names.slice(1).join(" "),
  };
};

const getNumericValue = (...values) => {
  for (const value of values) {
    if (value !== undefined && value !== null && value !== "") {
      const number = Number(value);
      if (Number.isFinite(number)) return number;
    }
  }

  return 0;
};

export default function NewBill() {
  const navigate = useNavigate();
  const { id: editId } = useParams();
  const isEditMode = Boolean(editId);

  const [patient, setPatient] = useState({
    mobile: "",
    title: "",
    firstName: "",
    lastName: "",
    sex: "",
    years: "",
    months: "",
    days: "",
    uhid: "",
    online: false,
  });

  const [paymentMode, setPaymentMode] = useState("cash");
  const [remarks, setRemarks] = useState("");
  const [creating, setCreating] = useState(false);
  const [loadingBill, setLoadingBill] = useState(false);
  const [createError, setCreateError] = useState("");

  const [modal, setModal] = useState(null);
  const [mode, setMode] = useState(null);

  const [referrers, setReferrers] = useState([]);
  const [referrer, setReferrer] = useState("");

  const [agents, setAgents] = useState([]);
  const [agent, setAgent] = useState("");

  const [lab, setLab] = useState([]);
  const [outsource, setOutsource] = useState([]);

  const [discount, setDiscount] = useState(0);
  const [received, setReceived] = useState(0);
  const [charge, setCharge] = useState(0);

  // Load referrers and sample collection agents.
  useEffect(() => {
    let cancelled = false;

    Promise.all([
      referrerApiService.list(),
      agentApiService.list(),
    ])
      .then(([referrerResponse, agentResponse]) => {
        if (cancelled) return;

        setReferrers(apiArray(referrerResponse));
        setAgents(apiArray(agentResponse));
      })
      .catch(() => {
        // Keep the bill form usable if these lists fail to load.
      });

    return () => {
      cancelled = true;
    };
  }, []);

  // Load the selected bill and populate the form.
  useEffect(() => {
    if (!editId) return;

    let cancelled = false;

    async function loadBillForEditing() {
      setLoadingBill(true);
      setCreateError("");

      try {
        const response = await billingApiService.getById(editId);
        const bill = getResponseData(response);

        if (!bill || typeof bill !== "object") {
          throw new Error("The server returned an invalid bill.");
        }

        if (cancelled) return;

        // Patient information may be stored in different fields.
        const patientData =
          bill.patientDetails ??
          bill.patientInfo ??
          (
            bill.patient && typeof bill.patient === "object"
              ? bill.patient
              : null
          ) ??
          {};

        const parsedName = splitPatientName(
          getPatientName(bill, patientData),
        );

        const patientTitle =
          patientData.title || parsedName.title;

        setPatient({
          mobile: String(
            patientData.mobile ??
              patientData.mobileNumber ??
              patientData.phone ??
              bill.mobile ??
              bill.mobileNumber ??
              bill.phone ??
              "",
          ),
          title: patientTitle,
          firstName: String(
            patientData.firstName ??
              patientData.first_name ??
              parsedName.firstName ??
              "",
          ),
          lastName: String(
            patientData.lastName ??
              patientData.last_name ??
              parsedName.lastName ??
              "",
          ),
          sex: String(
            patientData.sex ??
              patientData.gender ??
              bill.sex ??
              bill.gender ??
              "",
          ).toUpperCase(),
          years: String(
            patientData.years ??
              patientData.ageYears ??
              patientData.age?.years ??
              patientData.age ??
              "",
          ),
          months: String(
            patientData.months ??
              patientData.ageMonths ??
              patientData.age?.months ??
              "",
          ),
          days: String(
            patientData.days ??
              patientData.ageDays ??
              patientData.age?.days ??
              "",
          ),
          uhid: String(
            patientData.uhid ??
              patientData.UHID ??
              patientData.patientId ??
              bill.uhid ??
              bill.patientUhid ??
              "",
          ),
          online: Boolean(
            patientData.online ??
              patientData.onlineReportRequested ??
              bill.online ??
              false,
          ),
        });

        // Referrer and agent may be stored as objects or IDs.
        const referrerValue =
          bill.referrerId ??
          getId(bill.referrer) ??
          (typeof bill.referrer === "string"
            ? bill.referrer
            : "") ??
          "";

        const agentValue =
          bill.sampleCollectionAgentId ??
          getId(bill.sampleCollectionAgent) ??
          getId(bill.agent) ??
          (typeof bill.agent === "string" ? bill.agent : "") ??
          "";

        setReferrer(String(referrerValue));
        setAgent(String(agentValue));

        // Support both { lab, outsource } and flat-array formats.
        const investigations =
          bill.investigations ??
          bill.tests ??
          bill.items ??
          {};

        const investigationArray = Array.isArray(investigations)
          ? investigations
          : Array.isArray(bill.investigationItems)
            ? bill.investigationItems
            : [];

        const labTests = Array.isArray(investigations)
          ? investigationArray.filter(
              (test) =>
                String(test.type ?? test.category ?? "")
                  .toLowerCase() !== "outsource" &&
                !test.outsource,
            )
          : Array.isArray(investigations.lab)
            ? investigations.lab
            : Array.isArray(investigations.labTests)
              ? investigations.labTests
              : [];

        const outsourceTests = Array.isArray(investigations)
          ? investigationArray.filter(
              (test) =>
                String(test.type ?? test.category ?? "")
                  .toLowerCase() === "outsource" ||
                Boolean(test.outsource),
            )
          : Array.isArray(investigations.outsource)
            ? investigations.outsource
            : Array.isArray(investigations.outsourceTests)
              ? investigations.outsourceTests
              : [];

        const normalizeTests = (tests, prefix) =>
          tests.map((test, index) => ({
            ...test,
            id: getId(test) || `${prefix}-${index}`,
            name:
              test.name ??
              test.testName ??
              test.investigationName ??
              test.title ??
              "",
            price: getNumericValue(
              test.price,
              test.rate,
              test.amount,
              test.total,
            ),
          }));

        setLab(normalizeTests(labTests, "lab"));
        setOutsource(normalizeTests(outsourceTests, "outsource"));

        const payment = bill.payment ?? bill.paymentDetails ?? {};

        setDiscount(
          getNumericValue(payment.discount, bill.discount),
        );

        setReceived(
          getNumericValue(
            payment.received,
            payment.amountReceived,
            bill.paid,
            bill.amountReceived,
          ),
        );

        setCharge(
          getNumericValue(
            payment.collectionCharge,
            bill.collectionCharge,
          ),
        );

        setPaymentMode(
          payment.mode ??
            payment.paymentMode ??
            bill.paymentMode ??
            "cash",
        );

        setRemarks(
          String(payment.remarks ?? bill.remarks ?? ""),
        );

        if (labTests.length > 0) {
          setMode("lab");
        } else if (outsourceTests.length > 0) {
          setMode("outsource");
        } else {
          setMode(null);
        }
      } catch (error) {
        if (!cancelled) {
          setCreateError(
            error?.message ||
              "Could not load this bill. Please try again.",
          );
        }
      } finally {
        if (!cancelled) {
          setLoadingBill(false);
        }
      }
    }

    loadBillForEditing();

    return () => {
      cancelled = true;
    };
  }, [editId]);

  const total = useMemo(
    () =>
      [...lab, ...outsource].reduce(
        (sum, test) => sum + Number(test.price || 0),
        0,
      ) + Number(charge || 0),
    [lab, outsource, charge],
  );

  const balance = Math.max(
    0,
    total - Number(discount || 0) - Number(received || 0),
  );

  const p = (key, value) =>
    setPatient((current) => ({
      ...current,
      [key]: value,
    }));

  const addTest = (kind, test) => {
    const newTest = {
      ...test,
      id: `${kind}-${Date.now()}-${Math.random()}`,
    };

    if (kind === "lab") {
      setLab((current) => [...current, newTest]);
    } else {
      setOutsource((current) => [...current, newTest]);
    }
  };

  async function createBill() {
    setCreateError("");

    if (!patient.mobile || !/^\d{10}$/.test(patient.mobile)) {
      setCreateError("Enter a valid 10-digit mobile number.");
      return;
    }

    if (
      !patient.title ||
      !patient.firstName.trim() ||
      !patient.sex
    ) {
      setCreateError("Please fill in the required patient details.");
      return;
    }

    if (
      patient.years === "" &&
      patient.months === "" &&
      patient.days === ""
    ) {
      setCreateError("Please enter the patient's age.");
      return;
    }

    if (!lab.length && !outsource.length) {
      setCreateError("Please add at least one investigation.");
      return;
    }

    setCreating(true);

    try {
      const selectedReferrer = referrers.find(
        (item) => String(getId(item) || item.name) === String(referrer),
      );

      const selectedAgent = agents.find(
        (item) => String(getId(item) || item.name) === String(agent),
      );

      const payload = {
        patient: {
          ...patient,
          firstName: patient.firstName.trim(),
          lastName: patient.lastName.trim(),
        },

        patientName: [
          patient.title,
          patient.firstName.trim(),
          patient.lastName.trim(),
        ]
          .filter(Boolean)
          .join(" "),

        referrerId: referrer || null,

        referrerName: selectedReferrer
          ? [
              selectedReferrer.title,
              selectedReferrer.firstName,
              selectedReferrer.lastName,
            ]
                .filter(Boolean)
                .join(" ")
          : "Self",

        sampleCollectionAgentId: agent || null,
        sampleCollectionAgentName: selectedAgent?.name || "",
        collectionCentre: "Main",

        investigations: {
          lab: lab.map(({ id, _id, ...test }) => test),
          outsource: outsource.map(({ id, _id, ...test }) => test),
        },

        payment: {
          total: Number(total),
          discount: Number(discount || 0),
          received: Number(received || 0),
          collectionCharge: Number(charge || 0),
          balance: Number(balance),
          mode: paymentMode,
          remarks: remarks.trim(),
        },
      };

      if (isEditMode) {
        await billingApiService.update(editId, payload);
        navigate(`/cases/bill-details/${editId}`);
      } else {
        const response = await billingApiService.create(payload);
        const savedBill = getResponseData(response);

        const savedId =
          getId(savedBill) ||
          getId(savedBill?.bill);

        if (!savedId) {
          throw new Error("The server did not return the created bill ID.");
        }

        navigate(`/cases/bill-details/${savedId}`);
      }
    } catch (error) {
      setCreateError(
        error?.message &&
          error.message !== "[object Object]"
          ? error.message
          : isEditMode
            ? "Could not update the bill. Check the billing API and backend."
            : "Could not create the bill. Check the backend terminal for details.",
      );
    } finally {
      setCreating(false);
    }
  }

  return (
    <div className="nb-page">
      <div className="nb-title">
        {isEditMode ? <Pencil size={14} /> : <Plus size={14} />}
        <b>{isEditMode ? "Modify bill" : "New bill"}</b>
      </div>

      {loadingBill && (
        <p className="bills-message">Loading bill details...</p>
      )}

      {createError && (
        <div className="api-error" role="alert">
          {createError}
        </div>
      )}

      <fieldset
        disabled={loadingBill || creating}
        style={{ border: 0, padding: 0, margin: 0, minWidth: 0 }}
      >
        <section className="nb-section">
          <i className="nb-step">1</i>
          <h2>Patient details</h2>

          <label>Mobile number</label>

          <div className="nb-mobile">
            <span>+91</span>
            <input
              type="tel"
              inputMode="numeric"
              autoComplete="tel-national"
              aria-label="Mobile number"
              placeholder="Enter mobile number"
              maxLength={10}
              value={patient.mobile}
              onChange={(event) =>
                p(
                  "mobile",
                  event.target.value.replace(/\D/g, "").slice(0, 10),
                )
              }
            />
            <Search size={16} aria-hidden="true" />
          </div>

          <div className="nb-patient-grid">
            <Field
              label="Title*"
              type="select"
              value={patient.title}
              set={(value) => p("title", value)}
              options={["", "Mr.", "Mrs.", "Ms.", "Master"]}
            />

            <Field
              label="First name*"
              value={patient.firstName}
              set={(value) => p("firstName", value)}
            />

            <Field
              label="Last name"
              value={patient.lastName}
              set={(value) => p("lastName", value)}
            />

            <div>
              <label>Sex*</label>
              <div className="nb-sex">
                {["MALE", "FEMALE", "OTHER"].map((sex) => (
                  <button
                    type="button"
                    className={patient.sex === sex ? "on" : ""}
                    onClick={() => p("sex", sex)}
                    key={sex}
                  >
                    {sex}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <label>Age*</label>
          <div className="nb-age">
            {["years", "months", "days"].map((key) => (
              <input
                key={key}
                type="number"
                min="0"
                placeholder={key[0].toUpperCase() + key.slice(1)}
                value={patient[key]}
                onChange={(event) => p(key, event.target.value)}
              />
            ))}
          </div>

          <label>UHID</label>
          <div className="nb-uhid">
            <input
              value={patient.uhid}
              onChange={(event) => p("uhid", event.target.value)}
            />
            <Search size={15} />
          </div>

          <label className="nb-check">
            <input
              type="checkbox"
              checked={patient.online}
              onChange={(event) => p("online", event.target.checked)}
            />{" "}
            Online report requested
          </label>

          <div className="nb-pills">
            <button type="button">◉ Email</button>
            <button type="button">◉ Address</button>
            <button type="button">◉ Aadhaar</button>
            <button type="button">◉ Patient history</button>
          </div>
        </section>

        <section className="nb-section">
          <i className="nb-step">2</i>
          <h2>Case details</h2>

          <div className="nb-case-grid">
            <div>
              <label>* Referred By</label>
              <div className="nb-inline">
                <select
                  value={referrer}
                  onChange={(event) => setReferrer(event.target.value)}
                >
                  <option value="">Select referrer</option>
                  {referrers.map((item, index) => (
                    <option
                      key={getId(item) || index}
                      value={getId(item) || item.name}
                    >
                      {item.name ||
                        [
                          item.title,
                          item.firstName,
                          item.lastName,
                        ]
                          .filter(Boolean)
                          .join(" ")}
                    </option>
                  ))}
                </select>

                <button
                  type="button"
                  className="nb-outline"
                  onClick={() => setModal("ref")}
                >
                  <Plus size={14} /> Add New
                </button>
              </div>

              <button type="button" className="nb-link">
                <List size={13} /> Manage referrers
              </button>
            </div>

            <Field
              label="* Collection centre"
              type="select"
              value="Main"
              set={() => {}}
              options={["Main"]}
            />

            <div>
              <label>Sample collection agent</label>
              <select
                value={agent}
                onChange={(event) => setAgent(event.target.value)}
              >
                <option value="">Select agent</option>
                {agents.map((item, index) => (
                  <option
                    key={getId(item) || index}
                    value={getId(item) || item.name}
                  >
                    {item.name}
                  </option>
                ))}
              </select>

              <button
                type="button"
                className="nb-link"
                onClick={() => setModal("agent")}
              >
                <Plus size={12} /> Add new
              </button>

              <button type="button" className="nb-link">
                <Pencil size={11} /> Edit
              </button>
            </div>
          </div>

          <div className="nb-lab-buttons">
            <button
              type="button"
              className={mode === "lab" ? "on" : ""}
              onClick={() => setMode("lab")}
            >
              ▣<span>LAB</span>
            </button>

            <button
              type="button"
              className={mode === "outsource" ? "on" : ""}
              onClick={() => setMode("outsource")}
            >
              ▣<span>OUTSOURCE LAB</span>
            </button>
          </div>

          {mode && (
            <Investigation
              mode={mode}
              rows={mode === "lab" ? lab : outsource}
              add={() =>
                setModal(mode === "lab" ? "labtest" : "outtest")
              }
              remove={(id) => {
                if (mode === "lab") {
                  setLab((current) =>
                    current.filter((test) => test.id !== id),
                  );
                } else {
                  setOutsource((current) =>
                    current.filter((test) => test.id !== id),
                  );
                }
              }}
            />
          )}

          <div className="nb-payment">
            <b>Payment Details:</b>

            <div>
              <Pay label="Total: Rs." value={total} plain />
              <Pay label="Discount" value={discount} set={setDiscount} />
              <Pay
                label="Amount received"
                value={received}
                set={setReceived}
              />
              <Pay
                label="Balance: Rs."
                value={balance}
                plain
                red
              />

              <div className="nb-pay">
                <label>Mode:</label>
                <select
                  value={paymentMode}
                  onChange={(event) => setPaymentMode(event.target.value)}
                >
                  <option value="cash">Cash</option>
                  <option value="card">Card</option>
                  <option value="UPI">UPI</option>
                  <option value="insurance">Insurance</option>
                </select>
              </div>

              <div className="nb-pay">
                <label>Remarks:</label>
                <input
                  value={remarks}
                  onChange={(event) => setRemarks(event.target.value)}
                  placeholder="Enter remarks"
                />
              </div>
            </div>

            {mode && (
              <div className="nb-charge">
                <label>Collection Charge:</label>
                <input
                  type="number"
                  min="0"
                  value={charge}
                  onChange={(event) => setCharge(event.target.value)}
                />
              </div>
            )}
          </div>

          <div className="nb-actions">
            <button
              type="button"
              className="nb-primary"
              onClick={createBill}
              disabled={creating || loadingBill}
            >
              {creating
                ? isEditMode
                  ? "Saving changes..."
                  : "Creating bill..."
                : isEditMode
                  ? "Save Changes"
                  : "Create"}
            </button>

            <button
              type="button"
              className="nb-outline"
              onClick={() => setModal("settings")}
            >
              <Settings size={13} /> Settings
            </button>
          </div>
        </section>
      </fieldset>

      {modal === "ref" && (
        <RefModal
          close={() => setModal(null)}
          save={async (values) => {
            try {
              const response = await referrerApiService.create(values);
              const result = getResponseData(response);
              const item = result?.referrer ?? result;

              setReferrers((current) => [...current, item]);
              setReferrer(String(getId(item) || item.name));
              setModal(null);
            } catch (error) {
              setCreateError(error?.message || "Could not create the referrer.");
            }
          }}
        />
      )}

      {modal === "agent" && (
        <AgentModal
          close={() => setModal(null)}
          save={async (name) => {
            try {
              const response = await agentApiService.create({ name });
              const result = getResponseData(response);
              const item = result?.agent ?? result;

              setAgents((current) => [...current, item]);
              setAgent(String(getId(item) || item.name));
              setModal(null);
            } catch (error) {
              setCreateError(
                error?.message || "Could not create the sample collection agent.",
              );
            }
          }}
        />
      )}

      {(modal === "labtest" || modal === "outtest") && (
        <TestModal
          title={
            modal === "labtest"
              ? "Add lab investigation"
              : "Add outsource lab investigation"
          }
          close={() => setModal(null)}
          save={(test) => {
            addTest(
              modal === "labtest" ? "lab" : "outsource",
              test,
            );
            setModal(null);
          }}
        />
      )}

      {modal === "settings" && (
        <Modal title="Bill settings" close={() => setModal(null)}>
          <p>Bill settings can be configured here.</p>
          <button
            type="button"
            className="nb-primary"
            onClick={() => setModal(null)}
          >
            Close
          </button>
        </Modal>
      )}
    </div>
  );
}

function Field({ label, type, value, set, options = [] }) {
  return (
    <div>
      <label>{label}</label>
      {type === "select" ? (
        <select value={value} onChange={(event) => set(event.target.value)}>
          {options.map((option, index) => (
            <option key={index} value={option}>
              {option || "Select"}
            </option>
          ))}
        </select>
      ) : (
        <input value={value} onChange={(event) => set(event.target.value)} />
      )}
    </div>
  );
}

function Pay({ label, value, set, plain, red }) {
  return (
    <div className={`nb-pay ${red ? "red" : ""}`}>
      <label>{label}</label>
      {plain ? (
        <span>{value}</span>
      ) : (
        <input
          type="number"
          min="0"
          value={value}
          onChange={(event) => set(event.target.value)}
        />
      )}
    </div>
  );
}

function Investigation({ mode, rows, add, remove }) {
  const sum = rows.reduce(
    (total, test) => total + Number(test.price || 0),
    0,
  );

  return (
    <div className="nb-invest">
      <b>×</b>
      <div>
        <label>
          {mode === "lab"
            ? "Lab Investigations"
            : "Outsource Lab Investigations"}
        </label>

        <div className="nb-tests">
          {rows.map((test) => (
            <span key={test.id}>
              {test.name} · Rs.{test.price}
              <button
                type="button"
                aria-label={`Remove ${test.name}`}
                onClick={() => remove(test.id)}
              >
                ×
              </button>
            </span>
          ))}
        </div>

        <button type="button" className="nb-link" onClick={add}>
          <Plus size={12} /> Add New
        </button>

        <button type="button" className="nb-link">
          <List size={12} /> Ratelist
        </button>

        <small>Total: Rs. {sum}, Due: Rs. 0</small>

        {mode === "lab" && (
          <div>
            <button type="button" className="nb-pill">
              ◉ Sample collected at
            </button>
          </div>
        )}
      </div>

      <Field label="* Paid" value="0" set={() => {}} />
      <Field label="* Discount" value="0" set={() => {}} />
    </div>
  );
}

function Modal({ title, close, children, wide = "" }) {
  return (
    <div
      className="nb-backdrop"
      onMouseDown={(event) =>
        event.target === event.currentTarget && close()
      }
    >
      <div className={`nb-modal ${wide}`}>
        <div className="nb-modal-head">
          <b>{title}</b>
          <button type="button" onClick={close} aria-label="Close modal">
            <X size={15} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function RefModal({ close, save }) {
  const [form, setForm] = useState({
    title: "Dr.",
    first: "",
    last: "",
    degree: "",
    mobile: "",
    email: "",
    address: "",
    active: true,
  });

  const update = (key, value) =>
    setForm((current) => ({ ...current, [key]: value }));

  return (
    <Modal title="Add new referrer" close={close}>
      <div className="nb-ref-grid">
        <Field
          label="Title"
          type="select"
          value={form.title}
          set={(value) => update("title", value)}
          options={["Dr.", "Mr.", "Mrs.", "Ms."]}
        />
        <Field
          label="* First name"
          value={form.first}
          set={(value) => update("first", value)}
        />
        <Field
          label="Last name"
          value={form.last}
          set={(value) => update("last", value)}
        />
        <Field
          label="Degree"
          value={form.degree}
          set={(value) => update("degree", value)}
        />
        <Field
          label="Mobile number"
          value={form.mobile}
          set={(value) => update("mobile", value)}
        />
        <Field
          label="Contact email"
          value={form.email}
          set={(value) => update("email", value)}
        />
        <div>
          <label>Address</label>
          <textarea
            value={form.address}
            onChange={(event) => update("address", event.target.value)}
          />
        </div>
      </div>

      <label className="nb-check">
        <input
          type="checkbox"
          checked={form.active}
          onChange={(event) => update("active", event.target.checked)}
        />{" "}
        Active
      </label>

      <button
        type="button"
        className="nb-primary"
        onClick={() =>
          form.first.trim() &&
          save({
            title: form.title,
            firstName: form.first,
            lastName: form.last,
            degree: form.degree,
            mobile: form.mobile,
            email: form.email,
            address: form.address,
            active: form.active,
          })
        }
      >
        Create Referrer
      </button>
    </Modal>
  );
}

function AgentModal({ close, save }) {
  const [name, setName] = useState("");

  return (
    <Modal
      title="Add new sample collection agent"
      close={close}
      wide="agent"
    >
      <label>* Name</label>
      <input
        value={name}
        onChange={(event) => setName(event.target.value)}
      />
      <br />
      <button
        type="button"
        className="nb-primary nb-save"
        onClick={() => name.trim() && save(name.trim())}
      >
        Save
      </button>
    </Modal>
  );
}

function TestModal({ title, close, save }) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");

  return (
    <Modal title={title} close={close}>
      <div className="nb-test-grid">
        <Field
          label="Investigation / Test*"
          value={name}
          set={setName}
        />
        <Field
          label="Rate (Rs.)*"
          value={price}
          set={setPrice}
        />
      </div>

      <button
        type="button"
        className="nb-primary"
        onClick={() =>
          name.trim() &&
          save({
            name: name.trim(),
            price: Number(price || 0),
          })
        }
      >
        Add Investigation
      </button>
    </Modal>
  );
}