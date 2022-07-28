const mongoose = require("mongoose")
const supertest = require("supertest")
const app = require("../app")
const blogs = require("./blog.test")
const Blog = require("../models/blog")
const Person = require("../models/person")
const helper = require('./test_helper')

const api = supertest(app)
const getToken = async () => {
    const login = (await helper.initialUsers)[0]

    await api
        .post('/api/person')
        .send(login)
        .expect(201)

    const response = await api
        .get('/api/auth')
        .send(login)
    
    return response.body.token
}

const oneBlog = {
    title: "React patterns 2",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
}

const putBlog = {
    title: "React patterns 3",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 16,
}

const oneBlogNoLikes = {
    title: "React patterns 2",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
}

const badBlog = {
    "author": "Alejandro",
    "likes": 2
}

beforeEach(async () => { //similar to the tutorial of part 4 "Testing the backend"
    await Blog.deleteMany({})
    await Person.deleteMany({})
    await Blog.insertMany(helper.initialBlogs)
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
        const token = await getToken()
        await api.post('/api/blogs').set("Authorization", `Bearer ${token}`).send(oneBlog).expect(201).expect('Content-Type', /application\/json/) 
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
        const token = await getToken()
        await api.post('/api/blogs').set("Authorization", `Bearer ${token}`).send(oneBlogNoLikes).expect(201).expect('Content-Type', /application\/json/) 
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

    test("check that a bad post generates a bad request 400", () => {
        const token = getToken()
        api.post("/api/blogs").set("Authorization", `Bearer ${token}`).send(badBlog).expect(400)
    })
})

describe('PUT blog', () => {
    test('Updated blog likes successfully', async () => { //as seen in tutorial
        const reply = await api.get('/api/blogs')
        const id = reply.body[0].id
        const token = await getToken()
        await api.put(`/api/blogs/${id}`).set("Authorization", `Bearer ${token}`).send(putBlog)
        const reply2 = await api.get('/api/blogs')

        const titles = reply2.body.map(blog => blog.title) //checks the content with updated likes
        const authors = reply2.body.map(blog => blog.author)
        const urls = reply2.body.map(blog => blog.url)
        const likesAll = reply2.body.map(blog => blog.likes)
        expect(titles).toContain('React patterns 3')
        expect(authors).toContain('Michael Chan')
        expect(urls).toContain('https://reactpatterns.com/')
        expect(likesAll).toContain(16)
    })
})

describe('DELETE method', () => {
    test('Blog deleted', async () => { 
        const reply = await api.get('/api/blogs')
        const id = reply.body[0].id
        await api.delete(`/api/blogs/${id}`).expect(204)
        const reply2 = await api.get('/api/blogs')
        expect(reply2.body).toHaveLength(blogs.length - 1) 
    })
})

test("unauthorized access to blog POST method without token", async () => {

    const newBlog = {
        "author": "alejo",
        "title": "bad blog",
        "url": "badblog"
    }

    await api
        .post("/api/blogs")
        .set("Authorization", "Bearer ")
        .send(newBlog)
        .expect(401)
})

afterAll(() => {
    mongoose.connection.close()
}) 