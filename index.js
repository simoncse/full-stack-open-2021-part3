require('dotenv').config()
const morgan = require('morgan')
const express = require('express')
const cors = require('cors')
const Person = require('./models/person')
const app = express()

app.use(express.static('build'))
app.use(cors())
app.use(express.json())


//Morgan
morgan.token('content', req => {
  return JSON.stringify(req.body)
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :content'))


//Error handler
const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(406).json({ error: error.message })
  } else if (error.name === 'BadRequest') {
    return response.status(400).json({ error: error.message })
  }
  next(error)
}

//Get all person
app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})


// Get a single person
app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(person => {
      if (person){
        response.json(person)
      }else{
        response.status(404).end()
      }
    })
    .catch(err => {
      console.log(err)
      next(err)
    })
})

// Delete a person
app.delete('/api/persons/:id', (request,response,next) => {
  Person.findByIdAndRemove(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch(err => next(err))
})

// POST request
app.post('/api/persons', (request, response, next) => {
  const body = request.body

  if(body.name === undefined || body.phone === undefined) {
    return response.status(406).json({ error : 'phone or name missing' })
  }

  const person = new Person({
    name: body.name,
    phone: body.phone
  })

  person.save()
    .then(savedPerson => {
      response.json(savedPerson)
    })
    .catch(err => next(err))
})

//Update a person
app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body

  const person = {
    name: body.name,
    phone: body.phone
  }

  Person.findByIdAndUpdate(request.params.id, person, { new: true, runValidators: true, context: 'query' })
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(err => next(err))


})

// Get info
app.get('/info', (request, response) => {
  let options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute:'2-digit', second:'2-digit' }
  const date = new Date().toLocaleString('en-GB', options)
  Person.countDocuments().then( docCount => {
    response.send(`<p>Phonebook has info for ${docCount} people</p>
                    <p>${date}</p>`)
  })
})


const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

// error handler
app.use(unknownEndpoint)
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})