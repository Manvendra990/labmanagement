const env = import.meta.env;
const BASE_URL=(env.VITE_API_BASE_URL||"http://localhost:4000/api").replace(/\/+$/,'');
export const API_CONFIG=Object.freeze({
 BASE_URL,
 TIMEOUT_MS:Number(env.VITE_API_TIMEOUT_MS||30000),
 DEBUG:env.DEV || env.VITE_API_DEBUG==="true",
 RETRY_COUNT:Number(env.VITE_API_RETRY_COUNT||0),
 ENDPOINTS:Object.freeze({
  BILLING:Object.freeze({BASE:"/billing",BY_ID:id=>`/billing/${id}`,TRANSACTIONS:"/billing/transactions"}),
  PATIENTS:Object.freeze({BASE:"/patients",BY_ID:id=>`/patients/${id}`,SEARCH:"/patients/search"}),
  REFERRERS:Object.freeze({BASE:"/doctors",BY_ID:id=>`/doctors/${id}`}),
  AGENTS:Object.freeze({BASE:"/cases/agents",BY_ID:id=>`/cases/agents/${id}`}),
  BUSINESS:Object.freeze({BASE:"/business",DAILY:"/business/daily",MONTHLY:"/business/monthly",REFERRAL_REPORTS:"/business/referral-reports"}),
  REPORTS:Object.freeze({BASE:"/reports",TODAY:"/reports/today",SEARCH:"/reports/search",BY_ID:id=>`/reports/${id}`}),
  LAB:Object.freeze({BASE:"/lab",TODAY:"/lab/today",TESTS:"/lab/tests"}),
  TEST_CATEGORIES:Object.freeze({BASE:"/lab/test-categories",BY_ID:id=>`/lab/test-categories/${id}`}),
  EMPLOYEES:Object.freeze({BASE:"/manage/employees",BY_ID:id=>`/manage/employees/${id}`})
 })
});
export default API_CONFIG;
