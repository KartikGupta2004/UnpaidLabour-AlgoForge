import express from "express";
import { confirmTransaction } from "../controller/transactionController.js";

const router = express.Router();

// Route for confirming transactions
router.post("/confirm/:transactionId", confirmTransaction);

export default router;
