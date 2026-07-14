import { Router } from "express";
import { isAuth } from "../middleware/isAuth.js";
import { createCategory, fetchCategories } from "../controller/categoryController.js";

const router = Router();

router.route("/create").post(isAuth, createCategory)
router.route("/").get(isAuth, fetchCategories)

export default router