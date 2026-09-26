import apiClient from "../core/apiClient";
import { API_CONFIG } from "../config/apiConfig";
const E=API_CONFIG.ENDPOINTS.EMPLOYEES;
export const employeeApiService={list:(query)=>apiClient.get(E.BASE,{query}),getById:(id)=>apiClient.get(E.BY_ID(id)),create:(payload)=>apiClient.post(E.BASE,payload),update:(id,payload)=>apiClient.patch(E.BY_ID(id),payload)};
export default employeeApiService;
