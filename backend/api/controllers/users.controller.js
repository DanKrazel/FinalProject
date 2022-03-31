import UsersDAO from "../../dao/usersDAO.js"
import jwt from"jsonwebtoken"
import bcrypt from "bcryptjs"
import 'dotenv/config'



const JWT_SECRET = process.env.jwt


export default class UsersController {

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
        res.json({ status: "success" })
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
      console.log(response)
      if(response.status == "success"){
          // storing our JWT web token as a cookie in our browser
          //res.cookie('token',response.data,{ maxAge: 2 * 60 * 60 * 1000, httpOnly: true });  // maxAge: 2 hours

          //res.json({ status: "success" })
          res.status(200).send({ status: response.status,
                                 id: response.id,
                                 username: response.username,
                                 mail: response.mail,
                                 role: response.role,
                                 accessToken: response.accessToken
                                  });
      }else{
        res.status(200).send({ status: "username or password not found" });
      }
    } catch (e) {
      res.status(500).json({ error: e })
    }

  }

  static async apiVerifyToken(req, res, next) {
    try {
      let token = req.headers["x-access-token"];
      if (!token) {
        return res.status(403).send({ message: "No token provided!" });
      }
      console.log("access token", token)

      //console.log("decoded")
      const decoded = jwt.verify(token,JWT_SECRET);
      console.log("decoded")
      console.log(decoded)
      if(!decoded){
        return res.status(401).send({ message: "Unauthorized!" });
      }
      req.userId = decoded.id;
      next();
    } catch (e) {
      res.status(500).json({ error: e })
    }
  }

  static async apiIsAdmin(req, res, next){
    try {
      console.log("testIsAdmin")
      const response = await UsersDAO.findUser(req.userId)
      console.log("response", response)
      if(response.role == 'Admin'){
        next();
        return;
      }
      res.status(403).send({ message: "Require Admin Role!" });
      return;
    } catch (e) {
      res.status(500).json({ error: e })
    }
  }

  static async apiIsSecretariat(req, res, next){
    try {
      const response = await UsersDAO.findUser(req.userId)
      if(response.role == 'Secretariat'){
        next();
        return;
      }
      res.status(403).send({ message: "Require Secretariat Role!" });
      return;
    } catch (e) {
      res.status(500).json({ error: e })
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
      res.status(403).send({ message: "Require Professor Role!" });
      return;
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
      res.status(200).send("Secretariat Content.");
    } catch (error) {
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



  



}