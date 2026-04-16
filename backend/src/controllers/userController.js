import { client } from "..";



const sendOtp = async(req, res) => {
    const {email} = req.body;

    if(!email){
        res.status(400)
        throw new Error("Email is Required")
    }

    const otp = Math.floor(100000 + Math.random()*900000).toString();

    await client.set("otp",otp)

}