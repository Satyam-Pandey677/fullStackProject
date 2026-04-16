import express from "express";
import { dbConnect } from "./config/dbConnect.js";
import userRouter from "./routes/userRouter.js";
import {createClient} from "redis"

const app = express();
const port = process.env.PORT

app.use(express.json());

// dbConnect()
export const client = createClient({
    url:"redis://127.0.0.1:6379"
})
client.on("error", (err) => console.log("redis error: ",err))
client.connect();   

app.use("/api/user",userRouter)


app.listen(port, () => {
    console.log("Server running on port: ", port)
})