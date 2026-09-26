import * as service from '../services/testCategoryService.js';
export async function list(req,res){const data=await service.list();res.json({success:true,data,meta:{count:data.length},requestId:req.requestId})}
export async function get(req,res){res.json({success:true,data:await service.get(Number(req.params.id)),requestId:req.requestId})}
export async function create(req,res){res.status(201).json({success:true,data:await service.create(req.body),message:'Test category created successfully.',requestId:req.requestId})}
export async function update(req,res){res.json({success:true,data:await service.update(Number(req.params.id),req.body),message:'Test category updated successfully.',requestId:req.requestId})}
