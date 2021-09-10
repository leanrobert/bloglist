const jwt = require('jsonwebtoken')
const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (req, res) => {
    const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
    res.json(blogs)
})

blogsRouter.post('/', async (req, res) => {
    const body = req.body
    const token = req.token
    const decodedToken = jwt.verify(token, process.env.SECRET)

    if(!token || !decodedToken.id) {
        return res.status(401).json({ error: 'token missing or invalid' })
    }
    
    const user = req.user
   
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
    const decodedToken = jwt.verify(req.token, process.env.SECRET)
    const blog = await Blog.findById(req.params.id)
    const user = req.user
    
    if(!req.token || !decodedToken.id || blog.user.toString() !== user._id.toString()) {
        return res.status(401).json({ error: 'token missing or invalid' })
    }

    await Blog.findByIdAndRemove(req.params.id)
    res.status(204).end()
})

module.exports = blogsRouter