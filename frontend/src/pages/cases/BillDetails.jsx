
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Printer,
  Pencil,
  FileText,
  UserRound,
  MessageCircle,
  Settings,
  FlaskConical,
  History,
  Stethoscope,
  Clock3,
  CalendarDays,
  Eye,
  ChevronDown,
  Star,
  Plus,
  Activity,
  ChevronRight,
} from "lucide-react";

import { billingApiService } from "../../api";
import { apiObject } from "../../api/core/apiData";
import "./bill-details.css";

function formatDate(value) {
  if (!value) return "—";

  const date = new Date(value);

  return Number.isNaN(date.getTime())
    ? "—"
    : date.toLocaleDateString("en-GB");
}

function formatTime(value) {
  if (!value) return "—";

  const date = new Date(value);

  return Number.isNaN(date.getTime())
    ? "—"
    : date.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
      });
}

function money(value) {
  return `Rs. ${Number(value || 0).toLocaleString("en-IN")}`;
}

export default function BillDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [bill, setBill] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeSidebar, setActiveSidebar] = useState("Patient info");

  useEffect(() => {
    let active = true;

    async function loadBill() {
      try {
        setLoading(true);
        setError("");

        const response = await billingApiService.getById(id);

        if (active) {
          setBill(apiObject(response));
        }
      } catch (err) {
        if (active) {
          setError(err?.message || "Could not load this bill.");
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    loadBill();

    return () => {
      active = false;
    };
  }, [id]);

  if (loading) {
    return <div className="bill-page">Loading bill...</div>;
  }

  if (error || !bill) {
    return (
      <div className="bill-page">
        <p className="api-error">{error || "Bill not found."}</p>

        <button
          className="bill-button"
          onClick={() => navigate("/cases/bills")}
        >
          <ArrowLeft size={14} />
          Back to bills
        </button>
      </div>
    );
  }

  const patient = bill.patientDetails || {};

  const rawInvestigations = bill.investigations;

  const investigations = Array.isArray(rawInvestigations)
    ? rawInvestigations
    : [
        ...(Array.isArray(rawInvestigations?.lab)
          ? rawInvestigations.lab
          : []),
        ...(Array.isArray(rawInvestigations?.outsource)
          ? rawInvestigations.outsource
          : []),
      ];

  const patientName =
    bill.patientName ||
    bill.patient ||
    [patient.title, patient.firstName, patient.lastName]
      .filter(Boolean)
      .join(" ") ||
    "—";

  const mobile = bill.mobile || patient.mobile || "";
  const age = bill.age || patient.age || "—";
  const sex = bill.sex || patient.sex || "—";
  const billNumber = bill.billNo || bill.regNo || bill.id;
  const date = formatDate(bill.createdAt);
  const time = formatTime(bill.createdAt);

  const transactions = Array.isArray(bill.transactions)
    ? bill.transactions
    : [];

  // Only display activities actually returned by the API.
  const activities = Array.isArray(bill.activities)
    ? bill.activities
    : [];

  const sidebarItems = [
    { label: "Patient info", icon: UserRound },
    { label: "Doctor info", icon: Stethoscope },
    { label: "Patient history", icon: History },
    { label: "Recent lab reports", icon: FileText },
  ];

  function openWhatsApp(message) {
    if (!mobile) {
      window.alert("No patient mobile number is available.");
      return;
    }

    // Add India's country code for a typical 10-digit mobile number.
    const digits = mobile.replace(/\D/g, "");
    const phone =
      digits.length === 10 ? `91${digits}` : digits;

    window.open(
      `https://wa.me/${phone}?text=${encodeURIComponent(message)}`,
      "_blank",
      "noopener,noreferrer"
    );
  }

  function shareBill() {
    const message = [
      `Bill details - ${billNumber}`,
      `Patient: ${patientName}`,
      `Date: ${date}`,
      `Total: ${money(bill.total)}`,
      `Paid: ${money(bill.received)}`,
      `Balance: ${money(bill.balance)}`,
    ].join("\n");

    openWhatsApp(message);
  }

  function requestReview() {
    openWhatsApp(
      `Hello ${patientName}, we would appreciate your feedback about your experience with Advance Edge Diagnosis. Thank you!`
    );
  }

  function handleSidebarClick(label) {
    setActiveSidebar(label);

    if (label === "Patient info") {
      window.alert(
        `Patient: ${patientName}\nMobile: ${mobile || "—"}\nUHID: ${bill.uhid || patient.uhid || "—"}`
      );
    } else if (label === "Doctor info") {
      window.alert(
        `Referred by: ${bill.referrerName || bill.referrer || "Self"}`
      );
    } else if (label === "Patient history") {
      window.alert("Patient history is not connected yet.");
    } else {
      window.alert("The lab reports page is not connected yet.");
    }
  }

  return (
    <div className="bill-page">
      {/* Breadcrumb and toolbar */}
      <div className="bill-topbar">
        <div className="bill-breadcrumbs">
          <button onClick={() => navigate("/dashboard")}>
            Dashboard
          </button>

          <ChevronRight size={12} />

          <span>Bill #{billNumber}</span>
        </div>

        <div className="bill-toolbar-actions">
          <button
            className="bill-button"
            onClick={() => navigate("/cases/bills")}
          >
            <ArrowLeft size={13} />
            All bills
          </button>

          <button
            className="bill-button"
            onClick={() => window.print()}
          >
            <Printer size={13} />
            Print
          </button>

          <button
            className="bill-button"
            onClick={() => navigate("/cases/new-bill")}
          >
            <span>+</span>
            New bill
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="bill-workspace">
        {/* LEFT: Receipt and action buttons */}
        <section className="bill-left-column">
          <div className="bill-receipt">
            <div className="bill-receipt-header">
              <h2>ADVANCE EDGE DIAGNOSIS</h2>
              <p>CHS Apollo Hospital Gesa Colony</p>
              <p>Hospital Road</p>
              <p>Phone no.: 7049390120</p>
            </div>

            <div className="bill-barcode">
              <div
                className="bill-barcode-lines"
                aria-hidden="true"
              />
              <small>{billNumber}</small>
            </div>

            <div className="bill-number">
              <span>
                Bill no. {billNumber}
              </span>

              <strong>{bill.caseNo || "—"}</strong>
            </div>

            <div className="bill-patient-summary">
              <div>
                <p>
                  <b>Reg. no.:</b>{" "}
                  {bill.registrationNo || bill.regNo || bill.id}
                </p>

                <p>
                  <b>UHID:</b>{" "}
                  {bill.uhid || patient.uhid || "—"}
                </p>

                <p>
                  <b>Name:</b> {patientName}
                </p>

                <p>
                  <b>Age / Sex:</b> {age} / {sex}
                </p>
              </div>

              <div className="bill-referred">
                <p>
                  <b>Referred by:</b>{" "}
                  {bill.referrerName || bill.referrer || "Self"}
                </p>

                <p>
                  <b>Date:</b> {date}
                </p>

                <p>
                  <b>Received by:</b>{" "}
                  {bill.receivedByName || bill.createdByName || "—"}
                </p>
              </div>
            </div>

            <p className="bill-case-heading">Case Details:</p>

            <div className="bill-table-heading">
              <span>Lab Investigations</span>
              <span>Fee</span>
            </div>

            {investigations.map((test, index) => (
              <div
                className="bill-test-row"
                key={test.id || test._id || index}
              >
                <span>
                  {test.name ||
                    test.testName ||
                    test.label ||
                    "Investigation"}
                </span>

                <span>
                  {money(test.price ?? test.fee ?? test.amount)}
                </span>
              </div>
            ))}

            {!investigations.length && (
              <p className="bill-empty">
                No investigations added.
              </p>
            )}

            <p className="bill-case-heading">Payment Details:</p>

            <div className="bill-total-row">
              <span>Total Fees:</span>
              <span>{money(bill.total)}</span>
            </div>

            <div className="bill-total-row">
              <span>Discount:</span>
              <span>{money(bill.discount)}</span>
            </div>

            <div className="bill-total-row">
              <span>Amount Paid:</span>
              <span>{money(bill.received)}</span>
            </div>

            {bill.amountInWords && (
              <div className="bill-total-row">
                <span>Amount (in words):</span>
                <span>{bill.amountInWords}</span>
              </div>
            )}

            <div className="bill-thank-you">
              ~~~ Thank You ~~~
            </div>
          </div>

          {/* Horizontal actions, like the reference */}
          <div className="bill-receipt-actions">
            <button
              className="bill-action-button bill-action-primary"
              onClick={() => window.print()}
            >
              <Printer size={13} />
              Print
              <ChevronDown size={11} />
            </button>

            <button
              className="bill-action-button"
              onClick={() =>
                window.alert(
                  "Bill modification is not connected yet."
                )
              }
            >
              <Pencil size={13} />
              Modify
            </button>

            <button
              className="bill-action-button"
              onClick={() =>
                window.alert(
                  "The lab report page is not connected yet."
                )
              }
            >
              <Eye size={13} />
              View lab report
            </button>

            <button
              className="bill-action-button bill-whatsapp-button"
              onClick={shareBill}
            >
              <MessageCircle size={13} />
              WhatsApp bill
              <ChevronDown size={11} />
            </button>

            <button
              className="bill-action-button"
              onClick={() => window.print()}
            >
              <Settings size={13} />
              Print Settings
            </button>
          </div>
        </section>

        {/* CENTER: Transaction history, activities, review */}
        <main className="bill-center-column">
          <div className="bill-panel bill-transactions-panel">
            <h3>
              <FileText size={14} />
              Transaction history
              <span className="bill-info-icon">i</span>
            </h3>

            <div className="bill-data-table bill-transaction-table">
              <div className="bill-data-header">
                <span>DATE</span>
                <span>TIME</span>
                <span>AMOUNT</span>
                <span>RECEIVED BY</span>
                <span>MODE</span>
              </div>

              {transactions.map((transaction, index) => (
                <div
                  className="bill-data-row"
                  key={transaction.id || transaction._id || index}
                >
                  <span>
                    {formatDate(
                      transaction.date || transaction.createdAt
                    )}
                  </span>

                  <span>
                    {formatTime(
                      transaction.date || transaction.createdAt
                    )}
                  </span>

                  <span className="bill-positive-amount">
                    + {money(transaction.amount)}
                  </span>

                  <span>
                    {transaction.receivedByName ||
                      transaction.receivedBy ||
                      "—"}
                  </span>

                  <span>
                    {transaction.mode || bill.mode || "Cash"}
                  </span>
                </div>
              ))}

              {!transactions.length && (
                <div className="bill-table-empty">
                  <Clock3 size={16} />
                  <p>No recent transactions to show.</p>
                </div>
              )}
            </div>
          </div>

          <div className="bill-activities-section">
            <h3 className="bill-section-title">
              Activities
              <span className="bill-feature-badge">
                ★ Advanced plan feature
              </span>
            </h3>

            <div className="bill-data-table bill-activities-table">
              <div className="bill-data-header">
                <span>DATE</span>
                <span>TIME</span>
                <span>SUMMARY</span>
                <span>BY</span>
              </div>

              {activities.map((activity, index) => (
                <div
                  className="bill-data-row"
                  key={activity.id || activity._id || index}
                >
                  <span>{formatDate(activity.date || activity.createdAt)}</span>

                  <span>{formatTime(activity.date || activity.createdAt)}</span>

                  <span>
                    {activity.summary || activity.description || "Activity"}
                  </span>

                  <span>
                    {activity.byName || activity.createdByName || "—"}
                  </span>
                </div>
              ))}

              {!activities.length && (
                <div className="bill-table-empty">
                  <Clock3 size={16} />
                  <p>No recent activities to show.</p>
                </div>
              )}
            </div>
          </div>

          <div className="bill-review-section">
            <h3>Request a review from the patient</h3>

            <div className="bill-review-actions">
              <button
                className="bill-ask-review"
                onClick={requestReview}
              >
                Ask review
                <ChevronDown size={12} />
              </button>

              <button
                className="bill-google-review"
                onClick={() =>
                  window.alert(
                    "Add your clinic's Google Review link to enable this feature."
                  )
                }
              >
                <Settings size={12} />
                Setup google review
              </button>
            </div>
          </div>
        </main>

        {/* RIGHT: Compact sidebar */}
        {/* RIGHT: Sidebar matching the reference design */}
<aside className="bill-patient-sidebar">
  <div className="bill-sidebar-header">
    <span>Sidebar</span>
    <button
      type="button"
      className="bill-sidebar-toggle"
      title="Collapse sidebar"
      onClick={(event) => {
        event.currentTarget
          .closest(".bill-patient-sidebar")
          .classList.toggle("bill-sidebar-collapsed");
      }}
    >
      <ArrowLeft size={13} />
    </button>
  </div>

  <div className="bill-sidebar-items">
    <div className="bill-sidebar-item">
      <div className="bill-sidebar-icon patient-icon">
        <UserRound size={15} />
      </div>

      <span className="bill-sidebar-label">Patient info</span>

      <button
        type="button"
        className="bill-sidebar-action"
        title="Edit patient information"
        onClick={() =>
          window.alert("Patient information editing is not connected yet.")
        }
      >
        <Pencil size={12} />
      </button>

      <button
        type="button"
        className="bill-sidebar-action"
        title="View patient information"
        onClick={() =>
          window.alert(
            `${patientName}\nMobile: ${mobile || "—"}\nUHID: ${
              bill.uhid || patient.uhid || "—"
            }`
          )
        }
      >
        <Eye size={12} />
      </button>
    </div>

    <div className="bill-sidebar-item">
      <div className="bill-sidebar-icon doctor-icon">
        <UserRound size={15} />
      </div>

      <span className="bill-sidebar-label">Doctor info</span>

      <button
        type="button"
        className="bill-sidebar-action"
        title="View doctor information"
        onClick={() =>
          window.alert(
            `Referred by: ${bill.referrerName || bill.referrer || "Self"}`
          )
        }
      >
        <Pencil size={12} />
      </button>
    </div>

    <div className="bill-sidebar-item">
      <div className="bill-sidebar-icon history-icon">
        <History size={15} />
      </div>

      <span className="bill-sidebar-label">Patient history</span>

      <button
        type="button"
        className="bill-sidebar-action"
        title="View patient history"
        onClick={() =>
          window.alert("Patient history is not connected yet.")
        }
      >
        <Pencil size={12} />
      </button>
    </div>

    <div className="bill-sidebar-item">
      <div className="bill-sidebar-icon reports-icon">
        <FileText size={15} />
      </div>

      <span className="bill-sidebar-label">Recent lab reports</span>
    </div>
  </div>
</aside>
      </div>
    </div>
  );
}