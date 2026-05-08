import { asyncHandler } from "../utils/asyncHandler.js"

const createProduct = asyncHandler(async(req, res) =>{

    const {name, description} = req.body;
    
})

export {
    createProduct
}