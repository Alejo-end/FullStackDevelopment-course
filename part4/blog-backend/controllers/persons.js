const personsRouter = require("express").Router()
const Person = require("../models/person")
const bcrypt = require("bcrypt")
require("express-async-errors")

personsRouter.get("/", async (request, response) => {
    const persons = await Person.find({}).populate("blogs", { title: 1, author: 1, url: 1, likes: 1 })
    response.json(persons)
})

personsRouter.post("/", async (request, response) => {
    const { username, name, password } = request.body

    if(password.length < 3) { //checked in the controller as instructed seen password and hash sizes are not the same
        return response.status(400).json({ error: 'password must be at least 3 characters long'})  
    }
    const thisPerson = await Person.findOne({ username })  //given in the tutorial seen the mongoose-unique-validator does not work with mongoose version 6.x
    if (thisPerson) {
        return response.status(400).json({ error: 'username must be unique' })
    }
    
    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)

    const person = new Person({
        username,
        name,
        passwordHash
    })
    const savedPerson = await person.save()

    response.status(201).json(savedPerson)
})

module.exports = personsRouter