'use strict';
import app from "./server.js"
import serverless  from 'serverless-http'

module.exports.hello = serverless(app)

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };

