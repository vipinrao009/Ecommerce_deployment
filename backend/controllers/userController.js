import { comparePassword, hashPassword } from "../helpers/userHelpers.js"
import Order from "../models/OrderSchema.js"
import User from "../models/userModel.js"
import JWT from "jsonwebtoken"

const registerUser = async(req,res)=>{
    try {
        const {name,email,password,phone,address,question} = req.body
        //Validation
        if(!name){
            return res.status(400).json({
                message:"Name is required",
                success:false
            })
        }
        if(name.length <5){
            return res.status(400).json({
                message:"Name must be at least 5 characters",
                success:false
            })
        }
        if(!email){
            return res.status(400).json({
                message:"Email is required",
                success:false
            })
        }
        if(!password){
            return res.status(400).json({
                message:"Password is required",
                success:false
            })
        }
        if(!phone){
            return res.status(400).json({
                message:"Phone is required",
                success:false
            })
        }
        if(!address){
            return res.status(400).json({
                message:"Address is required",
                success:false
            })
        }
        if(!question){
            return res.status(400).json({
                message:"Question is required",
                success:false
            })
        }

        const emailExist = await User.findOne({email})
        if(emailExist){
            return res.status(200).json({
                message:"Already registered please login",
                success:false
            })
        }

        const hashedPassword = await hashPassword(password)

        //save in db
        const user = await new User({name,email,phone,address,question,password:hashedPassword}).save()
        
        user.password = undefined

        res.status(200).json({
            message:"User register successfully..",
            success:true,
            user
        })

    } catch (error) {
        res.status(500).json({
            message:"Registration failed..",
            success:false,
            error
        })
    }
}

const login = async(req,res)=>{
    try {
        const {email,password} = req.body

        if(!email || !password){
            return res.status(404).send({
                success:false,
                message:"Invalid email or password"
            })
        }

        //Email validate and get the password 
        const user = await User.findOne({email})
        if(!user){
            return res.status(404).send({
                message:"Email is not registered",
                success:false
            })
        }

        //match the password 
        const validpassword = await comparePassword(password,user.password)
        if(!validpassword){
            return res.status(404).send({
                message:"Invalid password",
                success:false
            })
        }

        //generate token
        const token = await JWT.sign({_id:user._id},process.env.JWT_SECRET,
        {
            expiresIn:'7d'
        })
        
        res.status(200).send({
            message:"Login successfully",
            success:true,
            user:{
                name:user.name,
                email:user.email,
                phone:user.phone,
                address:user.address,
                role:user.role
            },
            token
        })

    } catch (error) {
        console.log(error)
        res.status(500).send({
            message:"Failed to login",
            success:false
        })
    }
}

const forgotPassword = async(req,res)=>{
    const {email,question,newPassword} = req.body

    if(!email){
        return res.status(404).json({
            message:"email is required...",
            success:false
        })
    }

    if(!question){
        return res.status(404).json({
            message:"Question is required...",
            success:false
        })
    }

    try {
        const user = await User.findOne({email,question})

        if(!user){
            return res.status(404).json({
                message:"User does not exist..",
                success:false
            })
        }

        const hashed = await hashPassword(newPassword)

        await User.findByIdAndUpdate(user._id,{password:hashed})

        return res.status(200).json({
            message:"Password change successfully..",
            success:true
        })
    } catch (error) {
        return res.status(404).json({
            message:"Failed to change password",
            success:false,
            error
        })
    }
}

const test = async(req,res)=>{
    res.send("Protected route")
}

const updateProfile = async(req,res)=>{
    try {
        const {name,email,password,phone,address} = req.body
        if(!password && password.length < 6){
            return res.status(400).json({
                message:"Password is required and 6 charactor long"
            })
        }

        const hashedPassword = await hashPassword(password)
        const updatedUser = await User.findByIdAndUpdate(req.user._id,{
            name:name || updatedUser.name,
            email:email || updatedUser.email,
            phone: phone || updatedUser.phone,
            address: address || updatedUser.address,
            password: hashedPassword || updatedUser.password
        },{new:true})

        res.status(200).json({
            message:"Profile updated successfully",
            success:true,
            updatedUser
        })
    } catch (error) {
        res.status(400).json({
            message:"Failed to update the profile",
            success:false
        })
    }
}

// Admin get all order
const getAllOrder = async (req, res) => {
    try {
        // Use find() to search for all orders 
        const orders = await Order
            .find({})
            .populate('products', "-photo")
            .populate('buyer', "name")
            .sort({ "createdAt": -1 });

        // Check if orders array contains any elements
        if (orders.length > 0) {
            res.status(200).json({
                message: "Order details fetched successfully",
                success: true,
                orders, // Returning all matching orders
            });
        } else {
            res.status(200).json({
                message: "No orders found",
                success: true,
                orders: [], // Empty array if no orders are found
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Failed to get orders",
            success: false,
            error: error.message,
        });
    }
};

const updateStatus = async (req, res) => {
    try {
        // Correctly destructure orderID from req.params
        const { orderID } = req.params;  
        const { status } = req.body;
        
        // Use findByIdAndUpdate to update the order's status
        const result = await Order.findByIdAndUpdate(orderID, { status }, { new: true });

        // Respond with success message and updated result
        res.status(200).json({
            message: "Successfully updated status",
            success: true,
            result
        });
    } catch (error) {
        // Handle any errors
        res.status(500).json({
            message: "Failed to update status",
            success: false,
            error
        });
    }
};


export {
    registerUser,
    login,
    test,
    forgotPassword,
    updateProfile,
    getAllOrder,
    updateStatus
}