import UsersDAO from "../../dao/usersDAO.js"
import jwt from"jsonwebtoken"

export default class  UsersController {
 

  static async apiGetUsers(req, res, next) {
    const usersPerPage = req.query.usersPerPage ? parseInt(req.query.usersPerPage, 10) : 20
    const page = req.query.page ? parseInt(req.query.page, 10) : 0

    let filters = {}
    if (req.query.username) {
      filters.username = req.query.username
    } else if (req.query.password) {
      filters.password = req.query.password
    } else if (req.query.phone) {
      filters.phone = req.query.phone
    } else if (req.query.mail) {
      filters.mail = req.query.mail
    }

    const { usersList, totalNumUsers } = await UsersDAO.getUsers({
      filters,
      page,
      usersPerPage,
    })

    let response = {
      users: usersList,
      page: page,
      filters: filters,
      entries_per_page: usersPerPage,
      total_results: totalNumUsers,
    }
    res.json(response)
  }


  static async apiPostUser(req, res, next) {
    try {
      const userID = req.body.user_id
      const username = req.body.username
      const password = req.body.password
      const phone = req.body.phone
      const mail = req.body.mail
      const UsersResponse = await UsersDAO.addUser(
        userID,
        username,
        password,
        phone,
        mail,
      )
      if(UsersResponse) {
        res.json({ status: "success" })
      }
    } catch (e) {
      res.status(500).json({ error: e.message })
    }
  }

  static async apiCheckAuthentification(req, res, next) {
    try {
      const username = req.body.username
      const password = req.body.password
      const UsersResponse = await UsersDAO.checkAuthentification(
        username,
        password
      )
      if(UsersResponse) {
        res.json({ status: "success" })
      } else 
        res.json({ status: "failed" })
    } catch (e) {
      res.status(500).json({ error: e.message })
    }

  }
}