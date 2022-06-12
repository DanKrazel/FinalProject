import mongodb from "mongodb"
const ObjectId = mongodb.ObjectId
import fs from "fs"
import XLSX from "xlsx"
let imageVisualization

export default class RequestsDAO {
  static async injectDB(conn) {
    if (imageVisualization) {
      return
    }
    try {
        imageVisualization = await conn.db(process.env.STUDREVIEWS_NS).collection("imageVisualization")
    } catch (e) {
      console.error(
        `Unable to establish a collection handle in requestsDAO: ${e}`,
      )
    }
  }

  static async getImageVisualization({filters = null, page = 0,imageVisualizationPerPage = 20} = {}) {
    let query = {}
    console.log("filters",filters)
    if (filters) {
      if ("_id" in filters) {
        query = { "_id": filters["_id"] }
      } else if ("sender" in filters) {
        query = { "sender": filters["sender"] }
      } else if ("receiver" in filters) {
        query = { "receiver": filters["receiver"] } 
      } else if ("studentID" in filters) {
        query = { "studentID": filters["studentID"] }
      } else if ("student_id" in filters) {
        query = { 
          "student": {
            "student_id": filters["student_id"] 
          }
        }
      }
    }

    let cursor
    console.log("query",query)
    const pipeline = [
      {
          $match: query,
      },
      {
        $lookup: {
            from: "students",
            let: {
                id: "$studentID",
            },
            pipeline: [
                {
                    $match: {
                        $expr: {
                            $eq: ["$_id", "$$id"],
                        },
                    },
                },
                {
                    $sort: {
                        date: -1,
                    },
                },
            ],
            as: "student",
        },
      },
      {
          $addFields: {
              student: "$student",
          },
      },
        ]
    try {
      //cursor = await imageVisualization.find(query)
      cursor = await imageVisualization.aggregate(pipeline)
    } catch (e) {
      console.error(`Unable to issue find command, ${e}`)
      return { imageVisualizationList: [], totalNumImageVisualizationList: 0 }
    }

    const displayCursor = cursor.limit(imageVisualizationPerPage).skip(imageVisualizationPerPage * page)

    try {
      const imageVisualizationList = await displayCursor.toArray()
      const totalNumImageVisualizationList = await imageVisualization.countDocuments(query)

      return { imageVisualizationList, totalNumImageVisualizationList }
    } catch (e) {
      console.error(
        `Unable to convert cursor to array or problem counting documents, ${e}`,
      )
      return { imageVisualizationList: [], totalNumImageVisualizationList: 0 }
    }
  }

  static async postImageVisualization (sender, receiver, filePath, studentID) {
    
    try {
      const imagesVisualizationDoc = { 
          sender: sender,
          receiver: receiver,
          imagePath: filePath,
          studentID: studentID
        }
      return await imageVisualization.insertOne(imagesVisualizationDoc)
    } catch (e) {
      console.error(`Unable to post imageVisualization: ${e}`)
      return { error: e }
    }
  }

  static async updateRequests (sender, receiver, studentID) {
    try {
        const requestsDoc = { 
            sender: sender,
            receiver: receiver,
            studentID: studentID
          }

      return await requests.requestsDoc(requestsDoc)
    } catch (e) {
      console.error(`Unable to update request: ${e}`)
      return { error: e }
    }
  }

  static async deleteImageVisualizationbyID (imageVisualizationID) {
    try {
      const doc = {
        _id: ObjectId(imageVisualizationID),
      }

      return await imageVisualization.deleteOne(doc)
    } catch (e) {
      console.error(`Unable to delete imageVisualization: ${e}`)
      return { error: e }
    }
  }

  static async findRequests (sender, receiver, studentID){
      try {
        const requestsDoc = { 
            sender:sender,
            receiver:receiver,
            studentID:studentID
        }
        let query = { "sender": { $eq: sender },
                      "receiver": { $eq: receiver },
                      "studentID": { $eq: studentID },
                         }
        return await requests.findOne(query)
      } catch (error) {
        console.error(`Unable to find request: ${e}`)
        return { error: e }
      }
  }

  static async deleteRequestByStudentID(studentID) {
    try {
      const deleteResponse = await requests.deleteMany({
        studentID: ObjectId(studentID),
      })
      return deleteResponse
    } catch (e) {
      console.error(`Unable to delete requests: ${e}`)
      return { error: e }
    }
  }




  static async deleteAllrequests() {
    try {
      const deleteResponse = await requests.deleteMany()
      return deleteResponse
    } catch (e) {
      console.error(`Unable to delete requests: ${e}`)
      return { error: e }
    }
  }


}
