const jwt = require('jsonwebtoken')
const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
    response.json(blogs)
    console.log(blogs)
})

blogsRouter.post('/', async (request, response) => {
    const decodedToken = decodeToken(request.token, process.env.SECRET)
    if (!decodedToken || !decodedToken.id) {
        return response.status(401).json({ error: 'token missing or invalid' })
    }
    const user = await User.findById(decodedToken.id)
    const body = request.body
    body.user = user.id

    const blog = new Blog(body)
    const savedBlog = await blog.save()

    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()
    response.status(201).json(blog)
})

blogsRouter.put('/:id', async (request, response, next) => {
    const body = request.body

    const blog = {
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes
    }
    const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
    response.json(updatedBlog)
})

blogsRouter.delete('/:id', async (request, response, next) => {
    const decodedToken = decodeToken(request.token, process.env.SECRET)
    if (!decodedToken || !decodedToken.id) {
        return response.status(401).json({ error: 'token missing or invalid' })
    }
    const user = await User.findById(decodedToken.id)
    const blog = await Blog.findById(request.params.id)

    if (blog.user.toString() !== user.id.toString()) {
        return response.status(401).json({ error: 'token is invalid' })
    }

    await Blog.findByIdAndRemove(request.params.id)
    response.status(204).end()
})

const decodeToken = (token, secret) =>  jwt.verify(token, secret)

module.exports = blogsRouter