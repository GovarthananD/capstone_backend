import mongoose from "mongoose";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        require:true,
        trim:true
    },
    mobile:{
        type:String,
        require:true,
        trim:true
    },
    email:{
        type:String,
        require:true,
        trim:true,
        unique:true
    },
    password:{
        type:String,
        require:true,
        trim:true
    },
});

const User = mongoose.model("User", userSchema);
const generateToken = (id) => {
    return jwt.sign({id}, process.env.SECRET_KEY);
}

export {User, generateToken};