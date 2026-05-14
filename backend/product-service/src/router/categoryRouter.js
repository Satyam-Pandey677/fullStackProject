import { Router } from "express";
import { isAuth } from "../middleware/isAuth.js";

const router = Router();

router.route("/create-category").post(isAuth)