const request = require('supertest')
const app = require('../app')
 
describe(`POST signup`, () => {
    describe("given a username, email and password", () => {
  
      test("should respond with a 200 status code", async () => {
        const response = await request(app).post("/users/signup").send({
          username: "username",
          email: "email",
          password: "password"
        })
        expect(response.statusCode).toBe(200)
      })
      test("should specify json in the content type header", async () => {
        const response = await request(app).post("/users/signup").send({
          username: "username",
          password: "password"
        })
        expect(response.headers['content-type']).toEqual(expect.stringContaining("json"))
      })
      test("response has userId", async () => {
        const response = await request(app).post("/users/signup").send({
          username: "username",
          password: "password"
        })
        expect(response.body._id).toBeDefined()
      })
    })  
  })

 
describe(`GET find all`, () => {
    describe("given a username and password", () => {
  
      test("should respond with a 200 status code", async () => {
        const response = await request(app).get("/users/find/all").send()
        expect(response.statusCode).toBe(200)
      })
      test("should specify json in the content type header", async () => {
        const response = await request(app).get("/users/find/all").send()
        expect(response.headers['content-type']).toEqual(expect.stringContaining("json"))
      })
    })
  
    // describe("when the username and password is missing", () => {
    //   test("should respond with a status code of 400", async () => {
    //     const bodyData = [
    //       {username: "username"},
    //       {password: "password"},
    //       {}
    //     ]
    //     for (const body of bodyData) {
    //       const response = await request(app).post("/users").send(body)
    //       expect(response.statusCode).toBe(400)
    //     }
    //   })
    // })
  
  })