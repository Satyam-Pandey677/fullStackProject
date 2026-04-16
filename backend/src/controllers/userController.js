
import { client } from "../index.js";
import { sendMail } from "../config/nodemailer.js";



export const sendOtp = async(req, res) => {
    const {email} = req.body;

    console.log(email)

    if(!email){
        res.status(400)
        throw new Error("Email is Required")
    }

    const rateLimitKey = `otp: ${email}`;
    const rateLimit = await client.get(rateLimitKey);

    if(rateLimit){
        res.status(429)
        .json({
            message:"too many requiest. Please wait before requisting any new otp"
        })
    }

    const otp = Math.floor(100000 + Math.random()*900000).toString();

    const otpKey = `otp: ${email}`

    await client.set("otp",otp,{
        EX:300,
    });

    await clint.set(rateLimitKey,"true",{
        EX:60
    })

    await client.set("rate-limit");

    const message = {
        from:"BiddIT",
        to:email,
        subject:"Sending Verification Code",
        text:`Your OTP is ${otp}`
    }

    sendMail(mesage)

    res.status(200)
    .json({
        mesage:"opt send to your email"
    })
}


