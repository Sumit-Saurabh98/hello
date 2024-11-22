import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
export const protectRoute = async (req, res, next) => {
    try {
        const token = req.cookies.chrome__api_browse_imp;
        if (!token) {
            res
                .status(401)
                .json({ message: "Unauthorized - No token provided" });
            return;
        }
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            if (!decoded) {
                res
                    .status(401)
                    .json({ message: "Unauthorized - invalid token provided" });
                return;
            }
            const user = await User.findById(decoded.userId).select("-password");
            if (!user) {
                res.status(401).json({ message: "User not found" });
                return;
            }
            req.user = {
                ...user.toObject(),
                _id: user._id.toString(),
            };
            console.log(req.user);
            next();
        }
        catch (error) {
            console.log("Error in auth middleware :- ", error);
            if (error instanceof jwt.JsonWebTokenError) {
                res.status(401).json({
                    success: false,
                    message: "Unauthorized - invalid token provided",
                });
            }
            else {
                res
                    .status(500)
                    .json({ success: false, message: "Internal server error" });
            }
            return;
        }
    }
    catch (error) {
        console.log("Error in auth middleware :- ", error);
        if (error instanceof jwt.JsonWebTokenError) {
            res.status(401).json({
                success: false,
                message: "Unauthorized - invalid token provided",
            });
        }
        else {
            res
                .status(500)
                .json({ success: false, message: "Internal server error" });
        }
        return;
    }
};
