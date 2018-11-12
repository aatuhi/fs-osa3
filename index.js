const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

morgan.token('data', function getData(request) {
  return JSON.stringify(request.body)
})

app.use(bodyParser.json())
app.use(morgan(':method :url :data :status :res[content-length] - :response-time ms'))
app.use(cors())
app.use(express.static('build'))

console.log('Hello world')

// let persons = [
//   {
//     name: 'Arto Hellas',
//     number: '040-123456',
//     id: 1
//   },
//   {
//     name: 'Martti Tienari',
//     number: '040-123456',
//     id: 2
//   },
//   {
//     name: 'Arto Järvinen',
//     number: '040-123456',
//     id: 3
//   },
//   {
//     name: 'Lea Kutvonen',
//     number: '040-123456',
//     id: 4
//   }
// ]

const formatPerson = person => {
  return {
    name: person.name,
    number: person.number,
    id: person._id,
  }
}

app.get('/', (request, response) => {
  response.send('<h1>Hei Maailma!</h1>')
})

app.get('/info', (request, response) => {
  Person.estimatedDocumentCount().then(result => {
    response.send(`Puhelinluettelossa on ${result} henkilön tiedot </br></br> ${Date()}`)
  })
})

app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons.map(formatPerson))
  })
})

app.get('/api/persons/:id', (request, response) => {
  Person.findById(request.params.id)
    .then(person => {
      response.json(formatPerson(person))
    })
    .catch(error => {
      console.log(error)
      response.status(404).end()
    })
})

app.post('/api/persons', (request, response) => {
  const body = request.body

  const savePerson = person => {
    person
      .save()
      .then(savedPerson => {
        response.json(formatPerson(savedPerson))
      })
      .catch(error => console.log(error))
  }

  if (body.name.length < 1 || body.number.length < 1) {
    console.log('missing name or number')
    return response.status(404).json({ error: 'missing name or number' })
  }

  Person.findOne({ name: body.name }).then(result => {
    if (result !== null) {
      return response
        .status(400)
        .json({ error: 'name is already in use' })
        .end()
    }
    const person = new Person({
      name: body.name,
      number: body.number,
    })

    savePerson(person)
  })
})

app.delete('/api/persons/:id', (request, response) => {
  Person.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => {
      response.status(400).send({ error: 'malformatted id' })
    })
})

app.put('/api/persons/:id', (request, response) => {
  console.log('updating')
  const body = request.body

  const person = {
    name: body.name,
    number: body.number,
  }

  Person.findByIdAndUpdate(request.params.id, person, { new: true })
    .then(updatedPerson => {
      response.json(formatPerson(updatedPerson))
    })
    .catch(error => {
      console.log(error)
      response.status(400).send({ error: 'malformatted id' })
    })
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
