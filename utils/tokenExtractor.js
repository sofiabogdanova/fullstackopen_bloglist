const tokenExtractor = (request, response, next) => {
    const token = getTokenFrom(request)
    request.token = token
    next()
}

const getTokenFrom = request => {
    const authorization = request.get('authorization')
    if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
        return authorization.substring(7)
    }
    return null
}

module.exports = tokenExtractor