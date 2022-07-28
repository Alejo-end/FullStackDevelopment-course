const Blog = require("../models/blog")
const Person = require("../models/person")

const initialBlogs = [
    {
        "author": "Robert C. Martin",
        "title": "Clean Code: A Handbook of Agile Software Craftsmanship",
        "url": "cleaner-code",
        "likes": 20

    },
    {
        "author": "Diego Ruzzarin",
        "title": "La religion es el opio del pueblo",
        "url": "somewhere",
        "likes": 0
    
    }
    
]

const initialUsers = [
    {
        username: "alejoend",
        name: "Alejo",
        password: "pass123"
    }
]

const blogsInDb = async () => {
    const blogs = await Blog.find({})
    return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
    const users = await Person.find({})
    return users.map(user => user.toJSON())
}


module.exports = {
    initialBlogs,initialUsers, blogsInDb, usersInDb
}