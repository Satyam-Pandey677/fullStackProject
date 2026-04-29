import { Router } from "express";
import { profile, sendOtp, verifyOtp } from "../controllers/userController.js";
import { isAuth } from "../middleware/isAuth.js";

const router = Router();

router.route("/send-otp").post(sendOtp)
router.route("/verify").post(verifyOtp)
router.route("/me").get(isAuth, profile)

export default router;