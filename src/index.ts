import express, { Application, Request, Response } from "express";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.route.js"
import messageRoutes from "./routes/message.route.js"

const app: Application = express();
const PORT = process.env.PORT || 5002;

app.use(express.json({limit: '10mb'}));
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true
}))

app.get("/test", (req:Request, res:Response) => {
    res.send("Server is working....")
})

app.use('/api/auth', authRoutes)
app.use('/api/auth', messageRoutes)

app.listen(PORT, ()=>{
    connectDB();
    console.log(`Server is listening on port ${PORT}`)
});
