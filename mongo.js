const mongoose = require('mongoose')
require('dotenv').config()

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const url = process.env.MONGODB_URI

mongoose.connect(url)

const Person = mongoose.model('Person', {
  name: String,
  number: String
})

if (process.argv.length > 2) {
  console.log(`Lisätään henkilö ${process.argv[2]}, numero ${process.argv[3]} puhelinluetteloon`)
  const person = new Person({
    name: process.argv[2],
    number: process.argv[3]
  })
  person.save().then(result => {
    mongoose.connection.close()
  })
} else {
  console.log('Puhelinluettelo:')
  Person.find({}).then(result => {
    result.forEach(person => {
      console.log(`${person.name} ${person.number} `)
    })
    mongoose.connection.close()
  })
}
