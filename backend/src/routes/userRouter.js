import { Router } from "express";
import { sendOtp } from "../controllers/userController.js";

const router = Router();

router.route("/send-otp").post(sendOtp)
router.route("/hello").get((req, res) =>{
    console.log("hello")
    res.send("hello")
})

export default router;