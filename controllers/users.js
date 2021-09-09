const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async (req, res) => {
    const users = await User.find({})
    res.json(users)
})

usersRouter.post('/', async (req, res) => {
    const body = req.body

    if(!body.username || !body.password || body.password.length < 3) {
        res.status(401).json({ error: 'invalid username or password'})
    }

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(body.password, saltRounds)

    const user = new User({
        username: body.username,
        name: body.name,
        passwordHash
    })

    const savedUser = await user.save()

    res.json(savedUser)
})

module.exports = usersRouter