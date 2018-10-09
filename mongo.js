const mongoose = require('mongoose')

// korvaa url oman tietokantasi urlilla. ethän laita salasanaa Githubiin!
const url = 'mongodb://arthur:sensei1@ds123513.mlab.com:23513/puhelinluettelo'

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
