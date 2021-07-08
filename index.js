const morgan = require('morgan');
const express = require('express');
const app = express();

//CORS
const cors = require('cors')
app.use(cors())


//Statis
app.use(express.static('build'))

app.use(express.json())

let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
];

//Morgan
morgan.token("content", req => {
    return JSON.stringify(req.body);
});

app.use(morgan(":method :url :status :res[content-length] - :response-time ms :content"));


//Get all person 
app.get('/api/persons', (request, response) => {
    response.json(persons);
})


// Get a single person
app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id);
    const note = persons.find(note => note.id === id);

    note ? response.json(note)
    : response.status(404).end();
})

// Delete a person
app.delete('/api/persons/:id', (request,response) =>{
    const id = Number(request.params.id);
    persons = persons.filter(note => note.id !== id);
    
    response.status(204).end();
})

// POST request
app.post('/api/persons', (request, response) =>{
    const body = request.body;

    if(!body.name || !body.number){
        return response.status(400).json({
            error: 'name and/or number is missing'
        });
    };

    const duplicate = persons.find(p => p.name === body.name);
    if (duplicate){
        return response.status(400).json({
            errors: 'name must be unique'
        });
    };

    const newID = Math.floor(Math.random() * 100000 + 5);
    const person = {
        id: newID,
        name: body.name,
        number: body.number
    };

    persons = persons.concat(person);
    
    response.json(person);
})

// Get info
app.get('/info', (request, response) =>{
    let options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute:'2-digit', second:'2-digit' }
    const date = new Date().toLocaleString("en-GB", options)
    response.send(`<p>Phonebook has info for ${persons.length} people</p>
                    <p>${date}</p>`)
})

const PORT = process.env.PORT || 3001;
app.listen(PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})