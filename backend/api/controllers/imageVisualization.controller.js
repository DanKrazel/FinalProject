import ImageVisualizationDAO from "../../dao/ImageVisualizationDAO.js"
import mongodb from "mongodb"
const ObjectId = mongodb.ObjectId





export default class imageVisualizationController {

  static async apiGetImageVisualization(req, res, next) {
    const imageVisualizationPerPage = req.query.imageVisualizationPerPage ? parseInt(req.query.imageVisualizationPerPage, 10) : 20
    const page = req.query.page ? parseInt(req.query.page, 10) : 0

    let filters = {}
    if (req.query._id) {
      filters._id = ObjectId(req.query._id)
    } else if (req.query.sender) {
      filters.sender = req.query.sender
    } else if (req.query.receiver) {
      filters.receiver = req.query.receiver
    } else if (req.query.imagePath) {
        filters.imagePath = (req.query.imagePath)
    } else if (req.query.student_id) {
        filters.student_id = (req.query.student_id)
    } else if (req.query.studentID) {
      filters.studentID = ObjectId(req.query.studentID)
    } 

    const { imageVisualizationList, totalNumImageVisualizationList } = await ImageVisualizationDAO.getImageVisualization({
      filters,
      page,
      imageVisualizationPerPage,
    })

    let response = {
      imageVisualization: imageVisualizationList,
      page: page,
      filters: filters,
      entries_per_page: imageVisualizationPerPage,
      total_results: totalNumImageVisualizationList,
    }
    res.json(response)
  }


  static async apiPostImageVisualization(req, res, next) {
    try {
      const sender = req.body.sender
      const receiver = req.body.receiver
      const imagePath = req.body.imagePath
      const studentID = ObjectId(req.body.studentID)
      const ImageVisualizationResponse = await ImageVisualizationDAO.postImageVisualization(
        sender,
        receiver,
        imagePath,
        studentID,
      )
      console.log("ImageVisualizationResponse",ImageVisualizationResponse)
      res.json({ status: "success" })
    } catch (e) {
      console.log(e.message)
      console.log("test")
      res.status(500).json({ error: e.message })
    }
  }

  static async apiGetRequestSent(req, res, next) {
    try {
      const sender = req.body.sender
      const receiver = req.body.receiver
      const studentID = ObjectId(req.body.studentID)
      let requestSent = await RequestsDAO.findRequests(
        sender,
        receiver,
        studentID,
      )
      let filters = {
        sender:"",
        receiver:"",
        studentID:""
      }
      if (sender && receiver && studentID) {
        filters.sender = sender
        filters.receiver = receiver
        filters.studentID = studentID
      } 

      //console.log(unit[0]["units"])
      let response = {
        request: requestSent,
        filters: filters,     
      }
      res.json(response)
    } catch (e) {
      console.log(`api, ${e}`)
      res.status(500).json({ error: e })
    }
  }
  

  static async apiDeleteImageVisualizationByID(req, res, next) {
    try {
      const imageVisualizationID = req.query.id
      console.log(imageVisualizationID)

      const ImageVisualizationResponse = await ImageVisualizationDAO.deleteImageVisualizationbyID(
        imageVisualizationID
      )
      console.log(ImageVisualizationResponse)
      res.json({ status: "success" })
    } catch (e) {
      res.status(500).json({ error: e.message })
    }
  }

  static async apiDeleteRequestBystudentID(req, res, next) {
    try {
      const studentID = req.params.id || {}
      console.log(studentID)
      const requestResponse = await RequestsDAO.deleteRequestByStudentID(
        studentID
      )
      res.json({ status: "success" })
    } catch (e) {
      res.status(500).json({ error: e.message })
    }
  }

  static async apiDeleteAllRequests(req, res, next) {
    try {
      const RequestsResponse = await RequestsDAO.deleteAllrequests()
      res.json({ status: "success" })
    } catch (e) {
      res.status(500).json({ error: e.message })
    }
  }


}