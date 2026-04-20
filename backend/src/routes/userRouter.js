import { Router } from "express";
import { sendOtp, verifyOtp } from "../controllers/userController.js";

const router = Router();

router.route("/send-otp").post(sendOtp)
router.route("/verify").post(verifyOtp)

export default router;