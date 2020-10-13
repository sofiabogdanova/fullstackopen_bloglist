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

describe('when there is initially some blogs saved', () => {
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
})

describe('creating of a new blog', () => {
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
})

describe('deletion of a blog', () => {
    test('succeeds with status code 204 if id is valid', async () => {
        const blogsAtStart = await helper.blogsInDb()
        const blogToDelete = blogsAtStart[0]

        await api
            .delete(`/api/blogs/${blogToDelete.id}`)
            .expect(204)

        const blogsAtEnd = await helper.blogsInDb()

        expect(blogsAtEnd).toHaveLength(
            helper.initialBlogs.length - 1
        )

        const titles = blogsAtEnd.map(b => b.title)

        expect(titles).not.toContain(blogToDelete.title)
    })
})

describe('updating of a blog', () => {
    test('a blog should be updated correctly', async () => {
        const blogsAtStart = await helper.blogsInDb()
        const blogToUpdate = blogsAtStart.slice(0,1)[0]
        blogToUpdate.title = 'Updated title'

        await api
            .put(`/api/blogs/${blogToUpdate.id}`)
            .send(blogToUpdate)
            .expect(200)
            .expect('Content-Type', /application\/json/)

        const updatedBlog = await helper.blogById(blogToUpdate.id)

        expect(updatedBlog.title).toBe(blogToUpdate.title)
    })
})

afterAll(() => {
    mongoose.connection.close()
})