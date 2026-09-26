import API_CONFIG from "../config/apiConfig";
const css={request:"color:#2563eb;font-weight:700",success:"color:#059669;font-weight:700",error:"color:#dc2626;font-weight:700",warn:"color:#d97706;font-weight:700"};
const enabled=()=>API_CONFIG.DEBUG;
export const apiLogger={
 request(x){if(enabled()) console.groupCollapsed(`%c[API →] ${x.method} ${x.url}`,css.request);if(enabled()){console.log("requestId:",x.requestId);if(x.query)console.log("query:",x.query);if(x.body!==undefined)console.log("body:",x.body);console.groupEnd()}},
 success(x){if(enabled()) console.log(`%c[API ✓] ${x.method} ${x.url} • ${x.status} • ${x.duration}ms`,css.success,{requestId:x.requestId,data:x.data})},
 error(x){console.error(`%c[API ✕] ${x.method||"?"} ${x.url||""} • ${x.status||0} • ${x.code||"ERROR"}`,css.error,{requestId:x.requestId,message:x.message,details:x.details})},
 retry(x){if(enabled()) console.warn(`%c[API ↻] retry ${x.attempt}/${x.max} ${x.method} ${x.url}`,css.warn)}
};
export default apiLogger;
