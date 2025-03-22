import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoutes from "./routes/userRoutes.js";
import cors from 'cors'
dotenv.config(); // Load environment variables
const app = express();
const corsOptions = {
    origin: 'http://localhost:5173', // Your frontend URL
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
  };
  app.use(cors(corsOptions));
const port = 5000;
app.use(express.json());
// Get MongoDB URI from environment variables
const mongoURI = process.env.MONGO_URL;

async function connectDB() {
    try {
        await mongoose.connect(mongoURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("Connected to MongoDB Atlas using Mongoose");
    } catch (error) {
        console.error("MongoDB connection failed:", error);
        process.exit(1);
    }
}

// Connect to MongoDB Atlas
connectDB();
app.get("/", (req, res) => {
    res.send("MongoDB Atlas is connected!");
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});

app.use("/users", userRoutes);