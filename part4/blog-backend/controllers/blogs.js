const Blog = require('../models/blog')
const Person = require('../models/person')
const jwt = require('jsonwebtoken')
const blogsRouter = require('express').Router()
require('express-async-errors')


const getTokenFrom = request => {   //given in tutorial, chapter 4, token authentication
    const authorization = request.get('authorization')
    if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
        return authorization.substring(7)
    }
    return null
}


//GET
blogsRouter.get('/', (request, response) => {
    Blog
        .find({})
        .populate('person', { username: 1, name: 1 })
        .then(blogs => {
            response.json(blogs)
        })
})


//POST
blogsRouter.post('/', async (request, response) => {
    const token = getTokenFrom(request) //given in tutorial, chapter 4, token authentication
    const decodedToken = jwt.verify(token, process.env.SECRET)
    if (!decodedToken.id) {
        return response.status(401).json({ error: 'token missing or invalid' })
    }
    const person = await Person.findById(decodedToken.id)

    const blog = new Blog({
        title: request.body.title,
        author: request.body.author,
        url: request.body.url,
        likes: request.body.likes || 0,
        person: person._id
    })
    const result = await blog.save()
    person.blogs = person.blogs.concat(result._id)
    await person.save()
    response.status(201).json(result)
})

//PUT
blogsRouter.put('/:id', async (request, response) => {
    const body = request.body
    const updatedBlog = {
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes
    }

    const newBlog = await Blog.findByIdAndUpdate(request.params.id, updatedBlog, { new: true })
    response.json(newBlog)
})

//DELETE
blogsRouter.delete('/:id', async (request, response) => {
    await Blog.findByIdAndRemove(request.params.id)
    response.status(204).end()
})

module.exports = blogsRouter