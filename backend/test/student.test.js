import app, { get } from "../server.js";
import request, { get as _get } from "supertest";

get('/user', function(req, res) {
    res.status(200).json({ name: 'john' });
  });
  
request(app)
    .get('/user')
    .expect('Content-Type', /json/)
    .expect('Content-Length', '15')
    .expect(200)
    .end(function(err, res) {
      if (err) throw err;
    });

it('gets the test endpoint', async done => {
    const response = await _get('/test')
  
    expect(response.status).toBe(200)
    expect(response.body.message).toBe('pass!')
    done()
  })

// describe('Get courses by student', () => {

//     it.only('Should throw an error when ID doesnt exit', async () => {

//         StudentsDAO.getCoursesByStudentID = jest.fn().mockReturnValueOnce({
//             id: "843NDKD30"
//         })

//         StudentsDAO.prototype.save = jest.fn().mockImplementation(() => {});

//         await expect(StudentCtrl.apiGetCoursesStudentByID("843NDKD30")).rejects.toThrowError();


//     })

// })
// test('Get course by student ID, if the student doesnt exist return 404 status code', async () => {
//     await request(app)
//         .get('/getCoursesStudent/:id')
//         .send({
//             id: '843NDKD30',
//         })
//         .expect(404)
// })