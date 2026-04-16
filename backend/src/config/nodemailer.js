import nodemailer from "nodemailer"


export const sendMail = (email, subject,content) => {

    const trasporter = nodemailer.createTransport({
        host:"smtp.gmail.com",
        port:465,
        auth:{
            user:process.env.USER,
            pass:process.env.PASS
        }
    })

    trasporter.sendMail({
        from:"Bid Here",
        to:email,
        subject:`${subject}`,
        text:`${content}`

    })
}