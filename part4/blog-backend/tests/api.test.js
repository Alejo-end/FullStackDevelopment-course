const mongoose = require("mongoose")
const supertest = require("supertest")
const app = require("../app")
const blogs = require("./blog.test")
const Blog = require("../models/blog")

const api = supertest(app)

const oneBlog = {
    title: "React patterns 2",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
}

const oneBlogNoLikes = {
    title: "React patterns 2",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
}

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
    test('id of blogs', async () => {
        const response = await api.get('/api/blogs')
        expect(response.body[0].id).toBeDefined()
    })
})

describe('POST method', () => {
    test('Check if blog can be added', async () => { 

        await api.post('/api/blogs').send(oneBlog).expect(201).expect('Content-Type', /application\/json/) 
        const reply = await api.get('/api/blogs')
        expect(reply.body).toHaveLength(blogs.length + 1) 

        const titles = reply.body.map(blog => blog.title) 
        const authors = reply.body.map(blog => blog.author)
        const urls = reply.body.map(blog => blog.url)
        const likes = reply.body.map(blog => blog.likes)

        expect(titles).toContain("React patterns 2")
        expect(authors).toContain("Michael Chan")
        expect(urls).toContain("https://reactpatterns.com/")
        expect(likes).toContain(7)
    })
    test('Check if blog with no likes gets 0 by default', async () => { 

        await api.post('/api/blogs').send(oneBlogNoLikes).expect(201).expect('Content-Type', /application\/json/) 
        const reply = await api.get('/api/blogs')
        expect(reply.body).toHaveLength(blogs.length + 1) 

        const titles = reply.body.map(blog => blog.title) 
        const authors = reply.body.map(blog => blog.author)
        const urls = reply.body.map(blog => blog.url)
        const likes = reply.body.map(blog => blog.likes)

        expect(titles).toContain("React patterns 2")
        expect(authors).toContain("Michael Chan")
        expect(urls).toContain("https://reactpatterns.com/")
        expect(likes).toContain(0)
    })

    test("check that a bad post generates a bad request 400", async () => {
        const badBlog = {
            "author": "Alejandro",
            "likes": 2
        }
        await api.post("/api/blogs").send(badBlog).expect(400)
    })
})

afterAll(() => {
    mongoose.connection.close()
}) 