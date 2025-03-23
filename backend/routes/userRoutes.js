import express from "express";
import { loginController, registerController, authController,getUserDetails } from "../controllers/userCtrl.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

//routes
//LOGIN || POST
router.post("/signin", loginController);
router.get("/view_profile/:userId",getUserDetails);
//REGISTER || POST
router.post("/register", registerController);

//Auth || POST
router.get("/getUserData", authMiddleware, authController);

export default router;