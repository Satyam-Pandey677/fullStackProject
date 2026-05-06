import amqp from "amqplib"
import nodemailer from "nodemailer"

export const startSendMSGnConsumer = async() => {
    console.log("function started")
    try {
        const connection = await amqp.connect({
            protocol:"amqp",
            hostname:process.env.RABBITMQ_HOST,
            port:5672,
            username:process.env.RABBITMQ_USERNAME,
            password:process.env.RABBITMQ_PASS
        })

        console.log("hello")


        const channel = await connection.createChannel();


        // This OTP mail service

        const queueName = "send-otp";

        await channel.assertQueue(queueName, {durable:true});

        console.log("✅ Mail service consumer started, listening for otp emails")

        channel.consume(queueName, async(msg) => {
            try {
                const {to, subject, body} = JSON.parse(msg.content.toString());

                console.log(process.env.PASSWORD)
                console.log(process.env.USER)
                const transporter = nodemailer.createTransport({
                    host:"smtp.gmail.com",
                    port:465,
                    auth:{
                        user:process.env.USER,
                        pass:process.env.PASSWORD
                    }
                });

                await transporter.sendMail({
                    from:"BidIt",
                    to,
                    subject,
                    text:body
                })

                console.log(`OTP mail sent to ${to}`);
                channel.ack(msg)
            } catch (error) {
                console.log("Failed to send Message", error)
            }
        })

        // This is Content Message service

        const msgQueueName = "welcome-queue"
        await channel.assertQueue(msgQueueName, {durable:true});

        console.log("✅ Mail service consumer started, listening for otp emails")

        channel.consume(msgQueueName, async(msg) => {
            try {
                const {to, subject, body} = JSON.parse(msg.content.toString());

                const transporter = nodemailer.createTransport({
                    host:"smtp.gmail.com",
                    port:465,
                    auth:{
                        user:process.env.USER,
                        pass:process.env.PASSWORD
                    }
                });

                await transporter.sendMail({
                    from:"BidIt",
                    to,
                    subject,
                    text:body
                })

                console.log(`OTP mail sent to ${to}`);
                channel.ack(msg)
            } catch (error) {
                console.log("Failed to send Message", error)
            }
        })
    } catch (error) {
        console.log("Failed to start rabbitmq consumer", error)
    }
}