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

module.exports = { dummy, totalLikes, favoriteBlog }