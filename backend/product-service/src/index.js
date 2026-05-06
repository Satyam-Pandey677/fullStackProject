import express from "express"
import { dbConnect } from "./config/dbConnect.js";
import { connectRabbitMQ } from "./config/rabbitmq.js";

const app = express();
const port = process.env.PORT

app.use(express.json());

dbConnect();
connectRabbitMQ();


app.listen(port, () => {
    console.log("Product server running on :",port)
})
