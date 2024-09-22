import JWT from "jsonwebtoken"
import User from "../models/userModel.js"

export const requireSignIn = async(req,res,next)=> {
    try {
        const decode = JWT.verify(
            req.headers.authorization,
            process.env.JWT_SECRET
        )
        req.user = decode //user ki puri detail decode karke req.user me daal rahe hai so that we can access any data from anywhere related to user if user is logged in
        next()
    } catch (error) {
        console.log(error)
    }
}

//Admin access
export const isAdmin = async(req,res,next)=>{
    try {
        const user = await User.findById(req.user._id)
        if(user.role !== 1){
            return res.status(500).send({
                message:"Unauthorized user",
                success:false
            })
        }
        next()
    } catch (error) {
        console.log(error)
    }
}