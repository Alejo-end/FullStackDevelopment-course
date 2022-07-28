const Blog = require('../models/blog')
const middleware = require('../utils/middleware')
const blogsRouter = require('express').Router()
// eslint-disable-next-line no-unused-vars
const jwt = require('jsonwebtoken')
require('express-async-errors')

//GET
blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({}).populate('person', { username: 1, name: 1 })
    response.json(blogs)
})

//POST
blogsRouter.post('/', middleware.personExtractor, async (request, response) => {
    const person = request.person

    const blog = new Blog({
        title: request.body.title,
        author: request.body.author,
        url: request.body.url,
        likes: request.body.likes || 0,
        person: person
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
    let retBlog = JSON.parse(JSON.stringify(newBlog))
    retBlog['person'] = body.person
    response.json(retBlog)
})

//DELETE
blogsRouter.delete('/:id', middleware.personExtractor, async (request, response) => {

    const person = request.person
    const blog = await Blog.findById(request.params.id)
    if (blog.person.toString() !== person._id.toString()) {
        return response.status(401).json({ error: 'token missing or invalid' })
    }
    await Blog.findByIdAndRemove(request.params.id)
    response.status(204).end()
})

module.exports = blogsRouter