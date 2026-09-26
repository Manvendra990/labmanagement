import {Router} from 'express';import * as c from '../controllers/testCategoryController.js';import {asyncHandler} from '../utils/asyncHandler.js';
const r=Router();r.get('/',asyncHandler(c.list));r.get('/:id',asyncHandler(c.get));r.post('/',asyncHandler(c.create));r.put('/:id',asyncHandler(c.update));r.patch('/:id',asyncHandler(c.update));export default r;
