import apiClient from "../core/apiClient";
import { API_CONFIG } from "../config/apiConfig";

const E = API_CONFIG.ENDPOINTS.BILLING;

const billingApiService = {
  // Fetch all bills with optional filters
  list: (q = {}) =>
    apiClient.get(E.BASE, { query: q }),

  // Fetch transaction history
  transactions: (q = {}) =>
    apiClient.get(E.TRANSACTIONS, { query: q }),

  // Fetch a specific bill for viewing or modification
  getById: (id) =>
    apiClient.get(E.BY_ID(id)),

  // Create a new bill
  create: (payload) =>
    apiClient.post(E.BASE, payload),

  // Update an existing bill
  update: (id, payload) =>
    apiClient.patch(E.BY_ID(id), payload),
};

export default billingApiService;