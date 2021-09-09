const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

blogsRouter.get('/', async (req, res) => {
    const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
    res.json(blogs)
})

blogsRouter.post('/', async (req, res) => {
    const body = req.body

    const user = await User.findById(body.userId)
    
    const blog = new Blog({
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes,
        user: user._id
    })

    if(!blog.title || !blog.url) {
        return res.status(400).send({ error: 'Title or url missing' })
    }

    const savedblog = await blog.save()
    user.blogs = user.blogs.concat(savedblog._id)
    await user.save()

    res.status(201).json(savedblog)
})

blogsRouter.put('/:id', async (req, res) => {
    const body = req.body

    const blog = {
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes
    }

    const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, blog, { new: true })
    res.json(updatedBlog)
})

blogsRouter.delete('/:id', async (req, res) => {
    await Blog.findByIdAndRemove(req.params.id)
    res.status(204).end()
})

module.exports = blogsRouter