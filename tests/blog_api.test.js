const mongoose = require('mongoose')
const helper = require('./test_helper')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)

const Blog = require('../models/blog')


beforeEach(async () => {
    await Blog.deleteMany({})

    const blogObjects = helper.initialBlogs
        .map(blog => new Blog(blog))
    const promiseArray = blogObjects.map(blog => blog.save())
    await Promise.all(promiseArray)
})

test('blogs should be returned as json', async () => {
    await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
})

test('unique identifier property of the blog posts should be named id', async () => {
    const blogs = await helper.blogsInDb()
    blogs.forEach(b => expect(b.id).toBeDefined())
})

test('all blogs should be returned', async () => {
    const response = await api.get('/api/blogs')

    expect(response.body).toHaveLength(helper.initialBlogs.length)
})

test('a valid blog should be added', async () => {
    const newBlog = {
        title: 'async/await simplifies making async calls',
        author: 'some author',
        url: 'some url'
    }

    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

    const contents = blogsAtEnd.map(n => n.title)
    expect(contents).toContain(
        'async/await simplifies making async calls'
    )
})

test('default value of likes should be 0', async () => {
    const newBlog = {
        title: 'blog with 0 likes',
        author: '0 likes author',
        url: 'some url'
    }

    const res = await api
        .post('/api/blogs')
        .send(newBlog)

    const blogFromDb = await helper.blogById(res.body.id)
    expect(blogFromDb.likes).toBe(0)
})

test('should respond with 400 Bad Request if title and url are missing', async () => {
    const blogWithoutTitle = {
        author: 'author',
        url: 'some url'
    }

    const blogWithoutUrl = {
        title: 'title',
        author: 'author'
    }

    await api
        .post('/api/blogs')
        .send(blogWithoutTitle)
        .expect(400)

    await api
        .post('/api/blogs')
        .send(blogWithoutUrl)
        .expect(400)
})

afterAll(() => {
    mongoose.connection.close()
})