const Blog = require('../models/blog')
const blogsRouter = require('express').Router()
require('express-async-errors')


//GET
blogsRouter.get('/', (request, response) => {
    Blog
        .find({})
        .then(blogs => {
            response.json(blogs)
        })
})


//POST
blogsRouter.post('/', (request, response) => {
    const blog = new Blog({
        title: request.body.title,
        author: request.body.author,
        url: request.body.url,
        likes: request.body.likes || 0,
    })

    blog
        .save()
        .then(result => {
            response.status(201).json(result)
        })
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