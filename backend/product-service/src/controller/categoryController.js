import { CATEGORY } from "../model/categoryModel.js";
import { asyncHandler } from "../utils/asyncHandler.js";


export const createCategory = asyncHandler(async(req, res) => {
    const {name} = req.body;

    if(!name){
        res.status(400)
        .json({
            message:"Name is required"
        })

        const category = await CATEGORY.create({
            name
        })

        if(!category){
            res.status(500)
            .json({
                message:"Something went wrong"
            })
        }

        return res.status(201)
        .json({
            message:"Category created successfully",
            category
        })
    }
})


export const fetchCategories = asyncHandler(async(req, res) =>{
    const categories = await CATEGORY.find().select("_id name");

    if(!categories){
        throw new Error(400, "Something went wrong")
    }

    return res.status(200)
    .json({
        message:"Fetched All Categorieds",
        categories
    })
})
