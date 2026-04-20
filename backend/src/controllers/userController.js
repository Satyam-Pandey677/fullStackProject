
import { client } from "../index.js";
import { sendMail } from "../config/nodemailer.js";



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

    return res.status(200)
    .json({
        message:"user verified successfully"
    })
}


