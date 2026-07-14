import express from "express"
import { dbConnect } from "./config/dbConnect.js";
import { connectRabbitMQ } from "./config/rabbitmq.js";
import cors from "cors";
import {createClient} from "redis"

import productRouter from "./router/productRouter.js"
import categoryRouter from "./router/categoryRouter.js"


const app = express();
const port = process.env.PORT

app.use(express.json());
app.use(cors())

dbConnect();
connectRabbitMQ();

app.use("/api/product", productRouter)
app.use("/api/categories", categoryRouter)

export const client = createClient({
    url:`${process.env.REDIS_URL}`
})

client.connect().then(() =>  console.log("Connected to redis"))


app.listen(port, () => {
    console.log("Product server running on :",port)
})
