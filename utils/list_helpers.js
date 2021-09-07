const _ = require('lodash')

const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    if(blogs.length === 0) {
        return 0
    }

    const total = blogs.map(blog => blog.likes).reduce((acc, likes) => acc + likes)
    return total
}

const favoriteBlog = (blogs) => {
    if(blogs.length === 0) {
        return null
    }

    const likes = blogs.map(blog => blog.likes)
    const maxLikes = Math.max(...likes)
    maxBlog = blogs.find(blog => blog.likes === maxLikes && blog)
    return maxBlog
}

const mostBlogs = (blogs) => {
    const authors = _.countBy(blogs.map(blog => blog.author))
    max = 0
    author = ''
    for (const [key, value] of Object.entries(authors)) {
        if(value > max) {
            max = value
            author = key
        }
    }

    return { author: author, blogs: max }
}

module.exports = { dummy, totalLikes, favoriteBlog, mostBlogs }