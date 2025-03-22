import express from "express";
import { confirmTransaction,createTransaction } from "../controllers/transactionController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
const router = express.Router();

// Route for confirming transactions
router.post("/createTransaction/:itemId",authMiddleware,createTransaction);
router.post("/confirm/:transactionId", confirmTransaction);


export default router;
