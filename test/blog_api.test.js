const mongoose = require('mongoose')
const supertest = require('supertest')
const bcrypt = require('bcrypt')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const User = require('../models/user')

const token = { Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InJvb3QiLCJpZCI6IjYxM2JhMTI5NDFlZWZmOTY2NDVjZmQ0NyIsImlhdCI6MTYzMTI5ODIwMH0.ReTKNHAm5BhbNMwbhivbESlCalBnB8E_5ePDtuJsU5k" }

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
}, 100000)

test('correct amount of blogs', async () => {
    const response = await api.get('/api/blogs').set(token)
    expect(response.body).toHaveLength(initialBlogs.length)
}, 100000)

test('check property is named id', async () => {
    const blogs = await api.get('/api/blogs').set(token)
    expect(blogs.body[0].id).toBeDefined()
})

describe('post creations', () => {
    test('a new blog is created successfully', async () => {
        const newBlog = {
            title: "nuevo",
            author: "Leandro Robert",
            url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/nuevo.html",
            likes: 4
        }
      
        await api
            .post('/api/blogs')
            .set(token)
            .send(newBlog)
        
        const response = await api.get('/api/blogs').set(token)
    
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
            .set(token)
            .send(newBlog)
            
            
    
        const response = await api.get('/api/blogs').set(token)
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
            .set(token)
            .send(newBlog)
            .expect(400)
        
        const response = await api.get('/api/blogs').set(token)
    
        expect(response.body).toHaveLength(initialBlogs.length)
    })
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

        const result = await api.post('/api/users').send(newUser).set(token).expect(400)

        expect(result.text).toBe("{\"error\":\"User validation failed: username: Path `username` (`" + newUser.username + "`) is shorter than the minimum allowed length (3).\"}")
    })

    test('creation fails with password with less than 3 characters', async () => {
        const newUser = { username: 'lemenm', password: '12'}

        const result = await api.post('/api/users').send(newUser).set(token).expect(401)

        expect(result.text).toBe("{\"error\":\"invalid username or password\"}")
    })
})

afterAll(() => {
    mongoose.connection.close()
})