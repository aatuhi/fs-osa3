const express = require('express')
const app = express()
const bodyParser = require('body-parser')

app.use(bodyParser.json())

console.log('Hello world')

let persons = [
  {
    name: 'Arto Hellas',
    number: '040-123456',
    id: 1
  },
  {
    name: 'Martti Tienari',
    number: '040-123456',
    id: 2
  },
  {
    name: 'Arto Järvinen',
    number: '040-123456',
    id: 3
  },
  {
    name: 'Lea Kutvonen',
    number: '040-123456',
    id: 4
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
  console.log(person)
  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

app.post('/api/persons', (request, response) => {
  const body = request.body
  console.log(body.name.length, body.number.length)

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
    id: Math.floor(Math.random() * 100000000)
  }
  persons = persons.concat(person)
  response.json(person)

  console.log(`${person.name} added to persons`)
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)
  console.log(`${persons.find(person => person.id === id).name} deleted from persons`)

  response.status(204).end()
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
