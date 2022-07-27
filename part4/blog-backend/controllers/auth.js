const jwt = require('jsonwebtoken') //as given in the  tutorial of part 4, Token authentication
const bcrypt = require('bcrypt')
const authRouter = require('express').Router()
const Person = require('../models/person')

authRouter.post('/', async (request, response) => {
    const { username, password } = request.body

    const person = await Person.findOne({ username })
    const passwordCorrect = person === null
        ? false
        : await bcrypt.compare(password, person.passwordHash)

    if (!(person && passwordCorrect)) {
        return response.status(401).json({
            error: 'invalid username or password'
        })
    }

    const personForToken = {
        username: person.username,
        id: person._id,
    }

    const token = jwt.sign(personForToken, process.env.SECRET)

    response
        .status(200)
        .send({ token, username: person.username, name: person.name })
})

module.exports = authRouter