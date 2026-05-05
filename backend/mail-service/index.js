import Express from "express"
import { startSendMSGnConsumer } from "./consumer.js";

const app = Express();
const port = process.env.PORT

startSendMSGnConsumer()

app.listen(port, () => {
    console.log("Mail server running on :",port)
})
