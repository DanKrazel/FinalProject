import express from "express"
import cors from "cors"
import student from "./api/routes/students.route.js"
import jwt from "jsonwebtoken"
import bodyparser from "body-parser"
import cookieParser from "cookie-parser"
//import fileUpload from "express-fileupload"
const salt = 10;

const app = express()
app.use(bodyparser.urlencoded({extended:true}));
app.use(cookieParser());
app.use(cors())
app.use(express.json())
app.use("/api/v1/students",student)
app.use("*", (req, res) => res.status(404).json({ error: "not found"}))
app.use("/uploads", express.static("./uploads"));
export default app