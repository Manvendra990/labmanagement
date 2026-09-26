import {api} from './http';
export const reportsApi={list:()=>api('/reports'),get:(id)=>api('/reports/'+id),create:(data)=>api('/reports',{method:'POST',body:JSON.stringify(data)}),update:(id,data)=>api('/reports/'+id,{method:'PUT',body:JSON.stringify(data)}),remove:(id)=>api('/reports/'+id,{method:'DELETE'})};
