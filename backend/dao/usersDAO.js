import mongodb from "mongodb"
const ObjectId = mongodb.ObjectId
let users

export default class userDAO {
  static async injectDB(conn) {
    if (users) {
      return
    }
    try {
      users = await conn.db(process.env.RESTREVIEWS_NS).collection("users")
    } catch (e) {
      console.error(
        `Unable to establish a collection handle in usersDAO: ${e}`,
      )
    }
  }

  static async getUsers({
    filters = null,
    page = 0,
    usersPerPage = 20,
  } = {}) {
    let query
    if (filters) {
       if ("username" in filters) {
        query = { "username": { $eq: filters["username"] } }
      } else if ("password" in filters) {
        query = { "password": { $eq: filters["password"] } } 
      } else if ("phone" in filters) {
        query = { "phone": { $eq: filters["phone"] } }
      } else if ("mail" in filters) {
        query = { "mail": { $eq: filters["mail"] } }
      }
    }

    let cursor
    
    try {
      cursor = await users.find(query)
    } catch (e) {
      console.error(`Unable to issue find command, ${e}`)
      return { usersList: [], totalNumUsersList: 0 }
    }

    const displayCursor = cursor.limit(usersPerPage).skip(usersPerPage * page)

    try {
      const usersList = await displayCursor.toArray()
      const totalNumUsers = await users.countDocuments(query)

      return { usersList, totalNumUsers }
    } catch (e) {
      console.error(
        `Unable to convert cursor to array or problem counting documents, ${e}`,
      )
      return { usersList: [], totalNumUsers: 0 }
    }
  }

  static async addUser (userID, username, password, phone, mail) {
    try {
      const userDoc = { 
          user_id: userID,
          username: username,
          password: password,
          phone: phone,
          mail: mail,}
      return await users.insertOne(userDoc)
    } catch (e) {
      console.error(`Unable to post user: ${e}`)
      return { error: e }
    }
  }

  static async updateUser (userID, username, password, phone, mail) {
    try {
      const userDoc = {
          user_id: userID,
          username: username,
          password: password,
          phone: phone,
          mail: mail,}

      return await users.updateOne(userDoc)
    } catch (e) {
      console.error(`Unable to update user: ${e}`)
      return { error: e }
    }
  }

  static async deleteUser (userID, username, password, phone, mail) {
    try {
      const userDoc = { 
          user_id: userID,
          username: username,
          password: password,
          phone: phone,
          mail: mail,}

      return await users.deleteOne(userDoc)
    } catch (e) {
      console.error(`Unable to post user: ${e}`)
      return { error: e }
    }
  }

  static async checkAuthentification (username, password) {
    try {
      const userDoc = { 
        username: username,
        password: password}
      return await users.findOne(userDoc)
    } catch (e) {
      console.error(`Unable to find user: ${e}`)
      return { error: e }
    }
  }
}
