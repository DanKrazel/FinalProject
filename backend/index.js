import app from "./server.js"
import mongodb from "mongodb"
import dotenv from "dotenv"
import StudentsDAO from "./dao/studentsDAO.js"
import UsersDAO from "./dao/usersDAO.js"
import CoursesDAO from "./dao/coursesDAO.js"
import FilesDAO from "./dao/filesDAO.js"
import UnitsBySemesterDAO from "./dao/unitsBySemesterDAO.js"
import RequestsDAO from "./dao/requestsDAO.js"
import DependenciesDAO from "./dao/dependenciesDAO.js"
import CoursesDetailsDAO from "./dao/coursesDetailsDAO.js"
import ImageVisualizationDAO from "./dao/ImageVisualizationDAO.js"
import path from "path"
import express from "express"



dotenv.config()
const MongoClient = mongodb.MongoClient

const port = process.env.PORT || 5000
let database = process.env.MONGO_URI;
const JWT_SECRET = process.env.JWT;

let client = new MongoClient(
  process.env.STUDREVIEWS_DB_URI,
  {
    maxPoolSize: 50,
    wtimeoutMS: 2500,
    useNewUrlParser: true 
  })


const clientPromise = client.connect()
.catch(err => {
  console.error(err.stack)
  process.exit(1)
})
.then(async client => {
  await StudentsDAO.injectDB(client)
  await UsersDAO.injectDB(client)
  await CoursesDAO.injectDB(client)
  await FilesDAO.injectDB(client)
  await UnitsBySemesterDAO.injectDB(client)
  await RequestsDAO.injectDB(client)
  await RequestsDAO.injectDB(client)
  await DependenciesDAO.injectDB(client)
  await CoursesDetailsDAO.injectDB(client)
  await ImageVisualizationDAO.injectDB(client)
  // app.listen(port, () => {
  //   console.log(`listening on port ${port}`)
  // })
})

export default clientPromise;


// MongoClient.connect(
//   process.env.STUDREVIEWS_DB_URI,
//   {
//     maxPoolSize: 50,
//     wtimeoutMS: 2500,
//     useNewUrlParser: true }
//   )
//   .catch(err => {
//     console.error(err.stack)
//     process.exit(1)
//   })
//   .then(async client => {
//     await StudentsDAO.injectDB(client)
//     await UsersDAO.injectDB(client)
//     await CoursesDAO.injectDB(client)
//     await FilesDAO.injectDB(client)
//     await UnitsBySemesterDAO.injectDB(client)
//     await RequestsDAO.injectDB(client)
//     await RequestsDAO.injectDB(client)
//     await DependenciesDAO.injectDB(client)
//     await CoursesDetailsDAO.injectDB(client)
//     await ImageVisualizationDAO.injectDB(client)
//     app.listen(port, () => {
//       console.log(`listening on port ${port}`)
//     })
//   })





  