import mongoose from "mongoose"

export const dbConnect = () => {
    const connect  = mongoose.connect(`${process.env.DB_URL}/bidding`);
    if(connect){
        console.log("DB Connection successfull")
    }
}