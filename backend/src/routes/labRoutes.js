import {Router} from 'express';import testCategoryRoutes from './testCategoryRoutes.js';
const r=Router();r.use('/test-categories',testCategoryRoutes);r.get('/',(req,res)=>res.json({success:true,module:'lab',requestId:req.requestId}));export default r;
