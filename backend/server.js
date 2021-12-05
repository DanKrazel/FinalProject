import express from "express"
import cors from "cors"
import student from "./api/routes/students.route.js"

const app = express()

app.use(cors())
app.use(express.json())

app.use("/api/v1/students",student)
app.use("*", (req, res) => res.status(404).json({ error: "not found"}))

export default app