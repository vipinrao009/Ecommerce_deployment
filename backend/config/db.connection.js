import mongoose from "mongoose";
import colors from "colors"

const connectDB = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGO_URI);
    console.log(`Connected to mongoDB Database ${connection.connection.host}`.blue.bgMagenta);
  } catch (error) {
    console.log(error.message);
  }
};

export default connectDB;
