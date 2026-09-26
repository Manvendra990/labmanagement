import {api} from './http';
export const xrayApi={list:()=>api('/xray'),get:(id)=>api('/xray/'+id),create:(data)=>api('/xray',{method:'POST',body:JSON.stringify(data)}),update:(id,data)=>api('/xray/'+id,{method:'PUT',body:JSON.stringify(data)}),remove:(id)=>api('/xray/'+id,{method:'DELETE'})};
