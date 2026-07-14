import express from "express";
import { dbConnect } from "./config/dbConnect.js";
import userRouter from "./routes/userRouter.js";
import {createClient} from "redis"
import { connectRabbitMQ } from "./config/rabbitmq.js";
import cors from "cors"

const app = express();
const port = process.env.PORT

app.use(express.json());
app.use(cors())
connectRabbitMQ();
dbConnect()



export const client = createClient({
    url:`${process.env.REDIS_URL}`
})

client.connect().then(() =>  console.log("Connected to redis"))

app.use("/api/user",userRouter)


app.listen(port, () => {
    console.log("Server running on port: ", port)
})