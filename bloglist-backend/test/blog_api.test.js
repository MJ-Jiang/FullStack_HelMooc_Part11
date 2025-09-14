const { test, describe, after, beforeEach, before } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const jwt = require('jsonwebtoken')
const app = require('../app')
const helper = require('./test_helper')
const Blog = require('../models/blog')
const User = require('../models/user')
const api = supertest(app)
require('dotenv').config()
const testUser = {
  name: 'Test User',
  username: 'testuser',
  password: 'password123'
}

let token
let userId

describe('when there are initially some blogs saved', () => {
  beforeEach(async () => {

    await Blog.deleteMany({})
    await User.deleteMany({})

    const userResponse = await api.post('/api/users').send(testUser)
    userId = userResponse.body.id

    const loginResponse = await api.post('/api/login').send(testUser)
    token = loginResponse.body.token

    const blogObjects = helper.initialBlogs.map(
      blog => new Blog({ ...blog, user: userId })
    )
    await Promise.all(blogObjects.map(blog => blog.save()))
  })

  test('right amount of blogs are returned', async () => {
    const result = await api
      .get('/api/blogs')
      .set({ Authorization: `Bearer ${token}` })
    assert.strictEqual(result.body.length, helper.initialBlogs.length)
  })

  test('blogs has id attribute', async () => {
    const blogs = await helper.blogsInDb()
    blogs.forEach(blog => assert.ok(blog.id, 'Blog is missing id attribute'))
  })

  describe('when adding a new blog', () => {
    test('blog count increases by one and added blog can be found', async () => {
      const newBlog = {
        title: 'Testing Blog API',
        author: 'Mark Markkanen',
        url: 'https://testurl.com/',
        likes: 5
      }
      const decodedToken = jwt.verify(token, process.env.SECRET)
      console.log('decoded token:', decodedToken)
      await api
        .post('/api/blogs')
        .set({ Authorization: `Bearer ${token}` })
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

      const titles = blogsAtEnd.map(blog => blog.title)
      assert(titles.includes('Testing Blog API'))
    })

    test('likes attribute get default value 0 if not passed with request', async () => {
      const newBlog = {
        title: 'Testing Blog API',
        author: 'Mark Markkanen',
        url: 'https://testurl.com/'
      }

      await api
        .post('/api/blogs')
        .set({ Authorization: `Bearer ${token}` })
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const blogsAtEnd = await helper.blogsInDb()
      const addedBlog = blogsAtEnd.find(
        blog => blog.title === 'Testing Blog API'
      )

      assert.strictEqual(addedBlog.likes, 0)
    })

    test('a valid blog is not added without a token', async () => {
      const newBlog = {
        title: 'Testing Blog API',
        author: 'Mark Markkanen',
        url: 'https://testurl.com/',
        likes: 5
      }

      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(401)
        .expect('Content-Type', /application\/json/)

      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)

      const titles = blogsAtEnd.map(blog => blog.title)
      assert(!titles.includes('Testing Blog API'))
    })

    test('posting a blog without title causes response 400', async () => {
      const newBlog = {
        author: 'Mark Markkanen',
        url: 'https://testurl.com/',
        likes: 5
      }

      await api
        .post('/api/blogs')
        .set({ Authorization: `Bearer ${token}` })
        .send(newBlog)
        .expect(400)
    })

    test('posting a blog without url causes response 400', async () => {
      const newBlog = {
        title: 'Testing Blog API',
        author: 'Mark Markkanen',
        likes: 5
      }

      await api
        .post('/api/blogs')
        .set({ Authorization: `Bearer ${token}` })
        .send(newBlog)
        .expect(400)
    })
  })

  describe('deletion of a blog', () => {
    test('succeeds with status code 204 if id is valid', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToDelete = blogsAtStart[0]

      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .set({ Authorization: `Bearer ${token}` })
        .expect(204)

      const blogsAtEnd = await helper.blogsInDb()
      const titles = blogsAtEnd.map(b => b.title)

      assert(!titles.includes(blogToDelete.title))
      assert.strictEqual(blogsAtEnd.length, blogsAtStart.length - 1)
    })
  })

  describe('when modificating a blog', () => {
    test('all fields will be updated', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToUpdate = blogsAtStart[0]

      const editedBlog = {
        title: 'Updated Title',
        author: 'Updated Author',
        url: 'Updated url',
        likes: blogToUpdate.likes + 1
      }

      await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .set({ Authorization: `Bearer ${token}` })
        .send(editedBlog)
        .expect(200)

      const updatedBlog = await Blog.findById(blogToUpdate.id)

      assert.strictEqual(updatedBlog.title, editedBlog.title)
      assert.strictEqual(updatedBlog.author, editedBlog.author)
      assert.strictEqual(updatedBlog.url, editedBlog.url)
      assert.strictEqual(updatedBlog.likes, editedBlog.likes)
    })
  })
})

after(async () => {
  await mongoose.connection.close()
})