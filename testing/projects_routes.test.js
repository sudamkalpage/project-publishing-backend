const request = require('supertest')
const app = require('../app')
 
describe(`GET find all`, () => {
    describe("given a username and password", () => {
  
      test("should respond with a 200 status code", async () => {
        const response = await request(app).get("/projects/find/all").send()
        expect(response.statusCode).toBe(200)
      })
      test("should specify json in the content type header", async () => {
        const response = await request(app).get("/projects/find/all").send()
        expect(response.headers['content-type']).toEqual(expect.stringContaining("json"))
      })
    })
  })

  describe(`GET find project`, () => {
    describe("given a slug", () => {
  
      test("should respond with a 200 status code", async () => {
        const response = await request(app).get("/projects/find/gas-mate-5").send()
        expect(response.statusCode).toBe(200)
      })
      test("should specify json in the content type header", async () => {
        const response = await request(app).get("/projects/find/gas-mate-5").send()
        expect(response.headers['content-type']).toEqual(expect.stringContaining("json"))
      })
      test("response has userId", async () => {
        const response = await request(app).get("/projects/find/gas-mate-5").send()
        expect(response.body._id).toBeDefined()
    })
    test("should return as a bad request since slug is incorrect", async () => {
        const response = await request(app).get("/projects/find/gas-mate-").send()
        expect(response.statusCode).toBe(400)
      })
  
  })
})

describe(`GET followers`, () => {
    describe("given a slug", () => {
  
      test("should respond with a 200 status code", async () => {
        const response = await request(app).get("/projects/followers/gas-mate-1").send()
        expect(response.statusCode).toBe(200)
      })
      test("should specify json in the content type header", async () => {
        const response = await request(app).get("/projects/followers/gas-mate-1").send()
        expect(response.headers['content-type']).toEqual(expect.stringContaining("json"))
      })
      test("should return as a bad request since slug is incorrect", async () => {
        const response = await request(app).get("/projects/followers/gas-mate-").send()
        expect(response.statusCode).toBe(400)
      })
  })
})