const mongoose = require('mongoose')
const supertest = require('supertest')
const bcrypt = require('bcrypt')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
    {
        title: "React patterns",
        author: "Michael Chan",
        url: "https://reactpatterns.com/",
        likes: 7
    },
    {
        title: "Go To Statement Considered Harmful",
        author: "Edsger W. Dijkstra",
        url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
        likes: 5
    },
    {
        title: "Canonical string reduction",
        author: "Edsger W. Dijkstra",
        url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
        likes: 12
    },
    {
        title: "First class tests",
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
        likes: 10
    },
    {
        title: "TDD harms architecture",
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
        likes: 0
    },
    {
        title: "Type wars",
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
        likes: 2
    } 
]

beforeEach(async () => {
    await Blog.deleteMany({})
    let blogObj = new Blog(initialBlogs[0])
    await blogObj.save()
    blogObj = new Blog(initialBlogs[1])
    await blogObj.save()
    blogObj = new Blog(initialBlogs[2])
    await blogObj.save()
    blogObj = new Blog(initialBlogs[3])
    await blogObj.save()
    blogObj = new Blog(initialBlogs[4])
    await blogObj.save()
    blogObj = new Blog(initialBlogs[5])
    await blogObj.save()
})

test('correct amount of blogs', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(initialBlogs.length)
}, 100000)

test('check property is named id', async () => {
    const blogs = await api.get('/api/blogs')
    expect(blogs.body[0].id).toBeDefined()
})

test('a new blog is created successfully', async () => {
    const newBlog = {
        title: "nuevo",
        author: "Leandro Robert",
        url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/nuevo.html",
        likes: 4
    }

    await api
        .post('/api/blogs')
        .send(newBlog)
    
    const response = await api.get('/api/blogs')

    expect(response.body).toHaveLength(initialBlogs.length + 1)
})

test('post with no likes equal to zero', async () => {
    const newBlog = {
        title: "no likes",
        author: "Leandro Robert",
        url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/nuevo.html",
    }

    await api
        .post('/api/blogs')
        .send(newBlog)

    const response = await api.get('/api/blogs')
    const blog = response.body.filter(blog => blog.title === "no likes")

    expect(blog[0].likes).toBe(0)
})

test('post with no title or url response 400', async () => {
    const newBlog = {
        author: "Leandro Robert",
        likes: 4
    }

    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(400)
    
    const response = await api.get('/api/blogs')

    expect(response.body).toHaveLength(initialBlogs.length)
})

describe('when there is initially one user in db', () => {
    beforeEach(async () => {
        await User.deleteMany({})

        const passwordHash = await bcrypt.hash('sekret', 10)
        const user = new User({ username: 'root', passwordHash })

        await user.save()
    })

    test('creation fails with user with less than 3 characters', async () => {
        const newUser = { username: 'le', password: '1234'}

        const result = await api.post('/api/users').send(newUser).expect(400)

        expect(result.text).toBe("{\"error\":\"User validation failed: username: Path `username` (`" + newUser.username + "`) is shorter than the minimum allowed length (3).\"}")
    })

    test('creation fails with password with less than 3 characters', async () => {
        const newUser = { username: 'lemenm', password: '12'}

        const result = await api.post('/api/users').send(newUser).expect(401)

        expect(result.text).toBe("{\"error\":\"invalid username or password\"}")
    })
})

afterAll(() => {
    mongoose.connection.close()
})