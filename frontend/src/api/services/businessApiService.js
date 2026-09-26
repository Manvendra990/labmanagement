import apiClient from "../core/apiClient";
import { API_CONFIG } from "../config/apiConfig";
const E=API_CONFIG.ENDPOINTS.BUSINESS;
export const businessApiService={daily:(query)=>apiClient.get(E.DAILY,{query}),monthly:(query)=>apiClient.get(E.MONTHLY,{query}),referralReports:(query)=>apiClient.get(E.REFERRAL_REPORTS,{query})};
export default businessApiService;
