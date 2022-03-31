import mongodb from "mongodb"
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"
import 'dotenv/config'



const JWT_SECRET = process.env.jwt
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
      } else if ("role" in filters) {
        query = { "role": { $eq: filters["role"] } }
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
          mail: mail,}
      return await users.insertOne(userDoc)
    } catch (e) {
      console.error(`Unable to post user: ${e}`)
      return { error: e }
    }
  }

  static async updateUser (userID, username, password, mail) {
    try {
      const userDoc = {
          user_id: userID,
          username: username,
          password: password,
          mail: mail,}

      return await users.updateOne(userDoc)
    } catch (e) {
      console.error(`Unable to update user: ${e}`)
      return { error: e }
    }
  }

  static async deleteUser (userID, username, password, mail) {
    try {
      const userDoc = { 
          user_id: userID,
          username: username,
          password: password,
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

  static async checkDuplicateUsername (username) {
    // Username
    try {
      const userDoc = {
        username: username,
      }
      return await users.findOne(userDoc)
    } catch (e) {
      console.error(`Unable to check username: ${e}`)
      return { error: e }
    }
  };

  static async checkDuplicateEmail (mail) {
    // Mail
    try {
      const userDoc = {
        mail: mail,
      }
      return await users.findOne(userDoc)
    } catch (e) {
      console.error(`Unable to check mail: ${e}`)
      return { error: e }
    }
  };


  static async signUp (user_id, username, password, mail, role){
    try {
      const userDoc = {
        user_id: user_id,
        username: username,
        password: password,
        mail: mail,
        role: role
      }
       return await users.insertOne(userDoc)
    } catch (error) {
      console.error(`Unable to insert user: ${e}`)
      return { error: e }
    }

  }

  static async verifyUserLogin (username,password) {
    try {
        const userDoc = {
          username: username,
        }
        const user = await users.findOne(userDoc)
        if(user && await bcrypt.compare(password,user.password)){
            // creating a JWT token
            var token = jwt.sign({id:user._id,username:user.username},JWT_SECRET,{ expiresIn: '2h'})
            return {status:'success',
                    id: user.user_id,
                    username: user.username,
                    mail: user.mail,
                    role: user.role,
                    accessToken: token}
        }
        return {status:"failed"}

    } catch (e) {
        console.log(e);
        return { error : e }
    }
}

  static async findUser(userID){
    try {
      const userDoc = {
        _id: ObjectId(userID)
      }
      return await users.findOne(userDoc)
    } catch (error) {
      console.error(`Unable to check user role: ${e}`)
      return { error: e }
    }
  }

  // static async verifyToken(token){
  //   try {
  //     const decoded = jwt.verify(token,JWT_SECRET);
  //     return decoded;
  //   } catch (error) {
  //     console.log(JSON.stringify(error),"error");
  //     return false;
  //   }
  // }


}
