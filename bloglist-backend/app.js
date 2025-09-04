// app.js
require('express-async-errors')
const express = require('express')
const mongoose = require('mongoose')
const blogsRouter = require('./controllers/blogs')
const loginRouter = require('./controllers/login')
const usersRouter = require('./controllers/users')
const config = require('./utils/config')
const middleware = require('./utils/middleware')
const testingRouter = require('./controllers/testing')
const app = express()

mongoose.connect(config.MONGODB_URI)

app.use(express.json())
app.use(middleware.requestLogger)
app.use(middleware.tokenExtractor)

app.use('/api/blogs', blogsRouter)
app.use('/api/login', loginRouter)
app.use('/api/users', usersRouter)
console.log('NODE_ENV is:', process.env.NODE_ENV)
if (process.env.NODE_ENV === 'test') {
  console.log('Enabling testing router')
  app.use('/api/testing', testingRouter)
}
app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)



module.exports = app
