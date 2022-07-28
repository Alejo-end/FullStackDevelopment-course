
const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const config = require("./utils/config")
const blogsRouter = require('./controllers/blogs')
const personsRouter = require('./controllers/persons')
const authRouter = require('./controllers/auth')
const logger = require("./utils/logger")
const middleware = require("./utils/middleware")
require('express-async-errors')

logger.info('Connecting to:', config.MONGOURL)
mongoose.connect(config.MONGOURL)

app.use(cors())
app.use(express.json())
app.use(middleware.requestLogger)
app.use(middleware.tokenExtractor)

app.use('/api/blogs', blogsRouter)
app.use('/api/persons', personsRouter)
app.use('/api/auth', authRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app