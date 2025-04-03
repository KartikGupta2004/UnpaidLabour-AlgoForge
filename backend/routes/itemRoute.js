import express from "express";
import {getDonationItems,getMarketplaceItems,getItemById,addItem, deleteItem, UpdateItemStatus} from "../controllers/ShowItemController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
const router = express.Router();
router.get("/donations", getDonationItems);
router.get("/marketplace",getMarketplaceItems);
router.post("/addItem",authMiddleware,addItem);
router.get("/:id",getItemById);
router.delete("/mktplc/:id", deleteItem);
router.post("/itemstatus",UpdateItemStatus);

export default router;
