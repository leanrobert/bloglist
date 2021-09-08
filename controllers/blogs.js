const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', (req, res) => {
    Blog
        .find({})
        .then(blogs => {
            res.json(blogs)
        })
})

blogsRouter.post('/', (req, res) => {
    const blog = new Blog(req.body)

    if(!blog.title || !blog.url) {
        return res.status(400).send({ error: 'Title or url missing' })
    }

    blog
        .save()
        .then(result => {
            res.status(201).json(result)
        })
})

module.exports = blogsRouter