import RequestsDAO from "../../dao/requestsDAO.js"
import mongodb from "mongodb"
const ObjectId = mongodb.ObjectId





export default class RequestsController {

  static async apiGetRequests(req, res, next) {
    const requestsPerPage = req.query.requestsPerPage ? parseInt(req.query.requestsPerPage, 10) : 20
    const page = req.query.page ? parseInt(req.query.page, 10) : 0

    let filters = {}
    if (req.query.sender) {
      filters.sender = req.query.sender
    } else if (req.query.receiver) {
      filters.receiver = req.query.receiver
    } else if (req.query.studentID) {
      filters.studentID = ObjectId(req.query.studentID)
    } 

    const { requestsList, totalNumRequestsList } = await RequestsDAO.getRequests({
      filters,
      page,
      requestsPerPage,
    })

    let response = {
      requests: requestsList,
      page: page,
      filters: filters,
      entries_per_page: requestsPerPage,
      total_results: totalNumRequestsList,
    }
    res.json(response)
  }


  static async apiPostRequest(req, res, next) {
    try {
      const sender = req.body.sender
      const receiver = req.body.receiver
      const studentID = ObjectId(req.body.studentID)
      const RequestsResponse = await RequestsDAO.postRequests(
        sender,
        receiver,
        studentID,
      )
      console.log("RequestsResponse",RequestsResponse)
      if(RequestsResponse) {
        res.json({ status: "success" })
      }
    } catch (e) {
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

  static async apiRetrieveinfoByRequest(req, res, next){
    try {
      // let studentID = req.body.studentID
      // console.log('id',studentID)
      let request = await RequestsDAO.retrieveInfoByRequest()
      if (!request) {
        res.status(404).json({ error: "Not found" })
        return
      }
      res.json(request)
    } catch (e) {
      console.log(`api, ${e}`)
      res.status(500).json({ error: e })
    }
  }


  static async apiRetrieveProfessorByRequest(req, res, next){
    try {
      // let studentID = req.body.studentID
      // console.log('id',studentID)
      let request = await RequestsDAO.retrieveProfessorByRequest()
      if (!request) {
        res.status(404).json({ error: "Not found" })
        return
      }
      res.json(request)
    } catch (e) {
      console.log(`api, ${e}`)
      res.status(500).json({ error: e })
    }
  }

  // static async apiUpdateRequest(req, res, next) {
  //   try {
  //     const userID = req.body.user_id
  //     const username = req.body.username
  //     const password = req.body.password
  //     const phone = req.body.phone
  //     const mail = req.body.mail
  //     const UsersResponse = await RequestsDAO.updateRequests(
  //       userID,
  //       username,
  //       password,
  //       phone,
  //       mail,
  //     )
  //     if(UsersResponse) {
  //       res.json({ status: "success" })
  //     }
  //   } catch (e) {
  //     res.status(500).json({ error: e.message })
  //   }
  // }

  static async apiDeleteRequestByID(req, res, next) {
    try {
      const requestID = req.query.id
      console.log(requestID)

      const RequestsResponse = await RequestsDAO.deleteRequestbyID(
        requestID
      )
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