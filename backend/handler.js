import serverless from "serverless-http"
import app from "./server.js"
import clientPromise from "./index.js"

await clientPromise;

export const handler = serverless(app)