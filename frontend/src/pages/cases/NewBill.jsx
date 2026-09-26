import { useEffect, useMemo, useState } from "react";
import { Search, Plus, List, X, Settings, Pencil } from "lucide-react";
import {
  billingApiService,
  referrerApiService,
  agentApiService,
} from "../../api";
import { apiArray } from "../../api/core/apiData";
import "./new-bill.css";

export default function NewBill() {
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
  const [modal, setModal] = useState(null),
    [mode, setMode] = useState(null);
  const [referrers, setReferrers] = useState([]),
    [referrer, setReferrer] = useState("");
  const [agents, setAgents] = useState([]),
    [agent, setAgent] = useState("");
  const [lab, setLab] = useState([]),
    [outsource, setOutsource] = useState([]);
  const [discount, setDiscount] = useState(0),
    [received, setReceived] = useState(0),
    [charge, setCharge] = useState(0);
  useEffect(() => {
    Promise.all([referrerApiService.list(), agentApiService.list()])
      .then(([r, a]) => {
        setReferrers(apiArray(r));
        setAgents(apiArray(a));
      })
      .catch(() => {});
  }, []);
  async function createBill() {
    await billingApiService.create({
      patient,
      referrerId: referrer || null,
      sampleCollectionAgentId: agent || null,
      collectionCentre: "Main",
      investigations: { lab, outsource },
      payment: {
        total,
        discount: Number(discount || 0),
        received: Number(received || 0),
        collectionCharge: Number(charge || 0),
        balance,
      },
    });
    alert("Bill created successfully.");
  }
  const total = useMemo(
    () =>
      [...lab, ...outsource].reduce((s, x) => s + Number(x.price || 0), 0) +
      Number(charge || 0),
    [lab, outsource, charge],
  );
  const balance = Math.max(
    0,
    total - Number(discount || 0) - Number(received || 0),
  );
  const p = (k, v) => setPatient((x) => ({ ...x, [k]: v }));
  const addTest = (kind, t) =>
    kind === "lab"
      ? setLab((v) => [...v, { ...t, id: Date.now() }])
      : setOutsource((v) => [...v, { ...t, id: Date.now() }]);
  return (
    <div className="nb-page">
      <div className="nb-title">
        <Plus size={14} /> <b>New bill</b>
      </div>
      <section className="nb-section">
        <i className="nb-step">1</i>
        <h2>Patient details</h2>
        <label>Mobile number</label>
        <div className="nb-mobile">
          <span>+91</span>
          <input
            value={patient.mobile}
            onChange={(e) => p("mobile", e.target.value)}
          />
          <Search size={15} />
        </div>
        <div className="nb-patient-grid">
          <Field
            label="Title*"
            type="select"
            value={patient.title}
            set={(v) => p("title", v)}
            options={["", "Mr.", "Mrs.", "Ms.", "Master"]}
          />
          <Field
            label="First name*"
            value={patient.firstName}
            set={(v) => p("firstName", v)}
          />
          <Field
            label="Last name"
            value={patient.lastName}
            set={(v) => p("lastName", v)}
          />
          <div>
            <label>Sex*</label>
            <div className="nb-sex">
              {["MALE", "FEMALE", "OTHER"].map((x) => (
                <button
                  className={patient.sex === x ? "on" : ""}
                  onClick={() => p("sex", x)}
                  key={x}
                >
                  {x}
                </button>
              ))}
            </div>
          </div>
        </div>
        <label>Age*</label>
        <div className="nb-age">
          {["years", "months", "days"].map((k) => (
            <input
              key={k}
              placeholder={k[0].toUpperCase() + k.slice(1)}
              value={patient[k]}
              onChange={(e) => p(k, e.target.value)}
            />
          ))}
        </div>
        <label>UHID</label>
        <div className="nb-uhid">
          <input
            value={patient.uhid}
            onChange={(e) => p("uhid", e.target.value)}
          />
          <Search size={15} />
        </div>
        <label className="nb-check">
          <input
            type="checkbox"
            checked={patient.online}
            onChange={(e) => p("online", e.target.checked)}
          />{" "}
          Online report requested
        </label>
        <div className="nb-pills">
          <button>◉ Email</button>
          <button>◉ Address</button>
          <button>◉ Aadhaar</button>
          <button>◉ Patient history</button>
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
                onChange={(e) => setReferrer(e.target.value)}
              >
                <option />
                {referrers.map((x, i) => (
                  <option key={x.id || i} value={x.id || x.name}>
                    {x.name ||
                      `${x.title || ""} ${x.firstName || ""} ${x.lastName || ""}`.trim()}
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
            <select value={agent} onChange={(e) => setAgent(e.target.value)}>
              <option />
              {agents.map((x, i) => (
                <option key={x.id || i} value={x.id || x.name}>
                  {x.name}
                </option>
              ))}
            </select>
            <button className="nb-link" onClick={() => setModal("agent")}>
              <Plus size={12} /> Add new
            </button>
            <button className="nb-link">
              <Pencil size={11} /> Edit
            </button>
          </div>
        </div>
        <div className="nb-lab-buttons">
          <button
            className={mode === "lab" ? "on" : ""}
            onClick={() => setMode("lab")}
          >
            ▣<span>LAB</span>
          </button>
          <button
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
            add={() => setModal(mode === "lab" ? "labtest" : "outtest")}
            remove={(id) =>
              mode === "lab"
                ? setLab((v) => v.filter((x) => x.id !== id))
                : setOutsource((v) => v.filter((x) => x.id !== id))
            }
          />
        )}
        <div className="nb-payment">
          <b>Payment Details:</b>
          <div>
            <Pay label="Total: Rs." value={total} plain />
            <Pay label="Discount" value={discount} set={setDiscount} />
            <Pay label="Amount received" value={received} set={setReceived} />
            <Pay label="Balance: Rs." value={balance} plain red />
            <div className="nb-pay">
              <label>Mode:</label>
              <select>
                <option>cash</option>
                <option>card</option>
                <option>UPI</option>
                <option>insurance</option>
              </select>
            </div>
            <div className="nb-pay">
              <label>Remarks:</label>
              <input />
            </div>
          </div>
          {mode && (
            <div className="nb-charge">
              <label>Collection Charge:</label>
              <input
                type="number"
                value={charge}
                onChange={(e) => setCharge(e.target.value)}
              />
            </div>
          )}
        </div>
        <div className="nb-actions">
          <button className="nb-primary" onClick={createBill}>
            Create
          </button>
          <button className="nb-outline">
            <Settings size={13} /> Settings
          </button>
        </div>
      </section>
      {modal === "ref" && (
        <RefModal
          close={() => setModal(null)}
          save={async (x) => {
            const c = await referrerApiService.create(x);
            const item = c?.data || c;
            setReferrers((v) => [...v, item]);
            setReferrer(item.id || item.name);
            setModal(null);
          }}
        />
      )}
      {modal === "agent" && (
        <AgentModal
          close={() => setModal(null)}
          save={async (x) => {
            const c = await agentApiService.create({ name: x });
            const item = c?.data || c;
            setAgents((v) => [...v, item]);
            setAgent(item.id || item.name);
            setModal(null);
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
          save={(t) => {
            addTest(modal === "labtest" ? "lab" : "outsource", t);
            setModal(null);
          }}
        />
      )}
    </div>
  );
}
function Field({ label, type, value, set, options = [] }) {
  return (
    <div>
      <label>{label}</label>
      {type === "select" ? (
        <select value={value} onChange={(e) => set(e.target.value)}>
          {options.map((x, i) => (
            <option key={i}>{x}</option>
          ))}
        </select>
      ) : (
        <input value={value} onChange={(e) => set(e.target.value)} />
      )}
    </div>
  );
}
function Pay({ label, value, set, plain, red }) {
  return (
    <div className={"nb-pay " + (red ? "red" : "")}>
      <label>{label}</label>
      {plain ? (
        <span>{value}</span>
      ) : (
        <input
          type="number"
          value={value}
          onChange={(e) => set(e.target.value)}
        />
      )}
    </div>
  );
}
function Investigation({ mode, rows, add, remove }) {
  let sum = rows.reduce((s, x) => s + Number(x.price || 0), 0);
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
          {rows.map((x) => (
            <span key={x.id}>
              {x.name} · Rs.{x.price}
              <button onClick={() => remove(x.id)}>×</button>
            </span>
          ))}
        </div>
        <button className="nb-link" onClick={add}>
          <Plus size={12} /> Add New
        </button>
        <button className="nb-link">
          <List size={12} /> Ratelist
        </button>
        <small>Total: Rs. {sum}, Due: Rs. 0</small>
        {mode === "lab" && (
          <div>
            <button className="nb-pill">◉ Sample collected at</button>
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
      onMouseDown={(e) => e.target === e.currentTarget && close()}
    >
      <div className={"nb-modal " + wide}>
        <div className="nb-modal-head">
          <b>{title}</b>
          <button onClick={close}>
            <X size={15} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
function RefModal({ close, save }) {
  const [f, setF] = useState({
    title: "Dr.",
    first: "",
    last: "",
    degree: "",
    mobile: "",
    email: "",
    address: "",
    active: true,
  });
  let u = (k, v) => setF((x) => ({ ...x, [k]: v }));
  return (
    <Modal title="Add new referrer" close={close}>
      <div className="nb-ref-grid">
        <Field
          label="Title"
          type="select"
          value={f.title}
          set={(v) => u("title", v)}
          options={["Dr.", "Mr.", "Mrs.", "Ms."]}
        />
        <Field
          label="* First name"
          value={f.first}
          set={(v) => u("first", v)}
        />
        <Field label="Last name" value={f.last} set={(v) => u("last", v)} />
        <Field label="Degree" value={f.degree} set={(v) => u("degree", v)} />
        <Field
          label="Mobile number"
          value={f.mobile}
          set={(v) => u("mobile", v)}
        />
        <Field
          label="Contact email"
          value={f.email}
          set={(v) => u("email", v)}
        />
        <div>
          <label>Address</label>
          <textarea
            value={f.address}
            onChange={(e) => u("address", e.target.value)}
          />
        </div>
      </div>
      <label className="nb-check">
        <input
          type="checkbox"
          checked={f.active}
          onChange={(e) => u("active", e.target.checked)}
        />{" "}
        Active
      </label>
      <button
        type="button"
        className="nb-primary"
        onClick={() =>
          f.first.trim() &&
          save({
            title: f.title,
            firstName: f.first,
            lastName: f.last,
            degree: f.degree,
            mobile: f.mobile,
            email: f.email,
            address: f.address,
            active: f.active,
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
    <Modal title="Add new sample collection agent" close={close} wide="agent">
      <label>* Name</label>
      <input value={name} onChange={(e) => setName(e.target.value)} />
      <br />
      <button
        className="nb-primary nb-save"
        onClick={() => name.trim() && save(name.trim())}
      >
        Save
      </button>
    </Modal>
  );
}
function TestModal({ title, close, save }) {
  const [name, setName] = useState(""),
    [price, setPrice] = useState("");
  return (
    <Modal title={title} close={close}>
      <div className="nb-test-grid">
        <Field label="Investigation / Test*" value={name} set={setName} />
        <Field label="Rate (Rs.)*" value={price} set={setPrice} />
      </div>
      <button
        className="nb-primary"
        onClick={() => name.trim() && save({ name, price: Number(price || 0) })}
      >
        Add Investigation
      </button>
    </Modal>
  );
}
