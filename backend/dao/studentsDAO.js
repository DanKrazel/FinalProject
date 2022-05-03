import mongodb from "mongodb"
import csvtojson from "csvtojson"
import multer from "multer"
import fs from "fs"
import XLSX from "xlsx"

const ObjectId = mongodb.ObjectId
let students

export default class StudentsDAO {
  static async injectDB(conn) {
    if (students) {
      return
    }
    try {
        students = await conn.db(process.env.RESTREVIEWS_NS).collection("students")
    } catch (e) {
      console.error(
        `Unable to establish a collection handle in studentsDAO: ${e}`,
      )
    }
  }
  static async getStudents({filters = null,page = 0,studentsPerPage = 20,} = {}) {
    let query
    if (filters) {
      if ("_id" in filters) {
        query = { "_id": { $eq: filters["_id"] } }
      } else if ("student_id" in filters) {
        query = { "student_id": { $eq: filters["student_id"] } }
      } else if ("name" in filters) {
        query = { "name": { $eq: filters["name"] } }
      } else if ("valideunits" in filters) {
        query = { "valideunits": { $eq: filters["valideunits"] } }
      } else if ("totalunits" in filters) {
        query = { "totalunits": { $eq: filters["totalunits"] } }
      }
      
    }

    let cursor
    
    try {
      cursor = await students
        .find(query)
    } catch (e) {
      console.error(`Unable to issue find command, ${e}`)
      return { studentsList: [], totalNumStudentsList: 0 }
    }

    const displayCursor = cursor.limit(studentsPerPage).skip(studentsPerPage * page)

    try {
      const studentsList = await displayCursor.toArray()
      const totalNumStudents = await students.countDocuments(query)

      return { studentsList, totalNumStudents }
    } catch (e) {
      console.error(
        `Unable to convert cursor to array or problem counting documents, ${e}`,
      )
      return { studentsList: [], totalNumStudents: 0 }
    }
  }


  
  static async getStudentByID(studentID) {
    try {
      const studentDoc = {
        _id:studentID
      }
      return await students.findOne(studentDoc)
    } catch (e) {
      console.error(`Something went wrong in getStudentByID: ${e}`)
      throw e
    }
  }
  static async getNames() {
    let names = []
    try {
      names = await students.distinct("name")
      return names
    } catch (e) {
      console.error(`Unable to get names, ${e}`)
      return names
    }
  }
  static async addStudent (studentID, name, average, totalunits, years) {
    try {
      const studentDoc = { 
          student_id: studentID,
          name: name,
          average: average,
          totalunits: totalunits,
          years: years}

      return await students.insertOne(studentDoc)
    } catch (e) {
      console.error(`Unable to post student: ${e}`)
      return { error: e }
    }
  }
  static async getCoursesByStudentID(id) {
      try {
        const pipeline = [
          {
              $match: {
                  _id: new ObjectId(id),
              },
          },
          {
            $lookup: {
                from: "courses",
                let: {
                    id: "$_id",
                },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $eq: ["$studentID", "$$id"],
                            },
                        },
                    },
                    {
                        $sort: {
                            date: -1,
                        },
                    },
                ],
                as: "courses",
            },
        },
        {
            $addFields: {
                courses: "$courses",
            },
        },
            ]
          console.log(pipeline)
        return await students.aggregate(pipeline).next()
      } catch (e) {
        console.error(`Something went wrong in getCoursesByStudentID: ${e}`)
        throw e
      }
  }
//good
  static async updateUnitsStudent(studentID) {
  try {
      const updateResponse = await students.updateOne(
        { _id: ObjectId(studentID)},{ $set: { totalunits: 0 ,valideunits: 0 } },
      )
       return updateResponse
      } catch (e) {
        console.error(`Unable to update student unit: ${e}`)
        return { error: e }
      }
  }
//good
  static async resetAverageStudent(studentID) {
      try {
        const updateResponse = await students.updateOne(
          { _id: ObjectId(studentID)},
          { $set: { average: 0 } },
        )
  
        return updateResponse
      } catch (e) {
        console.error(`Unable to update student unit: ${e}`)
        return { error: e }
      }
  }
  static async updateAverageStudent(studentID) {
      try {
        const updateResponse = await students.updateOne(
          { _id: ObjectId(studentID)},
          { $set: { average: average/totalunits } },
        )
  
        return updateResponse
      } catch (e) {
        console.error(`Unable to update student unit: ${e}`)
        return { error: e }
      }
  }
  static async getUnitByStudentID(id){
      let unit;
      try {
        console.log("test")
        //unit = await students.find({ _id: new ObjectId(id) },
                                   //{ units: 1, _id: 0 })
        let query = { "_id": { $eq: id } }
        unit = await students.find(query)
        //console.log(unit.toArray()[0])
        //console.log(unit.toArray()[0]["units"])
        return unit.toArray()
      } catch (e) {
        console.error(`Unable to get unit, ${e}`)
        return unit
      }
  }
  static async getAverageByStudentID(id){
      let unit;
      try {
        console.log("test")
        //unit = await students.find({ _id: new ObjectId(id) },
                                   //{ units: 1, _id: 0 })
        let query = { "_id": { $eq: id } }
        unit = await students.find(query)
        //console.log(unit.toArray()[0])
        //console.log(unit.toArray()[0]["units"])
        return unit.toArray()
      } catch (e) {
        console.error(`Unable to get unit, ${e}`)
        return unit
      }
  }

  static async uploadStudentFromCSV(filePath){
      var arrayToInsert = [];
      console.log(filePath)
      // Load the Excel file
      const workBook = XLSX.readFile(filePath);
      XLSX.writeFile(workBook, filePath, { bookType: "csv" });
      //console.log("workBook", workBook)
      csvtojson({flatKeys:true}).fromFile(filePath).then(source => {
      //console.log("source:", source)
      //console.log(source)
      // Fetching the all data from each row
      for (var i = 0; i < source.length; i++) {
        var oneRow = {
          student_id: source[i]['ת. זהות'],
          name: source[i]["שם"],
          valideunits: parseFloat(source[i]['נ"ז מצטבר']),
          average: parseFloat(source[i]["ממוצע מצטבר"]),
        };
        arrayToInsert.push(oneRow);
        //console.log(oneRow)
      }
        fs.unlinkSync(filePath);
        students.insertMany(arrayToInsert, (err, result) => {
          if (err)
            console.log(err);
          if(result){
              console.log("Import CSV into database successfully.");
          }
         //inserting into the table "courses"    
      });
    });
  }

  static async deleteAllStudent() {
    try {
      const deleteResponse = await students.deleteMany()
      return deleteResponse
    } catch (e) {
      console.error(`Unable to delete students: ${e}`)
      return { error: e }
    }
  }
}