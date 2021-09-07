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

module.exports = { dummy, totalLikes }