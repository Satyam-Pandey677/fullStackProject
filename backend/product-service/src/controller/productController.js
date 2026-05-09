import { PRODUCT } from "../model/productModel.js";
import { asyncHandler } from "../utils/asyncHandler.js"

const createProduct = asyncHandler(async(req, res) =>{

    const {name, description,starting_price, duration, durationType, status, category} = req.body;

    const user = req.user

    console.log(user);

    if(!name || !starting_price || !duration){
        res.status(400)
        throw new Error("Please provide all required fields")
    }

    const images = req.files;
    const images_urls = await Promise.all(
        // images.map((image) => uploadImages(image.path))
    )

    let durationInSec ;

    if(durationType == "hr"){
        durationInSec = duration*60*60*1000;
    }else if(durationType == "min"){
        duration = duration *60*1000;
    }else{
        res.status(400);
        throw new Error("Invalid duration type")
    }

    const endTime = new Date(Date.now() + duration);

    const product = await PRODUCT.create({
        name,
        description,
        images:images_urls.map((image) =>({
            url:image.secure_url,
            id:image.price_id
        })),
        starting_price,
        duration:durationInSec,
        endTime,
        owner:user._id,
        category
    })
})

const deleteProduct = asyncHandler(async(req, res) =>{
    const {id} = req.params;
    const existedProduct = await PRODUCT.findById(id);

    if(!existedProduct){
        res.status(404)
        throw new Error("Product Not Exist")
    }

    if(existedProduct.owner.toString() != req.user._id.toString()){
        res.status(403)
        throw new Error("User Not Authorized")
    }

    const deletedProduct =  await PRODUCT.findByIdAndDelete(id);

    res.status(200)
    .json({
        message:"Product deleted successfully",
        deletedProduct
    })
})

export {
    createProduct
}