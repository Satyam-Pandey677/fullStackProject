
import { client } from "../index.js";
import { sendMail } from "../config/nodemailer.js";
import jwt from "jsonwebtoken"
import { USER } from "../models/UserModel.js";


const getToken = (user) => {
    const token = jwt.sign({user}, process.env.JWT_SECRET, {
        expiresIn:process.env.JWT_EXPIRE
    })

    return token
}

export const sendOtp = async(req, res) => {
    const {email} = req.body;

    if(!email){
        res.status(400)
        throw new Error("Email is Required")
    }

    const rateLimitKey = `ratelimit:${email}`;
    const rateLimit = await client.get(rateLimitKey);

    if(rateLimit){
        return res.status(429)
        .json({
            message:"too many requiest. Please wait before requisting any new otp"
        })
    }

    const otp = Math.floor(100000 + Math.random()*900000).toString();

    const otpKey = `otp:${email}`

    await client.set(otpKey,otp,{
        EX:300,
    });

    await client.set(rateLimitKey,"true",{
        EX:60
    })

    await client.set("rate-limit","true");

    const message = {
        from:"BiddIT",
        to:email,
        subject:"Sending Verification Code",
        text:`Your OTP is ${otp}`
    }

    sendMail(message)

    res.status(200)
    .json({
        mesage:"opt send to your email"
    })
}

export  const verifyOtp = async(req, res) => {
    const {otp} = req.body;
    const {email} = req.query;

    console.log(otp)
    console.log(email)


    const storedOTp = await client.get(`otp:${email}`);
    console.log(storedOTp)

    if(otp != storedOTp){
        return res.status(400)
        .json({
            message:"OTP not valid"
        })
    }

    let user = await USER.findOne({email});
    console.log(user)
    if(user == null){
        const name = email.slice(0,8);
        user = await USER.create({name,email});
    }

    const token = getToken(user);

    return res.status(200)
    .json({
        message:"user verified successfully",
        user,
        token
    })
}

export const profile = async( req, res) => {
    try {
        return req.user
    } catch (error) {
        throw new Error("User not login",error)
    }
}


