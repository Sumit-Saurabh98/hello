import {Request, Response} from "express"
import bcrypt from "bcryptjs"
import User from "../models/user.model.js";
import { generateToken } from "../lib/utils.js";
import cloudinary from "../config/cloudinary.js";
export const signup = async (req:Request, res:Response) =>{
    try {
       const {fullName, email, password} = req.body;

       if(!fullName || !email || !password){
        res.status(403).json({status: false, message: "Invalid username or password or email"})
       }

       const existingUser = await User.findOne({ email: email});

       if(existingUser){
        return res.status(400).json({status: false, message: "User already exists"})
       }

       if(password.length < 6){
        return res.status(400).json({status: false, message: "password must be at least 6 characters"});
       }

       const salt = await bcrypt.genSalt(10);
       const hashedPassword = await bcrypt.hash(password, salt);

       const newUser = new User({
        fullName,
        email,
        password : hashedPassword,
       })

       if(newUser){
        generateToken(newUser._id.toString(), res);
        await newUser.save();
        res.status(201).json({status: true, message: "User created successfully", _id: newUser._id, fullName: newUser.fullName, email: newUser.email, profilePic: newUser.profilePic})
       }else{
        res.status(400).json({status: false, message: "Invalid user data"})
       }


    } catch (error) {
        console.log("Error in signup controller", error);
        res.status(500).json({status: false, message: "Internal server error"})
    }
}

export const login = async (req:Request, res:Response) =>{
    try {
        const {email, password} = req.body;
        if(!email || !password){
            res.status(403).json({status: false, message: "Invalid username or password or email"})
        }

        const user = await User.findOne({email: email});
        if(!user){
            return res.status(400).json({status: false, message: "User not found"})
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(400).json({status: false, message: "Invalid credentials"})
        }
        generateToken(user._id.toString(), res);

        res.status(200).json({
            status: true,
            message: "User logged in successfully",
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            profilePic: user.profilePic
        })
    } catch (error) {
        console.log("Error in login controller", error);
        res.status(500).json({status: false, message: "Internal server error"})
    }
}

export const logout = async (req:Request, res:Response) =>{
    try {
        res.cookie("chrome__api_browse_imp", "", {
            maxAge: 0
        })

        res.status(200).json({status: true, message: "User logged out successfully"})
    } catch (error) {
        console.log("Error in logout controller", error);
        res.status(500).json({status: false, message: "Internal server error"})
    }
}

export const updateProfile = async (req:Request, res:Response) => {
    try {
        console.log(req.body);
        const {profilePic} = req.body;
        if(!profilePic){
            return res.status(403).json({status: false, message: "Invalid profilePic"})
        }
        const user = await User.findById(req.user._id);
        if(!user){
            return res.status(400).json({status: false, message: "User not found"})
        }

        const uploadResponse = await cloudinary.uploader.upload(profilePic);
        user.profilePic = uploadResponse.secure_url;
        await user.save();
        res.status(200).json({status: true, message: "User profile updated successfully",user: req.user})
    } catch (error) {
        console.log("Error in updateProfile controller", error);
        res.status(500).json({status: false, message: "Internal server error"})
    }
}

export const checkAuth = async (req:Request, res:Response) => {
    try {
        res.status(200).json({status: true, message: "User is authenticated", user: req.user})
    } catch (error) {
        console.log("Error in checkAuth controller", error);
        res.status(500).json({status: false, message: "Internal server error"})
    }
}