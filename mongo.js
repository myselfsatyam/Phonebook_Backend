// BZIm4KXKvDuQ0B

const mongoose = require('mongoose')
require('dotenv').config()

if (process.argv.length < 5) {
    console.log('invalid request')
    process.exit(1)
}

const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]

const url = process.env.url

mongoose.set('strictQuery', false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
    id: String,
    name: String,
    number: String
})

const Person = mongoose.model('Person', personSchema)

const person = new Person({
    id: name + number,
    name: name,
    number: number
})

person.save()
    .then(() => {
        console.log(`added ${name} number ${number} to phonebook`)
        return Person.find({})
    })
    .then(result => {
        result.forEach(person => {
            console.log(person.name, person.number)
        })
        mongoose.connection.close()
    })
    .catch(error => {
        console.error(error)
        mongoose.connection.close()
    })