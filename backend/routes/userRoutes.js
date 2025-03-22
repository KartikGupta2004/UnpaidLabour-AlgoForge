import express from "express";
import { loginController, registerController } from "../controllers/userCtrl.js";

const router = express.Router();

//routes
//LOGIN || POST
router.post("/signin", loginController);

//REGISTER || POST
router.post("/register", registerController);

export default router;