
import { client } from "../index.js";
import jwt from "jsonwebtoken"
import { USER } from "../models/UserModel.js";
import { publishToQueue } from "../config/rabbitmq.js";


const getToken = (user) => {
    const token = jwt.sign({user:user}, process.env.JWT_SECRET, {
        expiresIn:process.env.JWT_EXPIRE
    })
    return token;
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

    await client.set("rate-limit","true",{
        EX:60
    });

    const message = {
        to:email,
        subject:"Sending Verification Code",
        body:`Your OTP is ${otp}`
    }

    await publishToQueue("send-otp", message)

    res.status(200)
    .json({
        mesage:"opt send to your email"
    })
}

export  const verifyOtp = async(req, res) => {
    const {otp,email} = req.body;

    console.log(email)


    const storedOTp = await client.get(`otp:${email}`);
    console.log(storedOTp)

    if(!storedOTp || otp != storedOTp){
        return res.status(400)
        .json({
            message:"OTP not valid"
        })
    }

    await client.del(`otp:${email}`)

    let user = await USER.findOne({email});
    if(user == null){
        const name = email.slice(0,8);
        user = await USER.create({name,email});

        const message = {
        to:email,
        subject:"Welcome in BidIT",
        body:`Thank you for Creating profile in BidIT ${email}`
        }

        await publishToQueue("welcome-queue", message)
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
        const user = req.user;

        
        if(!user){
            res.status(400)
            throw new Error("User Not authorized")
        }
        return res.status(200)
        .json({
            message:"Your Profile",
            user
        })
    } catch (error) {
        throw new Error("User not login",error)
    }
}

export const updateProfile = async (req, res) => {
    try {
        const {name, phone}  = req.body;   
        const id = req.user._id;

        console.log(name, phone)

        if(!id){
            throw new Error("Please send Id")
        }

        const user = await USER.findByIdAndUpdate(id,{
            name:name,
            phone:phone
        })

        if(!user){
            res.status(404)
            throw new Error("User not found")
        }

        return res.status(200).json({
            message:"profile updated",
            user
        })
    } catch (error) {
        throw new Error("Something went wrong: ", error)
    }
}

export const getAllUser  =async(req, res) => {
    try {
        const users = await USER.find({});

        if(!users) {
            res.status(400)
            throw new Error("Users not found ", error)
        }

        return res.status(200)
        .json({
            message:"All Users Fetched",
            users
        })
    } catch (error) {
        res.status(500)
        throw new Error("Something went wrong", error)
    }
}


