'use strict';
import app from "./server.js"
import serverless from "serverless-http"

export async function api(event) {
  return serverless(app);
}
