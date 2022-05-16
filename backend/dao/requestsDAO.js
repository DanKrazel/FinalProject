import mongodb from "mongodb"
const ObjectId = mongodb.ObjectId
let requests

export default class RequestsDAO {
  static async injectDB(conn) {
    if (requests) {
      return
    }
    try {
        requests = await conn.db(process.env.STUDREVIEWS_NS).collection("requests")
    } catch (e) {
      console.error(
        `Unable to establish a collection handle in requestsDAO: ${e}`,
      )
    }
  }

  static async getRequests({filters = null, page = 0,requestsPerPage = 20} = {}) {
    let query
    if (filters) {
       if ("sender" in filters) {
        query = { "sender": { $eq: filters["sender"] } }
      } else if ("receiver" in filters) {
        query = { "receiver": { $eq: filters["receiver"] } } 
      } else if ("studentID" in filters) {
        query = { "studentID": { $eq: filters["studentID"] } }
        }
    }

    let cursor
    
    try {
      cursor = await requests.find(query)
    } catch (e) {
      console.error(`Unable to issue find command, ${e}`)
      return { requestsList: [], totalNumRequestsList: 0 }
    }

    const displayCursor = cursor.limit(requestsPerPage).skip(requestsPerPage * page)

    try {
      const requestsList = await displayCursor.toArray()
      const totalNumRequestsList = await requests.countDocuments(query)

      return { requestsList, totalNumRequestsList }
    } catch (e) {
      console.error(
        `Unable to convert cursor to array or problem counting documents, ${e}`,
      )
      return { requestsList: [], totalNumRequestsList: 0 }
    }
  }

  static async postRequests (sender, receiver, studentID) {
    try {
      const requestsDoc = { 
          sender: sender,
          receiver: receiver,
          studentID: studentID
        }
      return await requests.insertOne(requestsDoc)
    } catch (e) {
      console.error(`Unable to post request: ${e}`)
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

  static async deleteRequestbyID (requestID) {
    try {
      const requestDoc= {
        _id: ObjectId(requestID),
      }

      return await requests.deleteOne(requestDoc)
    } catch (e) {
      console.error(`Unable to delete request: ${e}`)
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

  static async retrieveInfoByRequest() {
    try {
      const pipeline = [
        {
            $match: {
                //  studentID: new ObjectId(id),
            },
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
        {
          $lookup: {
            from: "users",
            let: {
                sender: "$sender",
            },
            pipeline: [
                {
                    $match: {
                        $expr: {
                            $eq: ["$username", "$$sender"],
                        },
                    },
                },
                {
                    $sort: {
                        date: -1,
                    },
                },
            ],
            as: "professor",
        },
      },
      {
          $addFields: {
              professor: "$professor"
          },
      },
          ]
      return await requests.aggregate(pipeline).toArray()
    } catch (e) {
      console.error(`Something went wrong in retrieveStudentByRequest: ${e}`)
      throw e
    }
  }

    static async retrieveProfessorByRequest() {
      try {
        const pipeline = [
          {
              $match: {
                  //  studentID: new ObjectId(id),
              },
          },
          {
            $lookup: {
                from: "users",
                let: {
                    sender: "$sender",
                },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $eq: ["$username", "$$sender"],
                            },
                        },
                    },
                    {
                        $sort: {
                            date: -1,
                        },
                    },
                ],
                as: "professor",
            },
        },
        {
            $addFields: {
              professor: "$professor",
            },
        },
            ]
          console.log(pipeline)
        return await requests.aggregate(pipeline).toArray()
      } catch (e) {
        console.error(`Something went wrong in retrieveProfessorByRequest: ${e}`)
        throw e
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
