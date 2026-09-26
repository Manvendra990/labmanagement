import { api } from "./http";
export const usgApi = {
  list: () => api("/usg"),
  get: (id) => api("/usg/" + id),
  create: (data) => api("/usg", { method: "POST", body: JSON.stringify(data) }),
  update: (id, data) =>
    api("/usg/" + id, { method: "PUT", body: JSON.stringify(data) }),
  remove: (id) => api("/usg/" + id, { method: "DELETE" }),
};
