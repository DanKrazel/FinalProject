import UsersDAO from "../../dao/usersDAO.js"
import jwt from"jsonwebtoken"
import bcrypt from "bcryptjs"
import 'dotenv/config'
import mongodb from "mongodb"
import emailjs from '@emailjs/browser';
import config from "../../config/auth.config.js"


const ObjectId = mongodb.ObjectId



const JWT_SECRET = process.env.JWT


export default class UsersController {

  static async apiGetUsers(req, res, next) {
    const usersPerPage = req.query.usersPerPage ? parseInt(req.query.usersPerPage, 10) : 20
    const page = req.query.page ? parseInt(req.query.page, 10) : 0

    let filters = {}
    if (req.query._id) {
      filters._id = ObjectId(req.query._id)
    } else if (req.query.username) {
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

  static async apiDeleteUser(req, res, next) {
    try {
      let filters = {}
      if (req.query._id) {
        filters._id = ObjectId(req.query._id)
      } else if (req.query.username) {
        filters.username = req.query.username
      } else if (req.query.mail) {
        filters.mail = req.query.mail
      }
      console.log(filters)
      const response = await UsersDAO.deleteUser(filters)
  
      res.json(response)
    } catch (e) {
      res.status(500).json({ error: e.message })
    }

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


  static async apiCheckDuplicateUsernameOrMail(req, res, next){
    try {
      const username = req.body.username
      const mail = req.body.mail
      //const mail = req.body.mail
      const UsernameResponse = await UsersDAO.checkDuplicateUsername(
        username
      )

      const MailResponse = await UsersDAO.checkDuplicateEmail(
        mail
      )

      console.log(UsernameResponse)
      console.log(MailResponse)
      if(UsernameResponse || MailResponse) {
        res.status(400).send({error:'Username or mail already exist !'})
      }
      else{
        next();
      }
      
    } catch (e) {
      res.status(500).json({ error: e.message })
    }
  }

  static async apiSignup (req, res, next) {
    try {
      const Roles = ["Admin", "Secretariat", "Professor"]
      const user_id = req.body.user_id
      const username = req.body.username
      const password = await bcrypt.hash(req.body.password,10)
      const mail = req.body.mail
      const role = req.body.role
      if (role) {
        if (!Roles.includes(role)) {
          res.status(400).send({
            error: `Failed! Role ${role} does not exist!`
          });
            return;
          }
        }
      const UsersResponse = await UsersDAO.signUp(
        user_id,
        username,
        password,
        mail,
        role
      )
      console.log(UsersResponse)
      if(UsersResponse ) {
        res.status(200).json({ status: "success" })
      }
    } catch (e) {
      res.status(500).json({ error: e.message })
    }
    
  }

  static async apiLogin (req, res, next) {
    try {
      const username = req.body.username;
      const password = req.body.password
      // we made a function to verify our user login
      console.log("testapi")
      const response = await UsersDAO.verifyUserLogin(username,password);
      const refreshToken = await UsersDAO.createRefreshToken(response.id)
      console.log('refreshToken', refreshToken)
      console.log(response)
      if(response.status == "success"){
          // storing our JWT web token as a cookie in our browser
          //res.cookie('token',response.data,{ maxAge: 2 * 60 * 60 * 1000, httpOnly: true });  // maxAge: 2 hours

          //res.json({ status: "success" })
          res.status(200).send({ status: response.status,
                                 id: response.id,
                                 user_id: response.user_id,
                                 username: response.username,
                                 mail: response.mail,
                                 role: response.role,
                                 accessToken: response.accessToken,
                                 refreshToken: refreshToken.token
                                  });
      }else{
        res.status(200).send({ status: "username or password not found" });
      }
    } catch (e) {
      res.status(500).json({ error: e })
    }

  }

  static async apiRefreshToken (req, res, next){
    try {
      const requestToken  = req.body.refreshToken;
      if (requestToken == null) {
        return res.status(403).json({ message: "Refresh Token is required!" });
      }
      let refreshToken = await UsersDAO.getRefreshTokens(requestToken)
      if (!refreshToken) {
        res.status(403).json({ message: "Your session was expired. Please make a new login request" });
        return;
      }
      if (refreshToken.expiryDate < new Date().getTime()) {
        const deleteResponse = await UsersDAO.deleteRefreshTokenByID(refreshToken._id);       
        res.status(403).json({
          message: "Your session was expired. Please make a new login request",
        });
        return;
      }

      let newAccessToken = jwt.sign({ id: refreshToken.user }, JWT_SECRET, {
        expiresIn: config.jwtExpiration,
      });
      return res.status(200).json({
        accessToken: newAccessToken,
        refreshToken: refreshToken.token,
      });
    } catch (err) {
      return res.status(500).send({ error: err.message });
    }
  }

  static async apiVerifyToken(req, res, next) {
    try {
      const { TokenExpiredError } = jwt;
      const catchError = (err, res) => {
        if (err instanceof TokenExpiredError) {
          return res.status(401).send({ message: "Unauthorized! Access Token was expired!" });
        }
        return res.status(401).send({ message: "Unauthorized!" });
      }
      let token = req.headers["x-access-token"];
      if (!token) {
        return res.status(403).send({ message: "You have to login" });
      }
      

      //console.log("decoded")
      jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
          return catchError(err, res);
        }
        req.userId = decoded.id;
        next();
      });
    } catch (e) {
      console.log('api',e)
      res.status(500).json({ error: e.message })
    }
  }

  static async apiIsAdmin(req, res, next){
    try {
      
      const response = await UsersDAO.findUser(req.userId)
      console.log("response", response)
      if(response.role == 'Admin'){
        next();
        return;
      }
      res.status(403).send({ message: "Require Admin Role!" });
    } catch (e) {
      res.status(500).json({ error: e.message})
    }
  }

  static async apiIsSecretariat(req, res, next){
    try {
      const response = await UsersDAO.findUser(req.userId)
      console.log('testSecretariat',req.userId)
      //console.log('testSecretariat',response)
      if(response.role == 'Secretariat'){
        next();
        return;
      }
      return res.status(403).send({ message: "Require Secretariat Role!" });
    } catch (e) {
      return res.status(500).json({ error: e.message })
    }
  }

  static async apiIsProfessor(req, res, next){
    try {
      const response = await UsersDAO.findUser(req.userId)
      console.log("response", response)
      if(response.role == 'Professor'){
        next();
        return;
      }
      return res.status(403).send({ message: "Require Professor Role!" });
    } catch (e) {
      res.status(500).json({ error: e })
    }
  }

  static async apiAdminBoard(req, res, next) {
    try {
      console.log("testAdminBoard")
      res.status(200).send("Admin Content.");
    } catch (e) {
      res.status(500).json({ error: e })
    }
  
  };

  static async apiSecretariatBoard(req, res, next) {
    try {
      return res.status(200).send("Secretariat Content.");
    } catch (e) {
      res.status(500).json({ error: e })
    }
  
  };

  static async apiProfessorBoard(req, res, next) {
    try {
      res.status(200).send("Professor Content.");
    } catch (e) {
      res.status(500).json({ error: e })
    }
  
  };

  static async apiFunctionHeader(req, res, next) {
  try {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  } catch (e) {
    res.status(500).json({ error: e })
  }

  };

  static async apiDeleteUserByID(req, res, next) {
    try {
      const userID = req.query.id
      console.log(userID)

      const UsersResponse = await UsersDAO.deleteUserbyID(
        userID
      )
      console.log(UsersResponse)
      res.json({ status: "success" })
    } catch (e) {
      res.status(500).json({ error: e.message })
    }
  }



  



}