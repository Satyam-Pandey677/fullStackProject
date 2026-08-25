import { Router } from "express";
import { getAllUser, profile, sendOtp, updateProfile, userById, verifyOtp } from "../controllers/userController.js";
import { isAdmin, isAuth } from "../middleware/isAuth.js";

const router = Router();

router.route("/send-otp").post(sendOtp)
router.route("/verify").post(verifyOtp)
router.route("/me").get(isAuth, profile)
router.route("/profile/:id").get(isAuth, userById)
router.route("/update-profile").patch(isAuth, updateProfile)
router.route("/All-users").get(isAuth, isAdmin, getAllUser)

export default router;