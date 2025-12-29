import mongoose from "mongoose";


// connect to db
export const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB connected: Connection successful');
    } catch (error) {
        console.error("MongoDB connection error:", error);
    }
};
