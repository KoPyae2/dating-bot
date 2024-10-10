import { ServerApiVersion } from 'mongodb';
import mongoose from 'mongoose';

export const connectToDatabase = async (): Promise<void> => {
    try {

        await mongoose.connect(process.env.MONGODB_URL as string,{
            dbName:"dating",
        });
        console.log('============================');
        console.log("🚀 DB Connect successfully 🚀");
        console.log('============================');
    } catch (err) {
        console.error("Failed to connect to the db", err);
    }
};