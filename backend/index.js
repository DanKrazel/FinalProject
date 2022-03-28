import app from "./server.js"
import mongodb from "mongodb"
import dotenv from "dotenv"
import StudentsDAO from "./dao/studentsDAO.js"
import UsersDAO from "./dao/usersDAO.js"
import CoursesDAO from "./dao/coursesDAO.js"
import FilesDAO from "./dao/filesDAO.js"
import UnitsBySemester from "./dao/unitsBySemesterDAO.js"

dotenv.config()
const MongoClient = mongodb.MongoClient

const port = process.env.PORT || 8000

MongoClient.connect(
  process.env.STUDREVIEWS_DB_URI,
  {
    maxPoolSize: 50,
    wtimeoutMS: 2500,
    useNewUrlParser: true }
  )
  .catch(err => {
    console.error(err.stack)
    process.exit(1)
  })
  .then(async client => {
    await StudentsDAO.injectDB(client)
    await UsersDAO.injectDB(client)
    await CoursesDAO.injectDB(client)
    await FilesDAO.injectDB(client)
    await UnitsBySemester.injectDB(client)
    app.listen(port, () => {
      console.log(`listening on port ${port}`)
    })
  })

  