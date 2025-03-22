import express from "express";
import { loginController, registerController, authController } from "../controllers/userCtrl.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

//routes
//LOGIN || POST
router.post("/signin", loginController);

//REGISTER || POST
router.post("/register", registerController);

//Auth || POST
router.get("/getUserData", authMiddleware, authController);

export default router;