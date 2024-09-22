import { Schema,model } from "mongoose";

const userSchema = new Schema((
    {
        name:{
            type: String,
            required: [true, "Name is required"],
            minlength: [5, "Name must be at least 5 characters"],
            trim: true, // Removes unnecessary spaces
        },

        email:{
            type: String,
            required: [true, "Email is required"],
            unique: true,
            lowercase: true,
        },

        password:{
            type:String,
            required:true,
        },

        phone:{
            type:String,
            required:true
        },

        address:{
            type:String,
            required:true
        },

        question:{
            type:String,
            required:true
        },

        role:{
            type:Number,
            default:0
        }
    }
),{timestamps:true})

const User = model("User", userSchema);
export default User;