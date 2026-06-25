
import cloudinary from "../config/cloudinary.js"
import { fileURLToPath } from "url"
import {CloudinaryStorage} from "multer-storage-cloudinary"

import multer from "multer"
import path from "path"

const storage = new CloudinaryStorage({
    cloudinary:cloudinary,
    params:{
        folder:"auction-images",
        allowedFormats:["jpg", "jpeg", "png", "gif", "webp"],
    },
})


export const upload = multer({
    storage,
    limits:{
        fileSize:10 * 1024 * 1024
    },
    fileFilter:(req, file, cb) =>{
        if(file.mimetype.startsWith("image/")){
            cb(null, true);
        }else{
            cb(new Error("only image allow"))
        }
    }
})

export const uploadOnCloudinary = async(file) => {
    if(!file){
        console.log("Please provide file name")
        return ;
    }

    const uploaded = await cloudinary.uploader.upload(file);

    if(!uploaded){
        console.log("something went wrong");
        return;
    }
    return uploaded
}

