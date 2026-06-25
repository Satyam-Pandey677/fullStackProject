import { Router } from "express";
import { isAuth } from "../middleware/isAuth.js";
import { createCategory, fetchCategories } from "../controller/categoryController.js";

const router = Router();

router.route("/create-category").post(isAuth, createCategory)
router.route("/categories").get(isAuth, fetchCategories)

export default router