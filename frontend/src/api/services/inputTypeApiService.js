import apiClient from "../core/apiClient";
import { API_CONFIG } from "../config/apiConfig";
const E = API_CONFIG.ENDPOINTS.INPUT_TYPES;
export default { list: () => apiClient.get(E.BASE) };
