import cookieParser from "cookie-parser";
import cors from "cors";
import { config } from "dotenv";
import express from "express";
import mongoose from "mongoose";
import authRoutes from "./routes/auth";
import invoiceRoutes from "./routes/invoice";
import productRoutes from "./routes/product";
config();

mongoose.connect(process.env.MONGO_CONNECTION_URL as string).then(() => {
  console.log("Database connected successfully");
});

const app = express();
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    methods:"GET,POST,PUT,DELETE,PATCH,HEAD",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const PORT = process.env.PORT || 5000;

app.use("/api/auth", authRoutes);
app.use("/api/invoice", invoiceRoutes);
app.use("/api/product", productRoutes);

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});