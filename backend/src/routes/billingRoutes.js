
import { Router } from "express";
import { store, nextId } from "../store.js";

const r = Router();

function getPatientName(patient = {}) {
  return [
    patient.title,
    patient.firstName,
    patient.lastName,
  ]
    .filter(Boolean)
    .join(" ")
    .trim();
}

function getAge(patient = {}) {
  const parts = [];

  if (patient.years !== "") {
    parts.push(`${patient.years} YRS`);
  }

  if (patient.months !== "") {
    parts.push(`${patient.months} MOS`);
  }

  if (patient.days !== "") {
    parts.push(`${patient.days} DAYS`);
  }

  return parts.join(" ") || "";
}

function getInvestigations(value) {
  if (Array.isArray(value)) return value;

  const lab = (value?.lab || []).map((test) => ({
    ...test,
    section: "LABORATORY",
    type: "lab",
  }));

  const outsource = (value?.outsource || []).map((test) => ({
    ...test,
    section: "OUTSOURCE LAB",
    type: "outsource",
  }));

  return [...lab, ...outsource];
}

r.get("/", (req, res) => {
  res.json({ items: store.bills });
});

r.get("/:id", (req, res) => {
  const bill = store.bills.find(
    (item) => String(item.id) === String(req.params.id),
  );

  if (!bill) {
    return res.status(404).json({
      message: "Bill not found",
    });
  }

  return res.json(bill);
});

r.post("/", (req, res) => {
  const body = req.body || {};
  const patientDetails = body.patient || {};
  const payment = body.payment || {};

  const investigations = getInvestigations(body.investigations);

  const patientName =
    body.patientName || getPatientName(patientDetails);

  const age = getAge(patientDetails);

  const referrer = store.referrers.find(
    (item) =>
      String(item.id) === String(body.referrerId) ||
      item.name === body.referrerName,
  );

  const agent = store.agents.find(
    (item) =>
      String(item.id) === String(body.sampleCollectionAgentId) ||
      item.name === body.sampleCollectionAgentName,
  );

  const id = nextId(store.bills);
  const createdAt = new Date().toISOString();

  const total =
    Number(payment.total ?? body.total) ||
    investigations.reduce(
      (sum, test) => sum + Number(test.price || 0),
      0,
    ) + Number(payment.collectionCharge || 0);

  const discount = Number(payment.discount ?? body.discount ?? 0);
  const received = Number(payment.received ?? body.received ?? 0);
  const balance = Math.max(0, total - discount - received);

  const regNo = String(41025 + id - 1);
  const caseNo = `L${82 + id - 1}`;

  const bill = {
    id,
    billNo: regNo,
    regNo,
    registrationNo: regNo,
    caseNo,
    status: "Active",

    createdAt,

    patient: patientName,
    patientName,
    patientDetails: {
      ...patientDetails,
      age,
    },

    mobile: patientDetails.mobile || "",
    uhid: patientDetails.uhid || "",
    age,
    sex: patientDetails.sex || "",
    onlineReportRequested: Boolean(patientDetails.online),

    referrerId: body.referrerId || null,
    referrer: referrer
      ? [
          referrer.title,
          referrer.firstName,
          referrer.lastName,
        ]
          .filter(Boolean)
          .join(" ")
      : body.referrerName || "Self",
    referrerName: referrer
      ? [
          referrer.title,
          referrer.firstName,
          referrer.lastName,
        ]
          .filter(Boolean)
          .join(" ")
      : body.referrerName || "Self",

    sampleCollectionAgentId:
      body.sampleCollectionAgentId || null,
    sampleCollectionAgentName:
      agent?.name || body.sampleCollectionAgentName || "",

    collectionCentre: body.collectionCentre || "Main",

    investigations,

    total,
    discount,
    received,
    paid: received,
    balance,

    collectionCharge: Number(payment.collectionCharge || 0),
    mode: payment.mode || body.mode || "cash",
    remarks: payment.remarks || body.remarks || "",

    payment: {
      ...payment,
      total,
      discount,
      received,
      balance,
    },

    transactions:
      received > 0
        ? [
            {
              id: 1,
              date: createdAt,
              amount: received,
              mode: payment.mode || body.mode || "cash",
              receivedBy: "",
            },
          ]
        : [],
  };

  store.bills.unshift(bill);

  const report = {
    id: nextId(store.reports),
    billId: id,
    regNo,
    patient: patientName,
    age,
    referrer: bill.referrer,
    status: "New",

    tests: investigations.map((test, index) => ({
      id: index + 1,
      section: test.section || "LABORATORY",
      name: test.name,
      value: "",
      unit: test.unit || "",
      reference: test.reference || "",
    })),

    interpretation: "",
    notes: "",
  };

  store.reports.unshift(report);

  return res.status(201).json(bill);
});

r.patch("/:id", (req, res) => {
  const bill = store.bills.find(
    (item) => String(item.id) === String(req.params.id),
  );

  if (!bill) {
    return res.status(404).json({
      message: "Bill not found",
    });
  }

  Object.assign(bill, req.body);

  return res.json(bill);
});

r.post("/:id/cancel", (req, res) => {
  const bill = store.bills.find(
    (item) => String(item.id) === String(req.params.id),
  );

  if (!bill) {
    return res.status(404).json({
      message: "Bill not found",
    });
  }

  bill.status = "Cancelled";
  bill.cancelReason = req.body.reason || "";

  return res.json(bill);
});

export default r;