import apiClient from "../core/apiClient";
import { API_CONFIG } from "../config/apiConfig";
const E=API_CONFIG.ENDPOINTS.PATIENTS;
export const patientApiService={list:(query)=>apiClient.get(E.BASE,{query}),search:(query)=>apiClient.get(E.SEARCH,{query}),getById:(id)=>apiClient.get(E.BY_ID(id)),create:(payload)=>apiClient.post(E.BASE,payload),update:(id,payload)=>apiClient.patch(E.BY_ID(id),payload)};
export default patientApiService;
