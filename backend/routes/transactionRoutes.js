import express from "express";
import { confirmTransaction,createTransaction,getTransactionById } from "../controllers/transactionController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
const router = express.Router();

// Route for confirming transactions
// router.post("/createTransaction/:itemId",authMiddleware,createTransaction);
router.post("/createTransaction/:itemId",createTransaction);
router.post("/confirm/:transactionId", confirmTransaction);
router.get("/get_details/:id",getTransactionById);


export default router;
