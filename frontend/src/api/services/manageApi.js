import {api} from './http';
export const manageApi={list:()=>api('/manage'),get:(id)=>api('/manage/'+id),create:(data)=>api('/manage',{method:'POST',body:JSON.stringify(data)}),update:(id,data)=>api('/manage/'+id,{method:'PUT',body:JSON.stringify(data)}),remove:(id)=>api('/manage/'+id,{method:'DELETE'})};
