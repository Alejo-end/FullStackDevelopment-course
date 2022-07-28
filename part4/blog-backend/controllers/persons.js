const personsRouter = require("express").Router()
const Person = require("../models/person")
const bcrypt = require("bcrypt")
require("express-async-errors")

personsRouter.get("/", async (request, response) => {
    const persons = await Person.find({}).populate("blogs", { title: 1, author: 1, url: 1, likes: 1 })
    response.json(persons)
})

personsRouter.post("/", async (request, response) => {
    const { username, name, passwordHash } = request.body

    if(passwordHash.length < 3) { 
        return response.status(400).json({ error: 'password must be at least 3 characters long'})  
    }
    const thisPerson = await Person.findOne({ username })  
    if (thisPerson) {
        return response.status(400).json({ error: 'username must be unique' })
    }
    
    const saltRounds = 10
    const hash = await bcrypt.hash(passwordHash, saltRounds)

    const person = new Person({
        username: username,
        name: name,
        passwordHash: hash
    })
    const savedPerson = await person.save()

    response.status(201).json(savedPerson)
})

module.exports = personsRouter