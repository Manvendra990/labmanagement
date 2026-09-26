import {api} from './http';
export const patientsApi={list:()=>api('/patients'),get:(id)=>api('/patients/'+id),create:(data)=>api('/patients',{method:'POST',body:JSON.stringify(data)}),update:(id,data)=>api('/patients/'+id,{method:'PUT',body:JSON.stringify(data)}),remove:(id)=>api('/patients/'+id,{method:'DELETE'})};
