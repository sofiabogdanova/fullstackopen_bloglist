const blogs = require('./data')

const Blog = require('../models/blog')

const initialBlogs = blogs.slice()

const nonExistingId = async () => {
    const blog = new Blog({ title: 'willremovethissoon', author: 'some author' })
    await blog.save()
    await blog.remove()

    return blog._id.toString()
}

const blogsInDb = async () => {
    const blogs = await Blog.find({})
    return blogs.map(blog => blog.toJSON())
}

const blogById = async (id) => {
    const blog = await Blog.findById(id)
    return blog.toJSON()
}
module.exports = {
    initialBlogs, nonExistingId, blogsInDb, blogById
}