import {Router} from 'express';import {store} from '../store.js';const r=Router();
r.get('/',(q,s)=>{const active=store.bills.filter(x=>x.status!=='Cancelled'),income=active.reduce((n,x)=>n+Number(x.received||0),0);s.json({income,bills:store.bills,transactions:active.map(x=>({id:x.id,regNo:x.regNo,patient:x.patient,amount:x.received,method:x.mode,createdAt:x.createdAt}))})});export default r;
