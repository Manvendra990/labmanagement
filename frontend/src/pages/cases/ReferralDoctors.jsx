
import { useMemo, useState } from "react";
import {
  Plus,
  Search,
  RefreshCw,
  Pencil,
  Trash2,
  X,
  Users,
  Phone,
  Mail,
  MapPin,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

import {
  referrerApiService,
} from "../../api";

import useApiList from "../../api/core/useApiList";
import "./cases.css";

const load = (q) => referrerApiService.list(q);

const emptyForm = {
  title: "Dr.",
  firstName: "",
  lastName: "",
  degree: "",
  mobile: "",
  email: "",
  address: "",
  active: true,
};

function getId(item) {
  return item?.id ?? item?._id ?? item?.referrerId;
}

function getName(item) {
  return (
    item?.name ||
    [
      item?.title,
      item?.firstName,
      item?.lastName,
    ]
      .filter(Boolean)
      .join(" ")
  );
}

function getErrorMessage(error) {
  return (
    error?.response?.data?.message ||
    error?.message ||
    "Something went wrong. Please try again."
  );
}

export default function ReferralDoctors() {
  const { rows, loading, error, reload } = useApiList(load);

  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [pageError, setPageError] = useState("");
  const [success, setSuccess] = useState("");

  const referrers = useMemo(() => {
    const query = search.trim().toLowerCase();

    return (Array.isArray(rows) ? rows : []).filter((item) => {
      if (!query) return true;

      const searchable = [
        getId(item),
        getName(item),
        item.mobile,
        item.degree,
        item.email,
        item.status,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return searchable.includes(query);
    });
  }, [rows, search]);

  const updateField = (key, value) => {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  };

  function openAddModal() {
    setEditing(null);
    setForm({ ...emptyForm });
    setPageError("");
    setModalOpen(true);
  }

  function openEditModal(referrer) {
    setEditing(referrer);
    setForm({
      ...emptyForm,
      title: referrer.title || "Dr.",
      firstName: referrer.firstName || "",
      lastName: referrer.lastName || "",
      degree: referrer.degree || "",
      mobile: referrer.mobile || "",
      email: referrer.email || "",
      address: referrer.address || "",
      active:
        referrer.active ??
        (String(referrer.status || "active").toLowerCase() !==
          "inactive"),
    });
    setPageError("");
    setModalOpen(true);
  }

  function closeModal() {
    if (saving) return;

    setModalOpen(false);
    setEditing(null);
    setForm({ ...emptyForm });
    setPageError("");
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setPageError("");
    setSuccess("");

    if (!form.firstName.trim()) {
      setPageError("Please enter the referrer's first name.");
      return;
    }

    if (form.mobile && !/^\d{10}$/.test(form.mobile)) {
      setPageError("Enter a valid 10-digit mobile number.");
      return;
    }

    const payload = {
      title: form.title,
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      name: [
        form.title,
        form.firstName.trim(),
        form.lastName.trim(),
      ]
        .filter(Boolean)
        .join(" "),
      degree: form.degree.trim(),
      mobile: form.mobile.trim(),
      email: form.email.trim(),
      address: form.address.trim(),
      active: form.active,
      status: form.active ? "active" : "inactive",
    };

    setSaving(true);

    try {
      if (editing) {
        const id = getId(editing);

        if (!id) {
          throw new Error(
            "Cannot update this referrer because its ID is missing."
          );
        }

        await referrerApiService.update(id, payload);
        setSuccess("Referrer updated successfully.");
      } else {
        await referrerApiService.create(payload);
        setSuccess("Referrer added successfully.");
      }

      setModalOpen(false);
      setEditing(null);
      setForm({ ...emptyForm });

      await reload({});
    } catch (err) {
      setPageError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(referrer) {
    const id = getId(referrer);

    if (!id) {
      setPageError("Cannot delete this referrer because its ID is missing.");
      return;
    }

    const confirmed = window.confirm(
      `Delete referrer "${getName(referrer)}"? This action cannot be undone.`
    );

    if (!confirmed) return;

    setPageError("");
    setSuccess("");
    setDeletingId(String(id));

    try {
      await referrerApiService.delete(id);
      setSuccess("Referrer deleted successfully.");
      await reload({});
    } catch (err) {
      setPageError(getErrorMessage(err));
    } finally {
      setDeletingId(null);
    }
  }

  const activeCount = (Array.isArray(rows) ? rows : []).filter(
    (item) =>
      item.active ??
      (String(item.status || "active").toLowerCase() !== "inactive")
  ).length;

  return (
    <div className="cases-page rd-page">
      <div className="rd-header">
        <div>
          <div className="rd-eyebrow">CASES / REFERRERS</div>
          <h1>Manage Referrers</h1>
          <p className="rd-subtitle">
            Manage referral doctors and their contact information.
          </p>
        </div>

        <div className="rd-header-actions">
          <button
            type="button"
            className="rd-btn rd-btn-secondary"
            onClick={() => reload({})}
            disabled={loading}
          >
            <RefreshCw
              size={16}
              className={loading ? "rd-spinning" : ""}
            />
            Refresh
          </button>

          <button
            type="button"
            className="rd-btn rd-btn-primary"
            onClick={openAddModal}
          >
            <Plus size={17} />
            Add Referrer
          </button>
        </div>
      </div>

      <div className="rd-stats">
        <div className="rd-stat-card">
          <div className="rd-stat-icon">
            <Users size={20} />
          </div>
          <div>
            <span>Total referrers</span>
            <strong>{rows?.length ?? 0}</strong>
          </div>
        </div>

        <div className="rd-stat-card">
          <div className="rd-stat-icon rd-green">
            <CheckCircle2 size={20} />
          </div>
          <div>
            <span>Active referrers</span>
            <strong>{activeCount}</strong>
          </div>
        </div>
      </div>

      {success && (
        <div className="rd-notice rd-notice-success" role="status">
          <CheckCircle2 size={17} />
          {success}
          <button
            type="button"
            onClick={() => setSuccess("")}
            aria-label="Dismiss success message"
          >
            <X size={15} />
          </button>
        </div>
      )}

      {pageError && !modalOpen && (
        <div className="rd-notice rd-notice-error" role="alert">
          <AlertCircle size={17} />
          {pageError}
          <button
            type="button"
            onClick={() => setPageError("")}
            aria-label="Dismiss error message"
          >
            <X size={15} />
          </button>
        </div>
      )}

      <section className="rd-table-card">
        <div className="rd-table-toolbar">
          <div>
            <h2>Referral doctors</h2>
            <p>
              {referrers.length}{" "}
              {referrers.length === 1 ? "record" : "records"}
            </p>
          </div>

          <div className="rd-search">
            <Search size={17} />
            <input
              type="search"
              placeholder="Search name, ID, mobile..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                aria-label="Clear search"
              >
                <X size={15} />
              </button>
            )}
          </div>
        </div>

        {loading ? (
          <div className="rd-state">
            <RefreshCw size={22} className="rd-spinning" />
            <p>Loading referrers...</p>
          </div>
        ) : error ? (
          <div className="rd-state rd-state-error">
            <AlertCircle size={24} />
            <p>{String(error)}</p>
            <button
              type="button"
              className="rd-btn rd-btn-secondary"
              onClick={() => reload({})}
            >
              Try again
            </button>
          </div>
        ) : referrers.length === 0 ? (
          <div className="rd-state">
            <Users size={28} />
            <h3>{search ? "No matching referrers" : "No referrers yet"}</h3>
            <p>
              {search
                ? "Try another name, ID, or mobile number."
                : "Add a referral doctor to get started."}
            </p>
            {!search && (
              <button
                type="button"
                className="rd-btn rd-btn-primary"
                onClick={openAddModal}
              >
                <Plus size={16} />
                Add Referrer
              </button>
            )}
          </div>
        ) : (
          <div className="rd-table-wrap">
            <table className="rd-table">
              <thead>
                <tr>
                  <th>REFERRER ID</th>
                  <th>NAME</th>
                  <th>CONTACT</th>
                  <th>TYPE / SPECIALITY</th>
                  <th>TOTAL CASES</th>
                  <th>STATUS</th>
                  <th className="rd-actions-heading">ACTIONS</th>
                </tr>
              </thead>

              <tbody>
                {referrers.map((item, index) => {
                  const id = getId(item);
                  const active =
                    item.active ??
                    (String(item.status || "active").toLowerCase() !==
                      "inactive");

                  return (
                    <tr key={id ?? index}>
                      <td>
                        <span className="rd-id">
                          {id ?? "—"}
                        </span>
                      </td>

                      <td>
                        <div className="rd-person">
                          <div className="rd-avatar">
                            {getName(item).charAt(0).toUpperCase() || "R"}
                          </div>
                          <div>
                            <strong>{getName(item) || "Unnamed referrer"}</strong>
                            {item.email && (
                              <span>{item.email}</span>
                            )}
                          </div>
                        </div>
                      </td>

                      <td>
                        <div className="rd-contact">
                          {item.mobile ? (
                            <>
                              <Phone size={13} />
                              {item.mobile}
                            </>
                          ) : (
                            "—"
                          )}
                        </div>
                      </td>

                      <td>{item.degree || "—"}</td>
                      <td>{item.totalCases ?? 0}</td>

                      <td>
                        <span
                          className={`rd-status ${
                            active ? "is-active" : "is-inactive"
                          }`}
                        >
                          <span />
                          {active ? "Active" : "Inactive"}
                        </span>
                      </td>

                      <td>
                        <div className="rd-row-actions">
                          <button
                            type="button"
                            className="rd-icon-btn"
                            title="Edit referrer"
                            aria-label={`Edit ${getName(item)}`}
                            onClick={() => openEditModal(item)}
                          >
                            <Pencil size={15} />
                          </button>

                          <button
                            type="button"
                            className="rd-icon-btn rd-delete-btn"
                            title="Delete referrer"
                            aria-label={`Delete ${getName(item)}`}
                            disabled={deletingId === String(id)}
                            onClick={() => handleDelete(item)}
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {modalOpen && (
        <div
          className="rd-modal-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeModal();
            }
          }}
        >
          <section
            className="rd-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="rd-modal-title"
          >
            <div className="rd-modal-header">
              <div>
                <h2 id="rd-modal-title">
                  {editing ? "Edit Referrer" : "Add New Referrer"}
                </h2>
                <p>
                  Enter the referral doctor's information below.
                </p>
              </div>

              <button
                type="button"
                className="rd-modal-close"
                onClick={closeModal}
                disabled={saving}
                aria-label="Close dialog"
              >
                <X size={19} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="rd-form-grid">
                <label>
                  Title
                  <select
                    value={form.title}
                    onChange={(event) =>
                      updateField("title", event.target.value)
                    }
                  >
                    <option value="Dr.">Dr.</option>
                    <option value="Mr.">Mr.</option>
                    <option value="Mrs.">Mrs.</option>
                    <option value="Ms.">Ms.</option>
                  </select>
                </label>

                <label>
                  First name <span>*</span>
                  <input
                    value={form.firstName}
                    onChange={(event) =>
                      updateField("firstName", event.target.value)
                    }
                    placeholder="Enter first name"
                    required
                    autoFocus
                  />
                </label>

                <label>
                  Last name
                  <input
                    value={form.lastName}
                    onChange={(event) =>
                      updateField("lastName", event.target.value)
                    }
                    placeholder="Enter last name"
                  />
                </label>

                <label>
                  Type / Speciality
                  <input
                    value={form.degree}
                    onChange={(event) =>
                      updateField("degree", event.target.value)
                    }
                    placeholder="e.g. MBBS, Cardiologist"
                  />
                </label>

                <label>
                  Mobile number
                  <input
                    type="tel"
                    inputMode="numeric"
                    maxLength={10}
                    value={form.mobile}
                    onChange={(event) =>
                      updateField(
                        "mobile",
                        event.target.value.replace(/\D/g, "").slice(0, 10)
                      )
                    }
                    placeholder="10-digit mobile number"
                  />
                </label>

                <label>
                  Email
                  <input
                    type="email"
                    value={form.email}
                    onChange={(event) =>
                      updateField("email", event.target.value)
                    }
                    placeholder="doctor@example.com"
                  />
                </label>

                <label className="rd-full-width">
                  Address
                  <textarea
                    rows={3}
                    value={form.address}
                    onChange={(event) =>
                      updateField("address", event.target.value)
                    }
                    placeholder="Enter address"
                  />
                </label>

                <label className="rd-active-toggle rd-full-width">
                  <input
                    type="checkbox"
                    checked={form.active}
                    onChange={(event) =>
                      updateField("active", event.target.checked)
                    }
                  />
                  <span>
                    <strong>Active referrer</strong>
                    <small>
                      Keep this referrer available for new bills.
                    </small>
                  </span>
                </label>
              </div>

              {pageError && (
                <div className="rd-notice rd-notice-error">
                  <AlertCircle size={17} />
                  {pageError}
                </div>
              )}

              <div className="rd-modal-footer">
                <button
                  type="button"
                  className="rd-btn rd-btn-secondary"
                  onClick={closeModal}
                  disabled={saving}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="rd-btn rd-btn-primary"
                  disabled={saving}
                >
                  {saving ? (
                    <>
                      <RefreshCw size={15} className="rd-spinning" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 size={16} />
                      {editing ? "Save Changes" : "Create Referrer"}
                    </>
                  )}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </div>
  );
}