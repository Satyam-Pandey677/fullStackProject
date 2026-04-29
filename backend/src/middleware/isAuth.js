import jwt from "jsonwebtoken"

export const isAuth = async(req, res,next) => {

    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
        try {
            const header = req.headers.authorization.split(" ")[1]
            const decode = jwt.verify(token, process.env.JWT_SECRET)
            req.user = await User.findById(decode.id)
            next()
        } catch (error) {
             res.status(400)
            throw new Error("Not Authorized, token failed")
        }
    }

    if(!token){
        res.status(401);
        throw new Error("NOt authorized, no token")
    }

}