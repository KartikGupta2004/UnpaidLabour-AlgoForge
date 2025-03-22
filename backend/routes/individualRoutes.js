import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { updateProfileController } from "../controllers/individualCtrl.js";

const router = express.Router();

//POST
router.put("/update-profile", authMiddleware, updateProfileController);

export default router;