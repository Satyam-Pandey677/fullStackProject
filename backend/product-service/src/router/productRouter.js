import {Router} from "express";
import { isAuth } from "../middleware/isAuth.js";
import { createProduct, deleteProduct, GetAllProduct, getLiveProducts, getMyProducts, placeBid, startAuction } from "../controller/productController.js";
import { upload } from "../middleware/multer.js";

const router = Router();


router.route("/create-product").post(isAuth, upload.array("image", 4),createProduct); //Product creation Api
router.route("/all-products").get(isAuth, GetAllProduct) //fetching all product through pagination
router.route("/live-products").get(isAuth, getLiveProducts) //fetch all live auction product
router.route("/:id").get(isAuth).put(isAuth).delete(isAuth,deleteProduct) //get, update, delete product by id
router.route("/:id/start-auction").post(isAuth, startAuction) //start auction using this api
router.route("/:id/stop-auction").post(isAuth) //stop auction using this api 
router.route("/:id/bid").post(isAuth, placeBid) //adding bid in auction
router.route("/:id/bids").get(isAuth) // fetch all bids in product
router.route("/:id/winner").get(isAuth) // fetch winner of auction
router.route("/my-products").get(isAuth, getMyProducts) // fetch my posted products
 
export default router