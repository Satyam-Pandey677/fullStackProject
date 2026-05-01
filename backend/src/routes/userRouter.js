import { Router } from "express";
import { profile, sendOtp, updateProfile, verifyOtp } from "../controllers/userController.js";
import { isAuth } from "../middleware/isAuth.js";

const router = Router();

router.route("/send-otp").post(sendOtp)
router.route("/verify").post(verifyOtp)
router.route("/me").get(isAuth, profile)
router.route("/update-profile").patch(isAuth, updateProfile)

export default router;