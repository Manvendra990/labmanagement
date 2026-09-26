import apiClient from "../core/apiClient";
import { API_CONFIG } from "../config/apiConfig";
const E=API_CONFIG.ENDPOINTS.LAB;
export const labApiService={today:(query)=>apiClient.get(E.TODAY,{query}),tests:(query)=>apiClient.get(E.TESTS,{query})};
export default labApiService;
