import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Search,
  Plus,
  List,
  X,
  Settings,
  Pencil,
  FlaskConical,
  Scan,
  HeartPulse,
  Activity,
  Monitor,
  Waves,
  Brain,
  Image,
  Microscope,
  Radio,
  ScanLine,
  Bone,
} from "lucide-react";

import {
  billingApiService,
  referrerApiService,
  agentApiService,
} from "../../api";

import { apiArray } from "../../api/core/apiData";
import "./new-bill.css";

const getId = (item) => item?.id ?? item?._id ?? item?.value ?? "";

const getResponseData = (response) => {
  let result = response?.data ?? response;

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

const getPatientName = (bill, patientData) =>
  String(
    patientData?.patientName ??
      patientData?.fullName ??
      bill?.patientName ??
      bill?.fullName ??
      (typeof bill?.patient === "string" ? bill.patient : "") ??
      "",
  ).trim();

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

const EMPTY_PATIENT = {
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
  email: "",
  address: "",
  aadhaar: "",
  history: "",
};

const MODALITIES = [
  { key: "lab", label: "LAB", icon: FlaskConical },
  { key: "usg", label: "USG", icon: Scan },
  { key: "digitalXray", label: "DIGITAL XRAY", icon: ScanLine },
  { key: "xray", label: "XRAY", icon: Radio },
  { key: "outsource", label: "OUTSOURCE LAB", icon: Microscope },
  { key: "ecg", label: "ECG", icon: Activity },
  { key: "ctScan", label: "CT SCAN", icon: Scan },
  { key: "mri", label: "MRI", icon: Monitor },
  { key: "eps", label: "EPS", icon: Waves },
  { key: "opg", label: "OPG", icon: Bone },
  { key: "cardiology", label: "CARDIOLOGY", icon: HeartPulse },
  { key: "eeg", label: "EEG", icon: Brain },
  { key: "mammography", label: "MAMMOGRAPHY", icon: Image },
];

const EMPTY_INVESTIGATIONS = () =>
  Object.fromEntries(MODALITIES.map(({ key }) => [key, []]));

const EMPTY_INVESTIGATION_PAYMENTS = () =>
  Object.fromEntries(
    MODALITIES.map(({ key }) => [
      key,
      {
        paid: "",
        discount: 0,
      },
    ]),
  );

const getInvestigationTitle = (key) => {
  const titles = {
    lab: "Lab Investigations",
    usg: "USG Investigations",
    digitalXray: "Digital X-ray Investigations",
    xray: "X-ray Investigations",
    outsource: "Outsource Lab Investigations",
    ecg: "ECG Investigations",
    ctScan: "CT Scan Investigations",
    mri: "MRI Investigations",
    eps: "EPS Investigations",
    opg: "OPG Investigations",
    cardiology: "Cardiology Investigations",
    eeg: "EEG Investigations",
    mammography: "Mammography Investigations",
  };

  return titles[key] || "Investigations";
};

const normalizeTests = (tests, prefix) => {
  if (!Array.isArray(tests)) return [];

  return tests.map((test, index) => ({
    ...test,
    id: getId(test) || `${prefix}-${index}`,
    name:
      test.name ?? test.testName ?? test.investigationName ?? test.title ?? "",
    price: getNumericValue(test.price, test.rate, test.amount, test.total),
  }));
};

const getTestArraysFromBill = (bill) => {
  const result = EMPTY_INVESTIGATIONS();
  const source = bill.investigations ?? bill.tests ?? bill.items ?? {};

  if (Array.isArray(source)) {
    source.forEach((test, index) => {
      const type = String(
        test.type ?? test.category ?? test.modality ?? "lab",
      ).toLowerCase();

      const modality = MODALITIES.find(
        (item) =>
          item.key.toLowerCase() === type || item.label.toLowerCase() === type,
      );

      const key = modality?.key || (test.outsource ? "outsource" : "lab");

      result[key].push({
        ...test,
        id: getId(test) || `${key}-${index}`,
        name:
          test.name ??
          test.testName ??
          test.investigationName ??
          test.title ??
          "",
        price: getNumericValue(test.price, test.rate, test.amount, test.total),
      });
    });

    return result;
  }

  const aliases = {
    lab: ["lab", "labTests"],
    usg: ["usg", "usgTests"],
    digitalXray: ["digitalXray", "digitalXrayTests", "digital_xray"],
    xray: ["xray", "xrayTests"],
    outsource: ["outsource", "outsourceTests"],
    ecg: ["ecg", "ecgTests"],
    ctScan: ["ctScan", "ctScanTests", "ct", "ctTests"],
    mri: ["mri", "mriTests"],
    eps: ["eps", "epsTests"],
    opg: ["opg", "opgTests"],
    cardiology: ["cardiology", "cardiologyTests"],
    eeg: ["eeg", "eegTests"],
    mammography: ["mammography", "mammographyTests"],
  };

  MODALITIES.forEach(({ key }) => {
    const testsKey = aliases[key]?.find((name) => Array.isArray(source[name]));

    result[key] = normalizeTests(testsKey ? source[testsKey] : [], key);
  });

  if (Array.isArray(bill.investigationItems)) {
    bill.investigationItems.forEach((test, index) => {
      const type = String(
        test.type ?? test.category ?? test.modality ?? "lab",
      ).toLowerCase();

      const modality = MODALITIES.find(
        (item) =>
          item.key.toLowerCase() === type || item.label.toLowerCase() === type,
      );

      const key = modality?.key || (test.outsource ? "outsource" : "lab");

      const testId = getId(test);

      if (
        !result[key].some(
          (existing) => testId && String(getId(existing)) === String(testId),
        )
      ) {
        result[key].push({
          ...test,
          id: testId || `${key}-extra-${index}`,
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
        });
      }
    });
  }

  return result;
};

const OPTIONAL_FIELDS = [
  {
    key: "email",
    label: "Email",
    placeholder: "Enter email address",
    type: "email",
  },
  {
    key: "address",
    label: "Address",
    placeholder: "Enter patient address",
    type: "textarea",
  },
  {
    key: "aadhaar",
    label: "Aadhaar",
    placeholder: "Enter Aadhaar number",
    type: "text",
  },
  {
    key: "history",
    label: "Patient history",
    placeholder: "Enter patient history",
    type: "textarea",
  },
];

export default function NewBill() {
  const navigate = useNavigate();
  const { id: editId } = useParams();
  const isEditMode = Boolean(editId);

  const [patient, setPatient] = useState({ ...EMPTY_PATIENT });
  const [optionalSections, setOptionalSections] = useState([]);

  const [paymentMode, setPaymentMode] = useState("cash");
  const [remarks, setRemarks] = useState("");

  const [creating, setCreating] = useState(false);
  const [loadingBill, setLoadingBill] = useState(false);
  const [createError, setCreateError] = useState("");

  const [modal, setModal] = useState(null);
  const [selectedModality, setSelectedModality] = useState("lab");

  const [referrers, setReferrers] = useState([]);
  const [referrer, setReferrer] = useState("");

  const [agents, setAgents] = useState([]);
  const [agent, setAgent] = useState("");

  const [investigations, setInvestigations] = useState(EMPTY_INVESTIGATIONS);

  const [activeModalities, setActiveModalities] = useState([]);

  // Overall bill payment fields.
  const [discount, setDiscount] = useState("0");
  const [received, setReceived] = useState("0");
  const [charge, setCharge] = useState("0");

  // Independent Paid and Discount values for every investigation.
  const [investigationPayments, setInvestigationPayments] = useState(
    EMPTY_INVESTIGATION_PAYMENTS,
  );

  const p = (key, value) => {
    setPatient((current) => ({
      ...current,
      [key]: value,
    }));
  };

  const updateInvestigationPayment = (modality, field, value) => {
    setInvestigationPayments((current) => ({
      ...current,
      [modality]: {
        paid: "",
        discount: "0",
        ...(current[modality] || {}),
        [field]: value,
      },
    }));
  };

  const addOptionalField = (key) => {
    setOptionalSections((current) =>
      current.includes(key) ? current : [...current, key],
    );
  };

  const removeOptionalField = (key) => {
    setOptionalSections((current) => current.filter((item) => item !== key));

    p(key, "");
  };

  // Load referrers and agents.
  useEffect(() => {
    let cancelled = false;

    Promise.all([referrerApiService.list(), agentApiService.list()])
      .then(([referrerResponse, agentResponse]) => {
        if (cancelled) return;

        setReferrers(apiArray(referrerResponse));
        setAgents(apiArray(agentResponse));
      })
      .catch(() => {
        // Keep the form usable if these lists cannot be loaded.
      });

    return () => {
      cancelled = true;
    };
  }, []);

  // Load an existing bill when Modify is selected.
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

        const patientData =
          bill.patientDetails ??
          bill.patientInfo ??
          (bill.patient && typeof bill.patient === "object"
            ? bill.patient
            : null) ??
          {};

        const parsedName = splitPatientName(getPatientName(bill, patientData));

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
          title: patientData.title || parsedName.title,
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
          email: String(patientData.email ?? bill.email ?? ""),
          address: String(patientData.address ?? bill.address ?? ""),
          aadhaar: String(
            patientData.aadhaar ??
              patientData.aadhaarNumber ??
              bill.aadhaar ??
              "",
          ),
          history: String(
            patientData.history ??
              patientData.patientHistory ??
              bill.history ??
              "",
          ),
        });

        const referrerValue =
          bill.referrerId ??
          getId(bill.referrer) ??
          (typeof bill.referrer === "string" ? bill.referrer : "") ??
          "";

        const agentValue =
          bill.sampleCollectionAgentId ??
          getId(bill.sampleCollectionAgent) ??
          getId(bill.agent) ??
          (typeof bill.agent === "string" ? bill.agent : "") ??
          "";

        setReferrer(String(referrerValue));
        setAgent(String(agentValue));

        const loadedInvestigations = getTestArraysFromBill(bill);

        setInvestigations(loadedInvestigations);

        setActiveModalities(
          MODALITIES.filter(
            ({ key }) => loadedInvestigations[key]?.length > 0,
          ).map(({ key }) => key),
        );

        const savedPayments = bill.investigationPayments ?? {};

        setInvestigationPayments(
          Object.fromEntries(
            MODALITIES.map(({ key }) => {
              const saved = savedPayments[key] ?? {};

              return [
                key,
                {
                  paid: String(saved.paid ?? ""),
                  discount: String(saved.discount ?? "0"),
                },
              ];
            }),
          ),
        );

        const payment = bill.payment ?? bill.paymentDetails ?? {};

        setDiscount(String(getNumericValue(payment.discount, bill.discount)));

        setReceived(
          String(
            getNumericValue(
              payment.received,
              payment.amountReceived,
              bill.paid,
              bill.amountReceived,
            ),
          ),
        );

        setCharge(
          String(
            getNumericValue(payment.collectionCharge, bill.collectionCharge),
          ),
        );

        setPaymentMode(
          payment.mode ?? payment.paymentMode ?? bill.paymentMode ?? "cash",
        );

        setRemarks(String(payment.remarks ?? bill.remarks ?? ""));

        setOptionalSections(
          OPTIONAL_FIELDS.filter(({ key }) => {
            const value = patientData[key] ?? bill[key];

            return value !== undefined && value !== null && value !== "";
          }).map(({ key }) => key),
        );
      } catch (error) {
        if (!cancelled) {
          setCreateError(
            error?.message || "Could not load this bill. Please try again.",
          );
        }
      } finally {
        if (!cancelled) setLoadingBill(false);
      }
    }

    loadBillForEditing();

    return () => {
      cancelled = true;
    };
  }, [editId]);

  // Sum the prices of all added investigations.
  const investigationTotal = useMemo(
    () =>
      Object.values(investigations)
        .flat()
        .reduce((sum, test) => sum + getNumericValue(test.price), 0),
    [investigations],
  );

  // Overall total includes investigation prices and collection charge.
  const total = investigationTotal + getNumericValue(charge);

  // Overall balance is calculated separately from investigation-level payments.
  const balance = Math.max(
    0,
    total - getNumericValue(discount) - getNumericValue(received),
  );

  const toggleModality = (key) => {
    if (activeModalities.includes(key)) {
      setActiveModalities((current) => current.filter((item) => item !== key));

      setInvestigations((current) => ({
        ...current,
        [key]: [],
      }));

      setInvestigationPayments((current) => ({
        ...current,
        [key]: {
          paid: "",
          discount: "0",
        },
      }));

      return;
    }

    setActiveModalities((current) => [...current, key]);
  };

  const addTest = (key, test) => {
    const newTest = {
      ...test,
      id: `${key}-${Date.now()}-${Math.random()}`,
      price: getNumericValue(test.price),
    };

    setInvestigations((current) => ({
      ...current,
      [key]: [...(current[key] || []), newTest],
    }));

    setActiveModalities((current) =>
      current.includes(key) ? current : [...current, key],
    );
  };

  const removeTest = (key, id) => {
    setInvestigations((current) => ({
      ...current,
      [key]: current[key].filter((test) => String(test.id) !== String(id)),
    }));
  };

  async function createBill() {
    setCreateError("");

    if (!patient.mobile || !/^\d{10}$/.test(patient.mobile)) {
      setCreateError("Enter a valid 10-digit mobile number.");
      return;
    }

    if (!patient.title || !patient.firstName.trim() || !patient.sex) {
      setCreateError("Please fill in the required patient details.");
      return;
    }

    if (patient.years === "" && patient.months === "" && patient.days === "") {
      setCreateError("Please enter the patient's age.");
      return;
    }

    const hasInvestigations = Object.values(investigations).some(
      (tests) => tests.length > 0,
    );

    if (!hasInvestigations) {
      setCreateError("Please add at least one investigation.");
      return;
    }

    const invalidPayment = MODALITIES.some(({ key }) => {
      const payment = investigationPayments[key] || {};

      return (
        getNumericValue(payment.paid) < 0 ||
        getNumericValue(payment.discount) < 0
      );
    });

    if (
      invalidPayment ||
      getNumericValue(discount) < 0 ||
      getNumericValue(received) < 0 ||
      getNumericValue(charge) < 0
    ) {
      setCreateError("Payment amounts cannot be negative.");
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

      const referrerName = selectedReferrer
        ? [
            selectedReferrer.title,
            selectedReferrer.firstName,
            selectedReferrer.lastName,
          ]
            .filter(Boolean)
            .join(" ")
        : "Self";

      const investigationsPayload = Object.fromEntries(
        MODALITIES.map(({ key }) => [
          key,
          investigations[key].map(({ id, _id, ...test }) => ({
            ...test,
            price: getNumericValue(test.price),
          })),
        ]),
      );

      const investigationPaymentsPayload = Object.fromEntries(
        MODALITIES.map(({ key }) => [
          key,
          {
            paid: getNumericValue(investigationPayments[key]?.paid),
            discount: getNumericValue(investigationPayments[key]?.discount),
          },
        ]),
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
        referrerName,

        sampleCollectionAgentId: agent || null,
        sampleCollectionAgentName: selectedAgent?.name || "",

        collectionCentre: "Main",

        investigations: investigationsPayload,

        investigationPayments: investigationPaymentsPayload,

        investigationItems: MODALITIES.flatMap(({ key }) =>
          investigations[key].map((test) => ({
            ...test,
            price: getNumericValue(test.price),
            type: key,
            modality: key,
          })),
        ),

        payment: {
          total: Number(total),
          discount: getNumericValue(discount),
          received: getNumericValue(received),
          collectionCharge: getNumericValue(charge),
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
        const savedId = getId(savedBill) || getId(savedBill?.bill);

        if (!savedId) {
          throw new Error("The server did not return the created bill ID.");
        }

        navigate(`/cases/bill-details/${savedId}`);
      }
    } catch (error) {
      setCreateError(
        error?.message && error.message !== "[object Object]"
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

      {loadingBill && <p className="bills-message">Loading bill details...</p>}

      {createError && (
        <div className="api-error" role="alert">
          {createError}
        </div>
      )}

      <fieldset
        disabled={loadingBill || creating}
        style={{
          border: 0,
          padding: 0,
          margin: 0,
          minWidth: 0,
        }}
      >
        {/* PATIENT DETAILS */}
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
                p("mobile", event.target.value.replace(/\D/g, "").slice(0, 10))
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

          <label className="nb-check">
            <input
              type="checkbox"
              checked={patient.online}
              onChange={(event) => p("online", event.target.checked)}
            />{" "}
            Online report requested
          </label>

          <div className="nb-optional-fields">
            {optionalSections.map((key) => {
              const field = OPTIONAL_FIELDS.find((item) => item.key === key);

              if (!field) return null;

              return (
                <div className="nb-optional-field" key={field.key}>
                  <div className="nb-optional-heading">
                    <label htmlFor={`patient-${field.key}`}>
                      {field.label}
                      <span className="nb-optional-badge">Optional</span>
                    </label>

                    <button
                      type="button"
                      className="nb-remove-field"
                      onClick={() => removeOptionalField(field.key)}
                    >
                      <X size={13} />
                      Remove
                    </button>
                  </div>

                  {field.type === "textarea" ? (
                    <textarea
                      id={`patient-${field.key}`}
                      value={patient[field.key]}
                      placeholder={field.placeholder}
                      onChange={(event) => p(field.key, event.target.value)}
                      rows={3}
                    />
                  ) : (
                    <input
                      id={`patient-${field.key}`}
                      type={field.type}
                      value={patient[field.key]}
                      placeholder={field.placeholder}
                      maxLength={field.key === "aadhaar" ? 12 : undefined}
                      onChange={(event) =>
                        p(
                          field.key,
                          field.key === "aadhaar"
                            ? event.target.value.replace(/\D/g, "").slice(0, 12)
                            : event.target.value,
                        )
                      }
                    />
                  )}
                </div>
              );
            })}
          </div>

          <div className="nb-pills">
            {OPTIONAL_FIELDS.filter(
              (field) => !optionalSections.includes(field.key),
            ).map((field) => (
              <button
                type="button"
                key={field.key}
                onClick={() => addOptionalField(field.key)}
              >
                <Plus size={12} />
                {field.label}
              </button>
            ))}
          </div>
        </section>

        {/* CASE DETAILS */}
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
                        [item.title, item.firstName, item.lastName]
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

              <button
                type="button"
                className="nb-link"
                onClick={() => navigate("/cases/referral-doctors")}
              >
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
            </div>
          </div>

          {/* INVESTIGATION MODALITIES */}
          <div
            className="nb-lab-buttons nb-modality-grid"
            aria-label="Investigation modalities"
          >
            {MODALITIES.map(({ key, label, icon: Icon }) => {
              const selected = activeModalities.includes(key);

              return (
                <button
                  type="button"
                  key={key}
                  className={`nb-modality-button ${selected ? "on" : ""}`}
                  aria-pressed={selected}
                  title={
                    selected
                      ? `Remove ${label} section`
                      : `Add ${label} section`
                  }
                  onClick={() => toggleModality(key)}
                >
                  <span className="nb-modality-icon">
                    <Icon size={18} strokeWidth={2} />
                  </span>

                  <span>{label}</span>
                </button>
              );
            })}
          </div>

          {/* INVESTIGATIONS WITH INDEPENDENT PAID AND DISCOUNT */}
          {activeModalities.map((key) => (
            <Investigation
              key={key}
              modality={key}
              rows={investigations[key] || []}
              payment={investigationPayments[key] || { paid: "", discount: 0 }}
              onPaymentChange={(field, value) =>
                updateInvestigationPayment(key, field, value)
              }
              add={() => {
                setSelectedModality(key);
                setModal("test");
              }}
              remove={(id) => removeTest(key, id)}
              removeSection={() => toggleModality(key)}
              setSelectedModality={setSelectedModality}
              openRateList={() => {
                setSelectedModality(key);
                setModal("ratelist");
              }}
            />
          ))}

          {/* OVERALL PAYMENT DETAILS */}
          <div className="nb-payment">
            <b>Payment Details:</b>

            <div>
              <Pay label="Total: Rs." value={total} plain />

              <Pay label="Discount" value={discount} set={setDiscount} />

              <Pay label="Amount received" value={received} set={setReceived} />

              <Pay label="Balance: Rs." value={balance} plain red />

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

            <div className="nb-charge">
              <label>Collection Charge:</label>

              <input
                type="number"
                min="0"
                value={charge}
                onChange={(event) => setCharge(event.target.value)}
              />
            </div>
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

      {/* ADD REFERRER */}
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
              setCreateError(
                error?.message || "Could not create the referrer.",
              );
            }
          }}
        />
      )}

      {/* ADD SAMPLE COLLECTION AGENT */}
      {modal === "agent" && (
        <AgentModal
          close={() => setModal(null)}
          save={async (name) => {
            try {
              const response = await agentApiService.create({
                name,
              });

              const result = getResponseData(response);
              const item = result?.agent ?? result;

              setAgents((current) => [...current, item]);
              setAgent(String(getId(item) || item.name));
              setModal(null);
            } catch (error) {
              setCreateError(
                error?.message ||
                  "Could not create the sample collection agent.",
              );
            }
          }}
        />
      )}

      {/* ADD INVESTIGATION */}
      {modal === "test" && (
        <TestModal
          title={`Add ${getInvestigationTitle(selectedModality).replace(
            " Investigations",
            "",
          )} investigation`}
          close={() => setModal(null)}
          save={(test) => {
            addTest(selectedModality, test);
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
function Investigation({
  modality,
  rows,
  add,
  remove,
  removeSection,
  payment,
  onPaymentChange,
  openRateList,
}) {
  // Available investigation tests
  const investigationTests = [
    { id: "abg", name: "ABG", price: 100 },
    { id: "ada", name: "ADA", price: 100 },
    { id: "aec", name: "AEC", price: 100 },
    { id: "afb", name: "AFB", price: 100 },
    { id: "afp", name: "AFP", price: 100 },
    { id: "amylase", name: "Amylase", price: 250 },
    { id: "bilirubin", name: "Bilirubin", price: 150 },
    { id: "cbc", name: "CBC", price: 200 },
    { id: "creatinine", name: "Creatinine", price: 120 },
    { id: "crp", name: "CRP", price: 300 },
  ];

  /*
   * Initialize state: use passed rows if available, otherwise default to an empty list.
   */
  const [selectedTests, setSelectedTests] = useState(rows ?? []);

  /*
   * Keep selectedTests in sync if parent updates the rows prop.
   */
  useEffect(() => {
    if (rows) {
      setSelectedTests(rows);
    }
  }, [rows]);

  /*
   * Calculate total
   */
  const sum = selectedTests.reduce(
    (total, test) => total + getNumericValue(test.price),
    0
  );

  /*
   * Payment values
   */
  const paid = getNumericValue(payment?.paid);
  const testDiscount = getNumericValue(payment?.discount);

  /*
   * Due amount
   */
  const due = Math.max(0, sum - paid - testDiscount);

  /*
   * Select another investigation directly.
   */
  const handleSelectTest = (event) => {
    const selectedId = event.target.value;

    if (!selectedId) return;

    const selectedTest = investigationTests.find(
      (test) => test.id === selectedId
    );

    if (!selectedTest) return;

    // Prevent duplicate test selection
    const alreadyExists = selectedTests.some(
      (test) => test.id === selectedTest.id
    );

    if (!alreadyExists) {
      setSelectedTests((prev) => [...prev, selectedTest]);
    }

    // Reset dropdown value after selection
    event.target.value = "";
  };

  /*
   * Remove investigation from the displayed list
   */
  const handleRemoveTest = (testId) => {
    setSelectedTests((prev) =>
      prev.filter((test) => test.id !== testId)
    );

    if (remove) {
      remove(testId);
    }
  };

  return (
    <div className="nb-invest">
      {/* Remove complete investigation modality */}
      <button
        type="button"
        className="nb-remove-modality"
        title={`Remove ${getInvestigationTitle(modality)}`}
        aria-label={`Remove ${getInvestigationTitle(modality)}`}
        onClick={removeSection}
      >
        <X size={15} />
      </button>

      <div className="nb-invest-content">
        <div className="nb-invest-header">
          <div className="nb-invest-main">
            {/* Investigation title */}
            <label className="nb-invest-title">
              {getInvestigationTitle(modality)}
            </label>

            {/* INVESTIGATION TEST LIST */}
            <div className="nb-tests">
              {/* Dropdown */}
              <select
                className="nb-test-select"
                defaultValue=""
                onChange={handleSelectTest}
              >
                <option value="">Select Investigation</option>

                {investigationTests.map((test) => (
                  <option key={test.id} value={test.id}>
                    {test.name} (Rs.{test.price})
                  </option>
                ))}
              </select>

              {/* Selected tests list */}
              <div className="nb-selected-tests">
                {selectedTests.map((test) => (
                  <span key={test.id} className="nb-test-item">
                    {test.name} · Rs. {getNumericValue(test.price)}
                    <button
                      type="button"
                      aria-label={`Remove ${test.name}`}
                      title={`Remove ${test.name}`}
                      onClick={() => handleRemoveTest(test.id)}
                    >
                      <X size={13} />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* ACTIONS */}
            <div className="nb-invest-actions">
              <button type="button" className="nb-link" onClick={add}>
                <Plus size={12} />
                Add New
              </button>

              <button
                type="button"
                className="nb-link"
                onClick={openRateList}
                title="View investigation rate list"
              >
                <List size={12} />
                Ratelist
              </button>
            </div>

            {/* TOTAL / DUE */}
            <small>
              Total: Rs. {sum}, Due: Rs. {due}
            </small>

            {/* SAMPLE COLLECTION */}
            {modality === "lab" && (
              <div>
                <button type="button" className="nb-pill">
                  <Plus size={12} />
                  Sample collected at
                </button>
              </div>
            )}
          </div>

          {/* PAID */}
          <div className="nb-invest-payment-field">
            <label htmlFor={`paid-${modality}`}>* Paid</label>
            <input
              id={`paid-${modality}`}
              type="number"
              min="0"
              value={payment?.paid ?? ""}
              onChange={(event) =>
                onPaymentChange("paid", event.target.value)
              }
            />
          </div>

          {/* DISCOUNT */}
          <div className="nb-invest-payment-field">
            <label htmlFor={`discount-${modality}`}>* Discount</label>
            <input
              id={`discount-${modality}`}
              type="number"
              min="0"
              value={payment?.discount ?? "0"}
              onChange={(event) =>
                onPaymentChange("discount", event.target.value)
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function Modal({ title, close, children, wide = "" }) {
  return (
    <div
      className="nb-backdrop"
      onMouseDown={(event) => event.target === event.currentTarget && close()}
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
    setForm((current) => ({
      ...current,
      [key]: value,
    }));

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
        disabled={!form.first.trim()}
        onClick={() =>
          save({
            title: form.title,
            firstName: form.first.trim(),
            lastName: form.last.trim(),
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
    <Modal title="Add new sample collection agent" close={close} wide="agent">
      <label>* Name</label>

      <input value={name} onChange={(event) => setName(event.target.value)} />

      <br />

      <button
        type="button"
        className="nb-primary nb-save"
        disabled={!name.trim()}
        onClick={() => save(name.trim())}
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
        <Field label="Investigation / Test*" value={name} set={setName} />

        <Field label="Rate (Rs.)*" value={price} set={setPrice} />
      </div>

      <button
        type="button"
        className="nb-primary"
        disabled={!name.trim() || price === ""}
        onClick={() =>
          save({
            name: name.trim(),
            price: getNumericValue(price),
          })
        }
      >
        Add Investigation
      </button>
    </Modal>
  );
}
