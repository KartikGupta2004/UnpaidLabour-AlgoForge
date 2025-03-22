import express from "express";
import { getQueryAnswerFromDatabase } from "../controllers/chatbotCtrl.js";

const router = express.Router();

//routes
//chat || POST
router.post("/chat", getQueryAnswerFromDatabase);

export default router;