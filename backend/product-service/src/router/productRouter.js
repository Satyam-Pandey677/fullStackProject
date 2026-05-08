import {Router} from "express";
import { isAuth } from "../middleware/isAuth";
import { createProduct } from "../controller/productController.js";

const router = Router();


router.route("/product/create").post(isAuth, createProduct); //Product creation Api
router.route("/products").get(isAuth) //fetching all product through pagination
router.route("/products/live").get(isAuth) //fetch all live auction product
router.route("/products/:id").get(isAuth).put(isAuth).delete(isAuth) //get, update, delete product by id
router.route("/products/:id/start-auction").post(isAuth) //start auction using this api
router.route("/products/:id/stop-auction").post(isAuth) //stop auction using this api 
router.route("/products/:id/bid").post(isAuth) //adding bid in auction
router.route("/products/:id/bids").get(isAuth) // fetch all bids in product
router.route("/products/:id/winner").get(isAuth) // fetch winner of auction
router.route("/products/my-products").get(isAuth) // fetch my posted products
