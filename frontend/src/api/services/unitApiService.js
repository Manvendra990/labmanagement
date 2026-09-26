import apiClient from "../core/apiClient";
import { API_CONFIG } from "../config/apiConfig";
const E = API_CONFIG.ENDPOINTS.UNITS;
export default {
  list: () => apiClient.get(E.BASE),
  create: (p) => apiClient.post(E.BASE, p),
  update: (id, p) => apiClient.patch(E.BY_ID(id), p),
  remove: (id) => apiClient.delete(E.BY_ID(id)),
};
