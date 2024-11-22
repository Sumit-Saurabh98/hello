import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const connectDB = async () =>{
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI as string);
        console.log(`MongoDB Connected to ${conn.connection.host}`)
    } catch (error:any) {
        console.log(`Error connecting to MongoDB: ${error.message}`);
        process.exit(1);
    }
}

export default connectDB;

