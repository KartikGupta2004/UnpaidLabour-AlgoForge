import express from "express";
import {getDonationItems,getMarketplaceItems,getItemById,addItem} from "../controllers/ShowItemController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
const router = express.Router();
router.get("/donations", getDonationItems);
router.get("/marketplace",getMarketplaceItems);
router.post("/addItem",authMiddleware,addItem);
router.get("/:id",getItemById);

export default router;
