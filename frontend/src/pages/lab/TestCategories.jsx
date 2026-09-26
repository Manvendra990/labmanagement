import { useCallback, useEffect, useState } from "react";

import LabTable, { Action } from "./LabTable";
import testCategoryApiService from "../../api/services/testCategoryApiService";

import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import IconButton from "../../components/common/IconButton";

import "./lab.css";
import "./test-categories.css";

export default function TestCategories() {
  // =========================
  // TABLE STATE
  // =========================

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =========================
  // MODAL STATE
  // =========================

  const [modal, setModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  // =========================
  // FORM STATE
  // =========================

  const [name, setName] = useState("");
  const [nameError, setNameError] = useState("");
  const [saving, setSaving] = useState(false);

  // =========================
  // GET CATEGORIES
  // =========================

  const load = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await testCategoryApiService.list();

      const data = Array.isArray(response)
        ? response
        : Array.isArray(response?.data)
          ? response.data
          : Array.isArray(response?.items)
            ? response.items
            : Array.isArray(response?.rows)
              ? response.rows
              : [];

      const normalizedRows = data.map((item, index) => ({
        ...item,

        id:
          item.id ??
          item.categoryId ??
          index + 1,

        order:
          item.order ??
          item.sortOrder ??
          index + 1,

        name:
          item.name ??
          item.categoryName ??
          "",
      }));

      setRows(normalizedRows);
    } catch (err) {
      console.error("[TEST CATEGORIES GET ERROR]", err);

      setRows([]);

      setError(
        err?.message ||
          "Unable to load test categories."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  // =========================
  // INITIAL GET
  // =========================

  useEffect(() => {
    load();
  }, [load]);

  // =========================
  // OPEN ADD MODAL
  // =========================

  function openAddModal() {
    setEditingCategory(null);

    setName("");
    setNameError("");
    setError("");

    setModal(true);
  }

  // =========================
  // OPEN EDIT MODAL
  // =========================

  function openEditModal(row) {
    console.log(
      "[TEST CATEGORY EDIT SELECTED]",
      row
    );

    setEditingCategory(row);

    setName(row?.name || "");
    setNameError("");
    setError("");

    setModal(true);
  }

  // =========================
  // CLOSE MODAL
  // =========================

  function closeModal() {
    if (saving) {
      return;
    }

    setModal(false);
    setEditingCategory(null);

    setName("");
    setNameError("");
    setError("");
  }

  // =========================
  // VALIDATION
  // =========================

  function validateForm() {
    const cleanName = name.trim();

    if (!cleanName) {
      setNameError(
        "Please enter the category name."
      );

      return false;
    }

    setNameError("");

    return true;
  }

  // =========================
  // POST / PATCH
  // =========================

  async function submit(e) {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const cleanName = name.trim();

    setSaving(true);
    setError("");

    try {
      // =====================
      // EDIT -> PATCH
      // =====================

      if (editingCategory) {
        console.log(
          "[TEST CATEGORY UPDATE API]",
          {
            id: editingCategory.id,
            name: cleanName,
          }
        );

        await testCategoryApiService.update(
          editingCategory.id,
          {
            name: cleanName,
          }
        );
      }

      // =====================
      // ADD -> POST
      // =====================

      else {
        console.log(
          "[TEST CATEGORY CREATE API]",
          {
            name: cleanName,
          }
        );

        await testCategoryApiService.create({
          name: cleanName,
        });
      }

      // =====================
      // CLOSE FORM
      // =====================

      setModal(false);
      setEditingCategory(null);

      setName("");
      setNameError("");

      // =====================
      // GET FRESH DB DATA
      // =====================

      await load();
    } catch (err) {
      console.error(
        editingCategory
          ? "[TEST CATEGORY UPDATE ERROR]"
          : "[TEST CATEGORY CREATE ERROR]",
        err
      );

      setError(
        err?.message ||
          (editingCategory
            ? "Unable to update category."
            : "Unable to create category.")
      );
    } finally {
      setSaving(false);
    }
  }

  // =========================
  // TABLE COLUMNS
  // =========================

  const cols = [
    {
      key: "order",
      label: "ORDER",

      render: (value) =>
        `↕  ${value}`,
    },

    {
      key: "name",
      label: "NAME",
    },

    {
      key: "action",
      label: "ACTION",

      render: (_, row) => (
        <>
          <Action
            onClick={() =>
              openEditModal(row)
            }
          >
            ✎ Edit
          </Action>

          <Action>
            ◉ View tests
          </Action>
        </>
      ),
    },
  ];

  // =========================
  // UI
  // =========================

  return (
    <div className="lab-page">
      {/* HEADER */}

      <div className="tc-head">
        <h1>
          Test categories
        </h1>

        <Button
          type="button"
          variant="primary"
          onClick={openAddModal}
        >
          ＋ Add new
        </Button>
      </div>

      {/* REORDER INFO */}

      <div className="lab-info tc-info">
        ⓘ &nbsp;

        <b>
          How to reorder?
        </b>

        <span className="lab-right">
          ⌄
        </span>
      </div>

      {/* PAGE API ERROR */}

      {!modal && error && (
        <div className="tc-error">
          {error}
        </div>
      )}

      {/* TABLE */}

      {loading ? (
        <p>
          Loading categories...
        </p>
      ) : (
        <div className="tc-table">
          <LabTable
            columns={cols}
            rows={rows}
          />
        </div>
      )}

      {/* =====================
          ADD / EDIT MODAL
      ====================== */}

      {modal && (
        <div
          className="tc-overlay"
          onMouseDown={(e) => {
            if (
              e.target ===
                e.currentTarget &&
              !saving
            ) {
              closeModal();
            }
          }}
        >
          <div
            className="tc-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="category-modal-title"
          >
            {/* MODAL HEADER */}

            <div className="tc-title">
              <b id="category-modal-title">
                {editingCategory
                  ? "Edit Category"
                  : "Add new Category"}
              </b>

              <IconButton
                label="Close"
                onClick={closeModal}
                disabled={saving}
              >
                ×
              </IconButton>
            </div>

            {/* FORM */}

            <form onSubmit={submit}>
              <div className="tc-body">
                <Input
                  label="* Name"
                  autoFocus
                  value={name}
                  error={nameError}
                  placeholder="Enter category name"
                  onChange={(e) => {
                    const value =
                      e.target.value;

                    setName(value);

                    if (
                      value.trim()
                    ) {
                      setNameError("");
                    }
                  }}
                />

                {/* API ERROR */}

                {error && (
                  <div className="tc-error">
                    {error}
                  </div>
                )}

                {/* SUBMIT */}

                <Button
                  type="submit"
                  variant="primary"
                  loading={saving}
                >
                  {editingCategory
                    ? "Update"
                    : "Create"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}