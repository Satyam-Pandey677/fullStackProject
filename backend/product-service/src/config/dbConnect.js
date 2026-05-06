import mongoose from "mongoose"

export const dbConnect = async() => {
    
    const connect  =await mongoose.connect(`${process.env.DB_URL}/bidding`);
    if(connect){
        console.log("DB Connection successfull")
    }
}