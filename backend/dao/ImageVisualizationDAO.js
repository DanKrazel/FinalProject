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
      cursor = await imageVisualization.find(query)
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
    // filePath = filePath.substring(23)
    // filePath = filePath.replace(" ", "+")
    // let data = filePath;
    // let buff = new Buffer(data, 'base64');
    // let text = buff.toString('ascii');    
    // var myImage = new Image();
    // myImage.src = filePath;
    
    //filePath = filePath - start - base
    //console.log(filePath)

    // define('UPLOAD_DIR', 'images/');  
    // $img = $_POST['imgBase64'];  
    // $img = str_replace('data:image/png;base64,', '', $img);  
    // $img = str_replace(' ', '+', $img);  
    // $data = base64_decode($img);  
    // $file = UPLOAD_DIR . uniqid() . '.png';  
    // $success = file_put_contents($file, $data);  
    // print $success ? $file : 'Unable to save the file.'; 
    

  
    // filePath = filePath.substring(23)
    // filePath = filePath.replace('data:image/jpeg;base64,', '')
    // filePath = filePath.replace(" ", "+")
    // let bufferObj = Buffer.from(filePath, "base64");
    // let decodedString = bufferObj.toString("utf8");
    // console.log("The decoded string:", bufferObj);
    
    // fs.writeFile("uploads/image.jpg", bufferObj, (err) => {
    //   if (err)
    //     console.log(err);
    //   else {
    //     console.log("File written successfully\n");
    //     console.log("The written has the following contents:");
    //     //console.log(fs.readFileSync("books.txt", "utf8"));
    //   }
    // });
    
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

  static async retrieveStudentInfo() {
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
          ]
      return await imageVisualization.aggregate(pipeline).toArray()
    } catch (e) {
      console.error(`Something went wrong in imageVisualization: ${e}`)
      throw e
    }
  }


}
