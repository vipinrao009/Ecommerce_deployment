import express from "express";
import colors from "colors";
import dotenv from "dotenv";
import connectDB from "./config/db.connection.js";
import morgan from "morgan";
import user from "./routes/userRoutes.js"
import category from "./routes/categoryRoutes.js"
import product from "./routes/productRoutes.js"
import cors from "cors"
import path from "path"

//configure env
dotenv.config();

//DB connection
connectDB()

//rest object
const app = express();
const _dirname = path.resolve()

//middleware
app.use(
  cors({
    origin: [process.env.FRONTEND_URL],
    credentials: true
  })
);
app.use(express.json())
app.use(morgan('dev'))

//routes
app.use("/api/v1/user",user)
app.use("/api/v1/category",category)
app.use("/api/v1/product",product)

app.use(express.static(path.join(_dirname,"/frontend/build")))

app.get('*',(req,res)=>{
  res.sendFile(path.resolve(_dirname,"frontend","build","index.html"))
})

app.use("/", (req, res) => {
  res.send("<h1>Welcome to ecommerce website</h1>");
});

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(
    `Server is running on ${process.env.DEV_MODE} mode on port ${PORT}`.bgCyan
      .white
  );
});
