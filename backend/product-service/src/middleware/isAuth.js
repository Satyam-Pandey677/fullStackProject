import jwt from "jsonwebtoken"

export const isAuth = async(req, res,next) => {

    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
        try {
            token  = req.headers.authorization.split(" ")[1]
            const decode = jwt.verify(token, process.env.JWT_SECRET)
            req.user = decode.user
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

export const isAdmin = () => {
     if(!req.user.isAdmin){
        return res.status(403).json({
            message:"user not Admin"
        })
    }
    next()
}