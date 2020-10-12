const listHelper = require('../utils/list_helper')
const blogs = require('./data')

describe('dummy test', () => {
    test('dummy returns one', () => {
            const blogs = []

            const result = listHelper.dummy(blogs)
            expect(result).toBe(1)
        })
    }
)

describe('total likes', () => {
    test('when list has only one blog, equals the likes of that', () => {
        const oneBlog = blogs.slice(0,1)
        const listWithOneBlog = [...oneBlog]
        const result = listHelper.totalLikes(listWithOneBlog)
        expect(result).toBe(oneBlog[0].likes)
    })

    test('of empty list is zero', () => {
        const emptyList = []
        const result = listHelper.totalLikes(emptyList)
        expect(result).toBe(0)
    })

    test('of a bigger list is calculated right', () => {
        const result = listHelper.totalLikes(blogs)
        expect(result).toBe(36)
    })
})

describe('favourite blog', () => {
    test('when list has only one blog, equals itself', () => {
        const oneBlog = blogs.slice(0,1)
        const listWithOneBlog = [...oneBlog]
        const result = listHelper.favoriteBlog(listWithOneBlog)
        expect(result).toEqual(oneBlog[0])
    })

    test('when list is empty is null', () => {
        const emptyList = []
        const result = listHelper.favoriteBlog(emptyList)
        expect(result).toBe(null)
    })

    test('of a bigger list is calculated right', () => {
        const favouriteBlog = blogs.filter(b => b.title==='Canonical string reduction')[0]
        const result = listHelper.favoriteBlog(blogs)
        expect(result).toEqual(favouriteBlog)
    })
})

describe('find author with the biggest amount of blogs', () => {
    test('when list has only one blog, equals itself', () => {
        const oneBlog = blogs.slice(0,1)
        const listWithOneBlog = [...oneBlog]
        const result = listHelper.mostBlogs(listWithOneBlog)
        const expected = {
            author: oneBlog[0].author,
            blogs: 1
        }
        expect(result).toEqual(expected)
    })

    test('of empty list is null', () => {
        const emptyList = []
        const result = listHelper.mostBlogs(emptyList)
        expect(result).toBe(null)
    })

    test('of a bigger list is calculated right', () => {
        const result = listHelper.mostBlogs(blogs)
        const expected = {
            author: 'Robert C. Martin',
            blogs: 3
        }
        expect(result).toEqual(expected)
    })
})

describe('find author with the biggest amount of likes', () => {
    test('when list has only one blog, equals itself', () => {
        const oneBlog = blogs.slice(0,1)
        const listWithOneBlog = [...oneBlog]
        const result = listHelper.mostLikes(listWithOneBlog)
        const expected = {
            author: oneBlog[0].author,
            likes: oneBlog[0].likes
        }
        expect(result).toEqual(expected)
    })

    test('of empty list is null', () => {
        const emptyList = []
        const result = listHelper.mostLikes(emptyList)
        expect(result).toBe(null)
    })

    test('of a bigger list is calculated right', () => {
        const result = listHelper.mostLikes(blogs)
        const expected = {
            author: 'Edsger W. Dijkstra',
            likes: 17
        }
        expect(result).toEqual(expected)
    })
})