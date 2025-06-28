const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const url = process.env.url

mongoose.connect(url)
    .then(result => {
        console.log('connected to MongoDB')
    })
    .catch((error) => {
        console.log('error connecting to MongoDB:', error.message)
    })

    const phoneValidator = [
  {
    validator: function(v) {
      if (!v || v.length < 8) return false
      return /^\d{2,3}-\d+$/.test(v)
    },
    message: props => `${props.value} is not a valid phone number!`
  }
]

const personSchema = new mongoose.Schema({
    name: {
     type:   String,
     minlength: [3, 'Name must be at least 3 characters long'],
     required: [true, 'Name is required']
    },
    number: String
})

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Person', personSchema)