const mongoose = require("mongoose")
const supertest = require("supertest")
const app = require("../app")
const blogs = require("./blog.test")
const Blog = require("../models/blog")

const api = supertest(app)

beforeEach(async () => { //similar to the tutorial of part 4 "Testing the backend"
    await Blog.deleteMany({})
    const testBlogs = blogs.map(blog => new Blog(blog)) 
    const savedBlogs = testBlogs.map(blog => blog.save()) 
    await Promise.all(savedBlogs) 

})

describe('GET method', () => {
    test("get blogs from api/blogs", async () => {
        await api
            .get("/api/blogs")
            .expect(200)
            .expect("Content-Type", /application\/json/)
    })
    test('the correct amount of blogs are returned', async () => {
        const response = await api.get('/api/blogs')
        expect(response.body.length).toBe(blogs.length)
    })    
})

afterAll(() => {
    mongoose.connection.close()
}) 