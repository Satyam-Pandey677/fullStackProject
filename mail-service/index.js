import Express from "express"

const app = Express();
const port = process.env.PORT


app.listen(port, () => {
    console.log("Mail server running on :",port)
})
