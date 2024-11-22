import jwt from "jsonwebtoken"
import { Response } from "express"
import dotenv from "dotenv"
dotenv.config();

export const generateToken = (userId:string, res:Response) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET as string, {
        expiresIn: process.env.JWT_EXPIRES_IN
    })

    res.cookie("chrome__api_browse_imp", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== "development",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000
    })

    return token
}