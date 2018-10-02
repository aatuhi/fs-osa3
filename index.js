const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')

morgan.token('data', function getData(request) {
  return JSON.stringify(request.body)
})

app.use(bodyParser.json())
app.use(morgan(':method :url :data :status :res[content-length] - :response-time ms'))
app.use(cors())

console.log('Hello world')

// 'visible'-attribuutti lis'tyy kyseenalaisen hakutoiminnon implementaation takia
let persons = [
  {
    name: 'Arto Hellas',
    number: '040-123456',
    id: 1,
    visible: true
  },
  {
    name: 'Martti Tienari',
    number: '040-123456',
    id: 2,
    visible: true
  },
  {
    name: 'Arto Järvinen',
    number: '040-123456',
    id: 3,
    visible: true
  },
  {
    name: 'Lea Kutvonen',
    number: '040-123456',
    id: 4,
    visible: true
  }
]

app.get('/', (request, response) => {
  response.send('<h1>Hei Maailma!</h1>')
})

app.get('/info', (request, response) => {
  response.send(`Puhelinluettelossa on ${persons.length} henkilön tiedot </br> </br> ${Date()}`)
  console.log(Date())
})

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(person => person.id === id)
  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

app.post('/api/persons', (request, response) => {
  const body = request.body

  if (body.name.length < 1 || body.number.length < 1) {
    console.log('missing name or number')
    return response.status(404).json({ error: 'missing name or number' })
  }

  if (persons.find(person => person.name === body.name)) {
    return response.status(404).json({ error: 'name must be unique' })
  }

  const person = {
    name: body.name,
    number: body.number,
    id: body.id
  }

  persons = persons.concat(person)
  response.json(person)
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)
  console.log(`${persons.find(person => person.id === id).name} deleted from persons`)

  response.status(204).end()
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
