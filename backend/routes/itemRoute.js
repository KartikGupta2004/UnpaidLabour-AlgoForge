import express from "express";
import {getListedItems,getItemById} from "../controller/ShowItemController.js"

const router = express.Router();
router.get("/itemlist/all", getListedItems);
router.get("/itemlist/:id",getItemById);

export default router;
