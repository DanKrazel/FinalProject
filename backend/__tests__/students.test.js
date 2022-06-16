import app from "../server.js";
import request from "supertest";
// import initializeMongoServer from "../mongoConfigTesting.js"
import clientPromise from "../index.js"

describe('get', () => {

  beforeAll(async () => {
    clientPromise;
  });

  afterAll(async () => {
    await clientPromise.close();
  });

  test("return all students", done => {
    request(app)
      .get("/api/v1/students")
      .expect("Content-Type", /json/)
      //.expect({ result: 'Hello, World!' })
      .expect(200, done);
  });
  
  test("return all students name", done => {
    request(app)
      .get("/api/v1/students/names")
      .expect("Content-Type", /json/)
      //.expect({ result: 'Hello, World!' })
      .expect(200, done)
  });

  test("get courses with details students", done => {
    request(app)
      .get("/api/v1/students/getCoursesStudent/626d8e82c32629a2169e45aa")
      .expect("Content-Type", /json/)
      .expect()
      //.expect({ result: 'Hello, World!' })
      .expect(200, done)
  });
  
  // test("testing route works", done => {
  //   request(app)
  //     .post("/api/v1/students")
  //     .type("form")
  //     .send({ item: "hey" })
  //     .then(() => {
  //       request(app)
  //         .get("/test")
  //         .expect({ array: ["hey"] }, done);
  //     });
  // });
})
