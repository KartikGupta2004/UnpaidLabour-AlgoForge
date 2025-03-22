import express from "express";
import {getDonationItems,getMarketplaceItems,getItemById} from "../controllers/ShowItemController.js";

const router = express.Router();
router.get("/donations", getDonationItems);
router.get("/marketplace",getMarketplaceItems);
router.get("/:id",getItemById);

export default router;
