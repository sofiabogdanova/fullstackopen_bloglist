const _ = require('lodash')

const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    const reducer = (accumulator, currentValue) => accumulator + currentValue

    return blogs.length === 0
        ? 0
        : blogs.map(b => b.likes).reduce(reducer)
}

const favoriteBlog = (blogs) => {
    const reducer = function(prev, current) {
        return (prev.likes > current.likes) ? prev : current
    }

    return blogs.length === 0
        ? null
        : blogs.reduce(reducer)
}

const mostBlogs = (blogs) => {
    if (blogs.length === 0) return null

    const blogsByAuthors = _
        .map(_.countBy(blogs, "author"), (val, key) => ({
                author: key,
                blogs: val
            }))
    const authorWithMostBlogs = _.orderBy(blogsByAuthors, 'blogs', 'desc')[0]
    return authorWithMostBlogs;
}

const mostLikes = (blogs) => {
    if (blogs.length === 0) return null

    const groupedByLikes = _(blogs)
        .groupBy('author')
        .map((blog, author) => ({
            author: author,
            likes: _.sumBy(blog, 'likes'),
        }))
        .value()
    const authorWithMostLikes = _.orderBy(groupedByLikes, 'likes', 'desc')[0]
    return authorWithMostLikes;
}
module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}