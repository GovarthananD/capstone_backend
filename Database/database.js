import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const DB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL)
        console.log("MongoDB Connected...");
    } catch (error) {
        console.log("MongoDB not Connected!")
    }
};

export default DB;