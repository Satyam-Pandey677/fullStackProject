import nodemailer from "nodemailer"


export const sendMail = (message) => {

    const trasporter = nodemailer.createTransport({
        host:"smtp.gmail.com",
        port:465,
        auth:{
            user:process.env.USER,
            pass:process.env.PASS
        }
    })

    trasporter.sendMail(message)
}