
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  ChevronDown,
  ChevronRight,
  MoreHorizontal,
  CalendarDays,
  Eye,
  Printer,
  Plus,
  X,
} from "lucide-react";

import { billingApiService } from "../../api";
import useApiList from "../../api/core/useApiList";
import "./cases.css";

const load = (q) => billingApiService.list(q);

const money = (value) =>
  `Rs.${Number(value || 0).toLocaleString("en-IN")}`;

function getId(bill) {
  return bill.id ?? bill._id ?? bill.billId ?? bill.registrationNo ?? bill.regNo;
}

function getPatientName(bill) {
  if (bill.patientName) return bill.patientName;

  if (typeof bill.patient === "string") return bill.patient;

  const patient = bill.patientDetails || bill.patient || {};

  return [
    patient.title,
    patient.firstName,
    patient.lastName,
  ]
    .filter(Boolean)
    .join(" ") || "—";
}

function getPaid(bill) {
  return bill.paid ?? bill.received ?? bill.payment?.received ?? 0;
}

function getBalance(bill) {
  const explicitBalance = bill.balance ?? bill.payment?.balance;

  if (explicitBalance !== undefined && explicitBalance !== null) {
    return Number(explicitBalance) || 0;
  }

  return Math.max(
    0,
    Number(bill.total || bill.payment?.total || 0) -
      Number(getPaid(bill)) -
      Number(bill.discount || bill.payment?.discount || 0),
  );
}

function getStatus(bill) {
  if (bill.cancelled || String(bill.status || "").toLowerCase() === "cancelled") {
    return "Cancelled";
  }

  return getBalance(bill) > 0 ? "Due" : "No due";
}

function formatDateTime(value) {
  if (!value) return { date: "—", time: "" };

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return { date: String(value), time: "" };
  }

  return {
    date: date.toLocaleDateString("en-GB"),
    time: date.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    }),
  };
}

