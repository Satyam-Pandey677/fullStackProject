import mongoose, { Schema } from "mongoose";

const bidSchema = new mongoose.Schema({
    product:{
        type:Schema.Types.ObjectId,
        ref:"PRODUCT",
        required:true
    },
    bidder:{
        type:Schema.Types.ObjectId,
        ref:"USER",
        required:true
    },
    amount:{
        type:Number,
        required:true
    }
},{
    timestamps:true
})

export const BID = mongoose.model("BID", bidSchema)