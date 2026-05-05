import mongoose, { Schema } from "mongoose";

const userSchema= new Schema({
    name:{
        type:String,
    },
    email:{
        type:String,
        required:true,
        lowercase:true,
        unique:true,
        trim:true
    },
    phone:{
        type:Number
    }
},{
    timestamps:true
})

export const USER = mongoose.model("USER", userSchema)