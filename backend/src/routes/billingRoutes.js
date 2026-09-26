import {Router} from 'express';import {store,nextId} from '../store.js';
const r=Router();
r.get('/',(req,res)=>res.json({items:store.bills}));
r.get('/:id',(req,res)=>{const x=store.bills.find(v=>v.id==req.params.id);return x?res.json(x):res.status(404).json({message:'Bill not found'});});
r.post('/',(req,res)=>{const id=nextId(store.bills);const total=Number(req.body.total||0),discount=Number(req.body.discount||0),received=Number(req.body.received||0);const bill={id,regNo:String(41025+id),caseNo:`L${82+id}`,status:'Active',createdAt:new Date().toISOString(),...req.body,total,discount,received,balance:Math.max(0,total-discount-received)};store.bills.unshift(bill);const report={id:nextId(store.reports),billId:id,regNo:bill.regNo,patient:bill.patient||'Patient',age:bill.age||'',referrer:bill.referrer||'Self',status:'New',tests:(bill.investigations||[]).map((t,i)=>({id:i+1,section:t.section||'LABORATORY',name:t.name,value:'',unit:t.unit||'',reference:t.reference||''})),interpretation:'',notes:''};store.reports.unshift(report);res.status(201).json(bill);});
r.patch('/:id',(req,res)=>{const i=store.bills.findIndex(v=>v.id==req.params.id);if(i<0)return res.status(404).json({message:'Bill not found'});store.bills[i]={...store.bills[i],...req.body};res.json(store.bills[i]);});
r.post('/:id/cancel',(req,res)=>{const x=store.bills.find(v=>v.id==req.params.id);if(!x)return res.status(404).json({message:'Bill not found'});x.status='Cancelled';x.cancelReason=req.body.reason||'';res.json(x);});
export default r;
