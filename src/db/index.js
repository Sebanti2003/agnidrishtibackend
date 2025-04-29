import mongoose from "mongoose";

const db=async()=>{
    try {
        const conn=await mongoose.connect(process.env.MONGO_URI);
        console.log("connected to database",conn.connection.host,conn.connection.name);
    } catch (error) {
        console.log(error);
    }
}

export default db