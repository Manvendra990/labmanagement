import { Router } from "express";
import testCategoryRoutes from "./testCategoryRoutes.js";
import unitRoutes from "./unitRoutes.js";
import inputTypeRoutes from "./inputTypeRoutes.js";

const r = Router();

r.use("/test-categories", testCategoryRoutes);
r.use("/units", unitRoutes);
r.use("/input-types", inputTypeRoutes);

export default r;