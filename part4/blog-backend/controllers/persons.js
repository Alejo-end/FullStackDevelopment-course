const personsRouter = require("express").Router()
const Person = require("../models/person")
const bcrypt = require("bcrypt")
require("express-async-errors")

personsRouter.get("/", async (request, response) => {
    const persons = await Person.find({})
    response.json(persons)
})

personsRouter.post("/", async (request, response) => {
    const { username, name, password} = request.body

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)

    const user = new Person({
        username,
        name,
        passwordHash
    })

    const savedUser = await user.save()

    response.status(201).json(savedUser)
})



module.exports = personsRouter