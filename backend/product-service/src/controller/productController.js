import { io, startAuctionTimer } from "../config/socket.js";
import { BID } from "../model/bidModel.js";
import { PRODUCT } from "../model/productModel.js";
import { asyncHandler } from "../utils/asyncHandler.js"
import {uploadOnCloudinary} from "../middleware/multer.js"

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
        images.map((image) => uploadOnCloudinary(image.path))
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

    if(!product){
        res.status(500)
        throw new Error("Something Went wrong")
    }

    const message = {
            to:req.user.email,
            subject:"Thank For Post Product ",
            body:`Thank you ${req.user.email} for add new item in BidIT platform and your product Id is ${product.id}`
            }
    
    await publishToQueue("welcome-queue", message)


    return res.status(200)
    .json({
        message:"Product created Successfully",
        product
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

const GetAllProduct  =asyncHandler(async(req, res) => {
    const page = parseInt(req.query.page)||1;
    const limit = 10;
    const skip = (page - 1) * limit 

    const products = await PRODUCT.find()
    .skip(skip)
    .limit(limit)
    .exec()

    return res.status(200)
    .json({
        message:"Fetching All Products",
        products
    })
})


const getLiveProducts = asyncHandler(async(req, res) => {
    const products = await PRODUCT.find({
        status:"live"
    })
    
    if(!products){
        res.status(404)
        .json({
            message:"No Products Are Live Right Now"
        })
    }

    res.status(200)
    .json({
        message:"Fetched Live Products",
        products
    })
})

const getMyProducts = asyncHandler(async(req, res) => {
    const userId = req.user._id;

    const products = await PRODUCT.find({
        owner:userId
    })

    if(!products){
        res.status(400)
        .json({
            message:"Something went wrong"
        })
    }

    res.staus(200)
    .json({
        message:"Fetched my products",
        products
    })
})

const getProductById = asyncHandler(async(req, res) => {
    const {id} = req.params;

    if(!id){
        res.status(400)
        .json({
            message:"Id is required"
        })
    }

    const product  = await PRODUCT.findById(id);
    
    if(!product){
        res.status(404)
        .json({
            message:"Product not found"
        })
    }

    return res.status(200)
    .json({
        messasge:"Fetchingg product by id",
        product
    })
})

const startAuction = asyncHandler(async(req, res) => {
    
    const {id} = req.params;

    if(!id){
        return res.status(400)
        .json({
            message:"Id is required to start the auction"
        })
    }

    const product = await PRODUCT.findById(id);

    if(!product){
        return res.status(404)
        .json({
            message:"Product not found"
        })
    }


    if(product.status == "live"){
        return res.status(400)
        .json({
            message:"Auction already started"
        })
    }

    if(product.owner.toString !== req.user._id.toString()){
        return res.status(403).json({
            message:"You not Authorized to start Auciton"
        })
    }

    product.status = "live";
    product.endTime = new Date(
        Date.now() + product.duration*1000
    );

    await product.save()
    
    startAuctionTimer(product._id.toString(), product.duration)
})

const placeBid = asyncHandler(async(req, res) => {
    const bidderId = req.user._id;
    const {productId} = req.params;
    const {amount} = req.body;

    if(!senderId){
        res.status(401).json({
            message:"unauthorized"
        });
        return;
    }

    if(!productId){
        res.status(400).json({
            message:"ProductId is required"
        })
        return;
    }

    if(!amount){
        res.status(400).json({
            message:"Amound is required for bid"
        })
        return;
    }


    //product
    const product = await PRODUCT.findById(id);

    if(!product){
        res.status(404)
        .json({
            message:"Product Not Found"
        })
        return;
    }


    //auction status
    if(product.status !== "live" ){
        return res.status(400).json({
            message:"Auction is not live"
        })
    }

    //Bid validation
    if(amount <= product.currentBid){
        res.status(400)
        .json({
            message:"you cant bid less then current Bid"
        })
        return;
    }

    //save bid;

    const bid = await BID.create({
        product:productId,
        bidder:bidderId,
        amount
    })


    //update product

    product.currentBid = amount;
    product.highestBidder = bidderId
    await product.save();

    //populate bidder

    const populateBid = await BID.findById(bid._id).populate("bidder", "name email");


    //socket Emit
    io.to(productId).emit(
        "bidPlaced",{
            productId,
            amount,
            bidder:populateBid.bidder
        }
    );


    return res.status(201).json({
        success:trusted,
        message:"Bid placed Successfully",
        bid:populateBid
    });
});



export {
    createProduct,
    deleteProduct,
    GetAllProduct,
    getLiveProducts,
    getMyProducts,
    startAuction,
    placeBid
}