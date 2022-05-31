import express from "express"
import cors from "cors"
import student from "./api/routes/students.route.js"
import jwt from "jsonwebtoken"
import bodyparser from "body-parser"
import cookieParser from "cookie-parser"
import path from "path"
import dotenv from "dotenv"
import { fileURLToPath } from 'url';

//const __filename = fileURLToPath(import.meta.url);
dotenv.config()
const app = express()
app.use(bodyparser.json({limit: '50mb'}));
app.use(bodyparser.urlencoded({limit: '50mb', extended:true}));
app.use(cookieParser());
app.use(cors())
app.use(express.json())
app.use("/api/v1/students",student)
//app.use("*", (req, res) => res.status(404).json({ error: "not found"}))
app.use("/uploads", express.static("./uploads"));

// Deployment
const __dirname = path.resolve();
if(process.env.NODE_ENV === 'production'){
// Step 1:
    app.use(express.static(path.resolve(__dirname, "../frontend/build")));
// Step 2:
    app.get("*", function (req, res) {
        res.sendFile(path.resolve(__dirname, "../frontend/build", "index.html"));
    });
} else{
    app.get("/", (req,res) => {
        res.send("API is running Successfully")
    });
}



export default app;