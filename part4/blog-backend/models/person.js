const mongoose = require("mongoose")

const personSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        minLength: 3,
    },
    name: {
        type: String,
        required: true
    },
    passwordHash: {
        type: String,
        required: true,
        minLength: 3
    }, 
    blogs: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Blog'
        }
    ],
})

personSchema.set("toJSON", {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject.__v
        delete returnedObject._id
        delete returnedObject.passwordHash
    }
})

const Person = mongoose.model("Person", personSchema)

module.exports = Person