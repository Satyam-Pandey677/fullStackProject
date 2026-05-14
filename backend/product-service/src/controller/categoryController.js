import { CATEGORY } from "../model/categoryModel";
import { asyncHandler } from "../utils/asyncHandler";


const createCategory = asyncHandler(async(req, res) => {
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