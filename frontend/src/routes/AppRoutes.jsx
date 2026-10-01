
import { Routes, Route, Navigate } from "react-router-dom";
import AppLayout from "../components/layout/AppLayout";

// =========================
// AUTH
// =========================
import Login from "../pages/auth/Login.jsx";
import ForgotPassword from "../pages/auth/ForgotPassword.jsx";
import EmailOtp from "../pages/auth/EmailOtp.jsx";
import SmsOtp from "../pages/auth/SmsOtp.jsx";
import AccountLocked from "../pages/auth/AccountLocked.jsx";

// =========================
// DASHBOARD
// =========================
import Dashboard from "../pages/dashboard/Dashboard.jsx";
import GettingStarted from "../pages/getting-started/GettingStarted.jsx";

// =========================
// BUSINESS
// =========================
import DailyBusiness from "../pages/business/DailyBusiness.jsx";
import Expenses from "../pages/business/Expenses.jsx";
import DueReports from "../pages/business/DueReports.jsx";
import Activities from "../pages/business/Activities.jsx";
import ReferralBusiness from "../pages/business/ReferralBusiness.jsx";
import CaseWiseReport from "../pages/business/CaseWiseReport.jsx";
import BusinessAnalysis from "../pages/business/BusinessAnalysis.jsx";
import DataExport from "../pages/business/DataExport.jsx";

// =========================
// CASES
// =========================
import NewBill from "../pages/cases/NewBill";
import Bills from "../pages/cases/Bills.jsx";
import OutsourceCases from "../pages/cases/OutsourceCases.jsx";
import CTScanCases from "../pages/cases/CTScanCases.jsx";
import Patients from "../pages/cases/Patients.jsx";
import Transactions from "../pages/cases/Transactions.jsx";
import ReferralDoctors from "../pages/cases/ReferralDoctors.jsx";
import Agents from "../pages/cases/Agents.jsx";
import BillDetails from "../pages/cases/BillDetails.jsx";

// =========================
// LAB
// =========================
import TodayReports from "../pages/lab/TodayReports.jsx";
import SearchReports from "../pages/lab/SearchReports.jsx";
import TestPackages from "../pages/lab/TestPackages.jsx";
import TestPanels from "../pages/lab/TestPanels.jsx";
import TestCategories from "../pages/lab/TestCategories.jsx";
import TestDatabase from "../pages/lab/TestDatabase.jsx";
import TestTypeSelect from "../pages/lab/TestTypeSelect.jsx";
import TestForm from "../pages/lab/TestForm.jsx";
import Interpretations from "../pages/lab/Interpretations.jsx";
import TestCounts from "../pages/lab/TestCounts.jsx";

// =========================
// USG
// =========================
import UsgToday from "../pages/usg/TodayCases.jsx";
import UsgSearch from "../pages/usg/SearchCases.jsx";
import UsgTemplates from "../pages/usg/ReportTemplates.jsx";
import UsgSignatures from "../pages/usg/Signatures.jsx";

// =========================
// DIGITAL X-RAY
// =========================
import XrayToday from "../pages/xray/TodayCases.jsx";
import XraySearch from "../pages/xray/SearchCases.jsx";
import XrayTemplates from "../pages/xray/ReportTemplates.jsx";
import XraySignatures from "../pages/xray/Signatures.jsx";

// =========================
// MANAGE
// =========================
import BrowserSecurity from "../pages/manage/BrowserSecurity.jsx";
import EmployeeLogin from "../pages/manage/EmployeeLogin.jsx";
import DoctorAccess from "../pages/manage/DoctorAccess.jsx";

