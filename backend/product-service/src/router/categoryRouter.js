import { Router } from "express";
import { isAuth } from "../middleware/isAuth.js";
import { createCategory, deleteCategory, fetchCategories } from "../controller/categoryController.js";

const router = Router();

router.route("/create").post(isAuth, createCategory)
router.route("/").get(isAuth, fetchCategories)
router.route("/:id").delete(isAuth, deleteCategory)

export default router