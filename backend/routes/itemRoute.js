import express from "express";
import {getDonationItems,getMarketplaceItems,getItemById,addItem, deleteItem} from "../controllers/ShowItemController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
const router = express.Router();
router.get("/donations", getDonationItems);
router.get("/marketplace",getMarketplaceItems);
router.post("/addItem",addItem);
router.get("/:id",getItemById);
router.delete("/mktplc/:id", deleteItem);

export default router;
