import { Request } from "express";
import { IUser } from "./lib/interfaces.js";

declare global {
    namespace Express {
        interface Request {
            user: IUser
        }
    }
}