function getDateInputValue(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getBillDate(bill) {
  const value = bill.createdAt || bill.date || bill.billDate;
  if (!value) return null;

  const date = new Date(value);

  return Number.isNaN(date.getTime()) ? null : date;
}

function getReferrer(bill) {
  return (
    bill.referrerName ||
    bill.referrer ||
    bill.referrerDetails?.name ||
    "—"
  );
}

function getAgent(bill) {
  return (
    bill.sampleCollectionAgentName ||
    bill.agentName ||
    bill.agent?.name ||
    "—"
  );
}

function getCentre(bill) {
  return bill.collectionCentre || bill.collectionCenter || "Main";
}

export default function Bills() {
  const navigate = useNavigate();
  const { rows = [], loading, error, reload } = useApiList(load);

  const today = new Date();
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(today.getDate() - 6);

  const [duration, setDuration] = useState("7");
  const [fromDate, setFromDate] = useState(
    getDateInputValue(sevenDaysAgo),
  );
  const [toDate, setToDate] = useState(getDateInputValue(today));

  const [registrationNo, setRegistrationNo] = useState("");
  const [patientName, setPatientName] = useState("");
  const [referrer, setReferrer] = useState("");
  const [centre, setCentre] = useState("");
  const [agent, setAgent] = useState("");
  const [hasDue, setHasDue] = useState(false);
  const [cancelled, setCancelled] = useState(false);

  const [filters, setFilters] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const [menuId, setMenuId] = useState(null);

  const referrers = useMemo(
    () => [...new Set(rows.map(getReferrer).filter((x) => x !== "—"))],
    [rows],
  );

  const centres = useMemo(
    () => [...new Set(rows.map(getCentre).filter(Boolean))],
    [rows],
  );

  const agents = useMemo(
    () => [...new Set(rows.map(getAgent).filter((x) => x !== "—"))],
    [rows],
  );

  function updateDuration(value) {
    setDuration(value);

    const end = new Date();
    const start = new Date();

    if (value === "7") {
      start.setDate(end.getDate() - 6);
    } else if (value === "30") {
      start.setDate(end.getDate() - 29);
    } else if (value === "month") {
      start.setDate(1);
    }

    if (value !== "custom") {
      setFromDate(getDateInputValue(start));
      setToDate(getDateInputValue(end));
    }
  }

  function applyFilters(event) {
    event?.preventDefault();

    setFilters({
      fromDate,
      toDate,
      registrationNo: registrationNo.trim().toLowerCase(),
      patientName: patientName.trim().toLowerCase(),
      referrer,
      centre,
      agent,
      hasDue,
      cancelled,
    });
  }

  function clearFilters() {
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - 6);

    setDuration("7");
    setFromDate(getDateInputValue(start));
    setToDate(getDateInputValue(end));
    setRegistrationNo("");
    setPatientName("");
    setReferrer("");
    setCentre("");
    setAgent("");
    setHasDue(false);
    setCancelled(false);
    setFilters(null);
  }

  const filteredRows = useMemo(() => {
    if (!filters) return rows;

    return rows.filter((bill) => {
      const regNo = String(
        bill.registrationNo ?? bill.regNo ?? bill.id ?? "",
      ).toLowerCase();

      const patient = getPatientName(bill).toLowerCase();
      const billReferrer = getReferrer(bill);
      const billCentre = getCentre(bill);
      const billAgent = getAgent(bill);
      const status = getStatus(bill);
      const date = getBillDate(bill);

      if (
        filters.registrationNo &&
        !regNo.includes(filters.registrationNo)
      ) {
        return false;
      }

      if (
        filters.patientName &&
        !patient.includes(filters.patientName)
      ) {
        return false;
      }

      if (filters.referrer && billReferrer !== filters.referrer) {
        return false;
      }

      if (filters.centre && billCentre !== filters.centre) {
        return false;
      }

      if (filters.agent && billAgent !== filters.agent) {
        return false;
      }

      if (filters.hasDue && getBalance(bill) <= 0) {
        return false;
      }

      if (!filters.cancelled && status === "Cancelled") {
         return false;
      }

      if (filters.fromDate) {
        const start = new Date(`${filters.fromDate}T00:00:00`);

        if (!date || date < start) return false;
      }

      if (filters.toDate) {
        const end = new Date(`${filters.toDate}T23:59:59.999`);

        if (!date || date > end) return false;
      }

      return true;
    });
  }, [rows, filters]);

  function openBill(bill) {
    const id = getId(bill);

    if (!id) {
      window.alert("This bill does not have an ID to open.");
      return;
    }

    navigate(`/cases/bill-details/${id}`);
  }

  function printBill(bill) {
    openBill(bill);

    // Open the bill details page first. Use its Print button to print
    // the receipt after the page has loaded.
  }

  return (
    <div className="cases-page bills-page">
      <div className="bills-page-heading">
        <h1>All bills</h1>
      </div>

      <form className="case-filters bills-filter-panel" onSubmit={applyFilters}>
        <div className="case-field bills-duration-field">
          <label htmlFor="bill-duration">Duration ⓘ</label>

          <div className="bills-duration-control">
            <select
              id="bill-duration"
              value={duration}
              onChange={(event) => updateDuration(event.target.value)}
            >
              <option value="7">Past 7 days</option>
              <option value="30">Past 30 days</option>
              <option value="month">This month</option>
              <option value="custom">Custom</option>
            </select>

            <div className="bills-date-range">
              <CalendarDays size={14} />

              <input
                aria-label="From date"
                type="date"
                value={fromDate}
                onChange={(event) => {
                  setFromDate(event.target.value);
                  setDuration("custom");
                }}
              />

              <span>to</span>

              <input
                aria-label="To date"
                type="date"
                value={toDate}
                onChange={(event) => {
                  setToDate(event.target.value);
                  setDuration("custom");
                }}
              />
            </div>
          </div>
        </div>

        <div className="case-field bills-filter-field">
          <label htmlFor="bill-registration">Reg. no.</label>
          <input
            id="bill-registration"
            value={registrationNo}
            onChange={(event) => setRegistrationNo(event.target.value)}
          />
        </div>

        <div className="case-field bills-filter-field">
          <label htmlFor="bill-patient">Patient first name</label>
          <input
            id="bill-patient"
            value={patientName}
            onChange={(event) => setPatientName(event.target.value)}
          />
        </div>

        <div className="case-field bills-filter-field">
          <label htmlFor="bill-referrer">Referred by</label>
          <select
            id="bill-referrer"
            value={referrer}
            onChange={(event) => setReferrer(event.target.value)}
          >
            <option value="">All</option>
            {referrers.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </div>

        <div className="case-field bills-filter-field">
          <label htmlFor="bill-centre">Collection centre</label>
          <select
            id="bill-centre"
            value={centre}
            onChange={(event) => setCentre(event.target.value)}
          >
            <option value="">All</option>
            {centres.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </div>

        <div className="case-field bills-filter-field">
          <label htmlFor="bill-agent">Sample collection agent</label>
          <select
            id="bill-agent"
            value={agent}
            onChange={(event) => setAgent(event.target.value)}
          >
            <option value="">All</option>
            {agents.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </div>

        <div className="bills-filter-footer">
          <label className="bills-checkbox">
            <input
              type="checkbox"
              checked={hasDue}
              onChange={(event) => setHasDue(event.target.checked)}
            />
            Has due
          </label>

          <label className="bills-checkbox">
            <input
              type="checkbox"
              checked={cancelled}
              onChange={(event) => setCancelled(event.target.checked)}
            />
            Cancelled
          </label>

          <div className="bills-filter-buttons">
            <button type="submit" className="case-btn primary">
              <Search size={13} />
              Search
            </button>

            <button
              type="button"
              className="case-btn"
              onClick={clearFilters}
            >
              Clear
            </button>
          </div>
        </div>
      </form>

      {loading ? (
        <p className="bills-message">Loading bills...</p>
      ) : error ? (
        <div className="api-error">
          {String(error)}
          <button
            type="button"
            className="case-btn"
            onClick={() => reload({})}
          >
            Retry
          </button>
        </div>
      ) : (
        <div className="bills-table-container">
          <table className="bills-table">
            <thead>
              <tr>
                <th className="bills-expand-column" aria-label="Expand" />
                <th>REG. NO.</th>
                <th>DATE</th>
                <th>PATIENT</th>
                <th>REFERRED BY</th>
                <th>TOTAL</th>
                <th>PAID</th>
                <th>DISCOUNT</th>
                <th>STATUS</th>
                <th>ACTIONS</th>
              </tr>
            </thead>

            <tbody>
              {filteredRows.map((bill, index) => {
                const id = getId(bill) ?? `bill-${index}`;
                const dateTime = formatDateTime(
                  bill.createdAt || bill.date || bill.billDate,
                );
                const expanded = expandedId === id;
                const status = getStatus(bill);

                return (
                 <FragmentRow
                 key={id}
                  bill={bill}
             id={id}
               expanded={expanded}
           status={status}
             dateTime={dateTime}
             menuOpen={menuId === id}
        onToggleExpand={() => setExpandedId(expanded ? null : id)}
     onToggleMenu={() => setMenuId(menuId === id ? null : id)}
     onOpen={() => openBill(bill)}
     onPrint={() => printBill(bill)}
      onModify={() => {
        const billId = getId(bill);

         if (billId) {
         navigate(`/cases/bills/${billId}/modify`);
         }
         }}
/>
                );
              })}

              {!filteredRows.length && (
                <tr>
                  <td colSpan={10} className="bills-no-results">
                    <Search size={20} />
                    <span>No bills found for these filters.</span>
                    <button
                      type="button"
                      className="case-link"
                      onClick={clearFilters}
                    >
                      Clear filters
                    </button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          <div className="bills-table-footer">
            Showing {filteredRows.length} of {rows.length} bills
          </div>
        </div>
      )}
    </div>
  );
}

function FragmentRow({
  bill,
  id,
  expanded,
  status,
  dateTime,
  menuOpen,
  onToggleExpand,
  onToggleMenu,
  onOpen,
  onPrint,
  onModify,
}) {
  return (
    <>
      <tr className={expanded ? "bills-row bills-row-expanded" : "bills-row"}>
        <td className="bills-expand-column">
          <button
            type="button"
            className="bills-expand-button"
            aria-label={expanded ? "Collapse bill" : "Expand bill"}
            onClick={onToggleExpand}
          >
            {expanded ? (
              <ChevronDown size={15} />
            ) : (
              <ChevronRight size={15} />
            )}
          </button>
        </td>

        <td>{bill.registrationNo ?? bill.regNo ?? bill.id ?? "—"}</td>

        <td className="bills-date-cell">
          <span>{dateTime.date}</span>
          {dateTime.time && <small>{dateTime.time}</small>}
        </td>

        <td className="bills-patient-cell" title={getPatientName(bill)}>
          {getPatientName(bill)}
        </td>

        <td className="bills-referrer-cell" title={getReferrer(bill)}>
          {getReferrer(bill)}
        </td>

        <td>{money(bill.total ?? bill.payment?.total)}</td>
        <td>{money(getPaid(bill))}</td>
        <td>{money(bill.discount ?? bill.payment?.discount)}</td>

        <td>
          <span
            className={`case-status ${
              status === "Due"
                ? "warn"
                : status === "Cancelled"
                  ? "soft"
                  : ""
            }`}
          >
            {status}
          </span>
        </td>

        <td className="bills-actions-cell">
          <button
            type="button"
            className="case-link bills-view-link"
            onClick={onOpen}
          >
            View bill
          </button>

          <div className="bills-menu-wrap">
            <button
              type="button"
              className="bills-more-button"
              aria-label="More bill actions"
              aria-expanded={menuOpen}
              onClick={onToggleMenu}
            >
              <MoreHorizontal size={17} />
            </button>

            {menuOpen && (
              <div className="bills-action-menu">
               <button type="button" onClick={onModify}>
               Modify
               </button>
           </div>
           )}
          </div>
        </td>
      </tr>

      
{expanded && (
  <tr className="bills-expanded-details">
    <td />
    <td colSpan={9}>
      <div className="bills-expanded-content">
        <div className="bills-expanded-item">
          <span>Lab no.</span>
          <strong>
            {bill.labNo ||
              bill.labNumber ||
              bill.patientDetails?.labNo ||
              "—"}
          </strong>
        </div>

        <div className="bills-expanded-item bills-investigations">
          <span>Investigations</span>
          <div>
            {(() => {
              const source = bill.investigations;
              const investigations = Array.isArray(source)
                ? source
                : [
                    ...(Array.isArray(source?.lab)
                      ? source.lab
                      : []),
                    ...(Array.isArray(source?.outsource)
                      ? source.outsource
                      : []),
                  ];

              const tests =
                investigations.length > 0
                  ? investigations
                  : bill.tests || bill.items || [];

              if (!tests.length) return <strong>—</strong>;

              return tests.map((test, index) => (
                <div key={test.id || test._id || index}>
                  {typeof test === "string"
                    ? test
                    : test.name ||
                      test.testName ||
                      test.investigationName ||
                      test.label ||
                      "Investigation"}
                </div>
              ));
            })()}
          </div>
        </div>

        <div className="bills-expanded-item">
          <span>Collection centre</span>
          <strong>{getCentre(bill)}</strong>
        </div>

        <div className="bills-expanded-item">
          <span>Sample collection agent</span>
          <strong>{getAgent(bill)}</strong>
        </div>

        <div className="bills-expanded-item">
          <span>Balance</span>
          <strong
            className={
              getBalance(bill) > 0
                ? "amount-negative"
                : "amount-positive"
            }
          >
            {money(getBalance(bill))}
          </strong>
        </div>

        <button
          type="button"
          className="case-btn"
          onClick={onOpen}
        >
          View full details
        </button>
      </div>
    </td>
  </tr>
)}
    </>
  );
}