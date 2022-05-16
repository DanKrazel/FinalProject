import request from "supertest";
// import { expect } from "chai";
import 'dotenv/config'
//import UsersDAO from "../../dao/usersDAO.js"
//import UsersCtrl from "../../api/controllers/users.controller.js"
import MongoClient from "mongodb"
import mongodb from "mongodb"
import express from "express"

//import app from "../app.js"

const baseUrl = "localhost:5000/api/v1/students"

describe('GET /user', () => {
  it('responds with json', async() => {
    const res = await request(baseUrl).get('/user');
    console.log("app", res)
    expect(res.statusCode).toEqual(200)
  });
});

// describe("POST users",function(){
//     var tempUser = {
//         user_id : "364826677",
//         username : "test",
//         password : "12345",
//         mail : "derts@gmail.com",
//         role: "Admin"
//     }
//     test("responds with json users", async(done) => {
//       await request(app)
//         .post("/signup")
//         .send(tempUser)
//         .set('Accept', 'application/json')
//         .expect('Content-Type', /json/)
//         .expect(200)
//         .end(function(err, res) {
//           if (err) return done(err);
//           return done();
//         });
//     });
  
//     test("shouldn't accept the username that already exists in the database", async(done) => {
//       request(app)
//         .post("/signup")
//         .send(tempUser)
//         .expect(400)
//         .then((res) => {
//           expect(res.body.message).to.be.eql("Username is already in use");
//           done();
//         })
//         .catch((err) => done(err));
//     });
//   });


// describe('user service', () => {
//   test('should return status 200', async() => {
//     const response = await UsersCtrl.apiGetUsers();
//     expect(response).equal(200);
//   });
// })




// export default class UsersTestDAO {
//   static async injectDB(conn) {
//     if (usersTest) {
//       return
//     }
//     try {
//       usersTest = await conn.db(process.env.MONGO_URI_TEST).collection("usersTest")
//     } catch (e) {
//       console.error(
//         `Unable to establish a collection handle in usersTest: ${e}`,
//       )
//     }
//   }
// }

// before(function (done) {
//     this.timeout(3000);
//     setTimeout(done, 2000);
//   });


// describe('insert', () => {
//   let connection;
//   let db;

//   beforeAll(async () => {
//     connection = await MongoClient.connect(process.env.STUDREVIEWS_DB_URI, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });
//     db = await connection.db();
//   });

//   afterAll(async () => {
//     await connection.close();
//   });

//   it('should insert a doc into collection', async () => {
//     const users = db.collection('users');

//     const mockUser = {_id: '15285', name: 'John'};
//     await users.insertOne(mockUser);

//     const insertedUser = await users.findOne({_id: '15285'});
//     expect(insertedUser).toEqual(mockUser);
//   });
// });