export default function AppRoutes() {
  return (
    <Routes>
      {/* =========================
          PUBLIC AUTH ROUTES
         ========================= */}
      <Route path="/login" element={<Login />} />

      <Route
        path="/forgot-password"
        element={<ForgotPassword />}
      />

      <Route
        path="/email-otp"
        element={<EmailOtp />}
      />

      <Route
        path="/sms-otp"
        element={<SmsOtp />}
      />

      <Route
        path="/account-locked"
        element={<AccountLocked />}
      />

      {/* =========================
          MAIN APPLICATION
         ========================= */}
      <Route element={<AppLayout />}>
        {/* Dashboard */}
        <Route
          path="/dashboard"
          element={<Dashboard />}
        />

        <Route
          path="/getting-started"
          element={<GettingStarted />}
        />

        {/* =========================
            BUSINESS
           ========================= */}
        <Route
          path="/business/daily"
          element={<DailyBusiness />}
        />

        <Route
          path="/business/expenses"
          element={<Expenses />}
        />

        <Route
          path="/business/due-reports"
          element={<DueReports />}
        />

        <Route
          path="/business/activities"
          element={<Activities />}
        />

        <Route
          path="/business/referral"
          element={<ReferralBusiness />}
        />

        <Route
          path="/business/case-wise"
          element={<CaseWiseReport />}
        />

        <Route
          path="/business/analysis"
          element={<BusinessAnalysis />}
        />

        <Route
          path="/business/export"
          element={<DataExport />}
        />

        {/* =========================
            CASES
           ========================= */}
        <Route
          path="/cases/new-bill"
          element={<NewBill />}
        />

        <Route
          path="/cases/bills"
          element={<Bills />}
        />

        {/* Modify an existing bill */}
        <Route
          path="/cases/bills/:id/modify"
          element={<NewBill />}
        />

        <Route
          path="/cases/outsource"
          element={<OutsourceCases />}
        />

        <Route
          path="/cases/ct-scan"
          element={<CTScanCases />}
        />

        <Route
          path="/cases/patients"
          element={<Patients />}
        />

        <Route
          path="/cases/transactions"
          element={<Transactions />}
        />

        <Route
          path="/cases/referral-doctors"
          element={<ReferralDoctors />}
        />

        <Route
          path="/cases/agents"
          element={<Agents />}
        />

        <Route
          path="/cases/bill-details/:id"
          element={<BillDetails />}
        />

        {/* =========================
            LAB
           ========================= */}
        <Route
          path="/lab/today"
          element={<TodayReports />}
        />

        <Route
          path="/lab/search"
          element={<SearchReports />}
        />

        <Route
          path="/lab/packages"
          element={<TestPackages />}
        />

        <Route
          path="/lab/panels"
          element={<TestPanels />}
        />

        <Route
          path="/lab/categories"
          element={<TestCategories />}
        />

        <Route
          path="/lab/tests"
          element={<TestDatabase />}
        />

        <Route
          path="/lab/tests/select-type"
          element={<TestTypeSelect />}
        />

        <Route
          path="/lab/tests/new/:type"
          element={<TestForm />}
        />

        <Route
          path="/lab/tests/:id/edit/:type"
          element={<TestForm />}
        />

        <Route
          path="/lab/interpretations"
          element={<Interpretations />}
        />

        <Route
          path="/lab/counts"
          element={<TestCounts />}
        />

        {/* =========================
            USG
           ========================= */}
        <Route
          path="/usg/today"
          element={<UsgToday />}
        />

        <Route
          path="/usg/search"
          element={<UsgSearch />}
        />

        <Route
          path="/usg/templates"
          element={<UsgTemplates />}
        />

        <Route
          path="/usg/signatures"
          element={<UsgSignatures />}
        />

        {/* =========================
            DIGITAL X-RAY
           ========================= */}
        <Route
          path="/xray/today"
          element={<XrayToday />}
        />

        <Route
          path="/xray/search"
          element={<XraySearch />}
        />

        <Route
          path="/xray/templates"
          element={<XrayTemplates />}
        />

        <Route
          path="/xray/signatures"
          element={<XraySignatures />}
        />

        {/* =========================
            MANAGE
           ========================= */}
        <Route
          path="/manage/browser-security"
          element={<BrowserSecurity />}
        />

        <Route
          path="/manage/employees"
          element={<EmployeeLogin />}
        />

        <Route
          path="/manage/doctor-access"
          element={<DoctorAccess />}
        />
      </Route>

      {/* =========================
          DEFAULT ROUTE
         ========================= */}
      <Route
        path="/"
        element={<Navigate to="/login" replace />}
      />

      {/* Unknown URL */}
      <Route
        path="*"
        element={<Navigate to="/login" replace />}
      />
    </Routes>
  );
}