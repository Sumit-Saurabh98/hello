import { Request, Response } from "express";
import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import cloudinary from "../config/cloudinary.js";

export const getUsersForSidebar = async (req:Request, res:Response) => {
    try {
        const loggedInUserId = req.user._id;

        if(!loggedInUserId){
            return res.status(400).json({status: false, message: "User not found"})
        }

        const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");
        res.status(200).json({status: true, message: "Users fetched successfully", users: filteredUsers});
        
    } catch (error) {
        console.log("Error in getUsersForSidebar controller", error);
        res.status(500).json({status: false, message: "Internal server error"})
    }
}

export const getMessages = async (req:Request, res:Response) => {
    try {
        const {id: userToChatId} = req.params;
        if(!userToChatId){
            return res.status(400).json({status: false, message: "User not found"})
        }

        const senderId = req.user._id;
        const receiverId = userToChatId;

        const messages = await Message.find({
            $or: [
                {senderId: senderId, receiverId: receiverId},
                {senderId: receiverId, receiverId: senderId}
            ]
        }).sort({createdAt: 1});

        res.status(200).json({
            status: true,
            message: "Messages fetched successfully",
            messages
        })
        
    } catch (error) {
        console.log("Error in getMessages controller", error);
        res.status(500).json({status: false, message: "Internal server error"})
    }
}

export const sendMessage = async (req:Request, res:Response) => {
    try {
        const {text, image} = req.body;
        const receiverId = req.params.id;
        const senderId = req.user._id;

        if(!receiverId){
            return res.status(400).json({status: false, message: "Receiver not found"})
        }
        if(!senderId){
            return res.status(400).json({status: false, message: "Sender not found"})
        }

        if(!text && !image){
            return res.status(400).json({status: false, message: "Message not found"})
        }

        let imageUrl;

        if(image){
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image: imageUrl
        })

        await newMessage.save();

        // TODO: realtime functionality goes here => socket.io

        res.status(200).json({status: true, message: "Message sent successfully", newMessage})
        
    } catch (error) {
        console.log("Error in sendMessage controller", error);
        res.status(500).json({status: false, message: "Internal server error"})
    }
}

