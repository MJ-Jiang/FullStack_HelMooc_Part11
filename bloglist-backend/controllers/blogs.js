const Blog = require('../models/blog')
const blogsRouter = require('express').Router()
const { userExtractor } = require('../utils/middleware')

blogsRouter.get('/', (request, response) => {
  Blog.find({})
    .populate('user', { username: 1, name: 1, id: 1 })
    .then(blogs => {
      response.json(blogs)
    })
})

blogsRouter.post('/', userExtractor, async (request, response) => {
  const user = request.user
  const blog = new Blog(request.body)

  blog.likes = blog.likes || 0
  blog.user = user._id

  if (!blog.title || !blog.url) {
    return response.status(400).send({ error: 'title or url missing' })
  }

  const savedBlog=await blog.save()
     user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()
 
  const populatedBlog=await Blog.findById(savedBlog._id).populate('user',{
    username:1,
    name:1,
    id:1
  })
  response.status(201).json(populatedBlog)
})

blogsRouter.delete('/:id', userExtractor, async (request, response) => {
  const user = request.user
  const blog = await Blog.findById(request.params.id)

  if (!blog) {
    return response.status(204).end()
  }

  if (user.id.toString() !== blog.user.toString()) {
    return response.status(403).json({ error: 'user not authorized' })
  }


  user.blogs = user.blogs.filter(b => b.toString() !== blog._id.toString())


  await blog.deleteOne()
  await user.save()
  response.status(204).end()
})

blogsRouter.put('/:id', async (request, response) => {
  const { title, author, url, likes } = request.body

  const blog = await Blog.findById(request.params.id)

  if (!blog) {
    return response.status(404).end()
  }

  blog.title = title
  blog.author = author
  blog.url = url
  blog.likes = likes

  const updatedBlog = await blog.save()

  response.json(updatedBlog)
})

module.exports = blogsRouter
