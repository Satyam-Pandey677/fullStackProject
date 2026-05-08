import Mongoose, { Schema } from "mongoose"

const productSchema = new Mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    description:{
        type:String
    },
    images:[{
        type:String
    }],
    starting_price:{
        type:Number,
        required:true,
        min:1
    },
    currentBid:{
        type:Number,
        default:0,
    },
    duration:{
        type:Number,
        required:true
    },
    endTime:{
        type:Number,
        required:true
    },
    status:{
        type:String,
        enum:["pending", "live", "ended"],
        default:"pending"
    },
    AuctionWinner:{
        type:Schema.Types.ObjectId,
        ref:"USER"
    },
    owner:{
        type:Schema.Types.ObjectId,
        ref:"USER"
    },
    category:{
        type:Schema.Types.ObjectId,
        ref:"CATEGORY"
    }
},{
    timestamps:true
})


export const PRODUCT = Mongoose.model("PRODUCT", productSchema);