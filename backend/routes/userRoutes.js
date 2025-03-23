import express from "express";
import { loginController, registerController, authController, uploadImageController } from "../controllers/userCtrl.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import upload from '../middlewares/multer.js';
const router = express.Router();

//routes
//LOGIN || POST
router.post("/signin", loginController);

//REGISTER || POST
router.post("/register", registerController);

//Auth || POST
router.get("/getUserData", authMiddleware, authController);

//Upload_Image
router.post("/upload_photo", upload.single("file"), authMiddleware,uploadImageController)
export default router;