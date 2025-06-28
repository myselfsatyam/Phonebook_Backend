const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();
const mongoose = require('mongoose');
// Importing the Person model
const Person = require('./models/person.js'); // Uncomment this line if using MongoDB with Mongoose
const app = express();

const path = require('path');

app.use(express.static(path.resolve(__dirname, 'dist')));

const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    }

    next(error)
}

// Middleware to parse JSON
app.use(express.json());
// Middleware to enable CORS
app.use(cors());

// Custom token to log POST request body
morgan.token('post-data', (req) => {
  return req.method === 'POST' ? JSON.stringify(req.body) : '';
});

// Apply morgan middleware with custom format
app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :post-data')
);

// Connect to MongoDB
mongoose.set('strictQuery', false);
mongoose.connect(process.env.url);

// In-memory phonebook data
let persons = [
  { id: "1", name: "Arto Hellas", number: "040-123456" },
  { id: "2", name: "Ada Lovelace", number: "39-44-5323523" },
  { id: "3", name: "Dan Abramov", number: "12-43-234345" },
  { id: "4", name: "Mary Poppendieck", number: "39-23-6423122" }
];

// Route 3.1: Get all persons
app.get('/api/persons', (req, res) => {
  res.json(persons);
});

// Route 3.2: Info page
app.get('/info', (req, res) => {
  const count = persons.length;
  const time = new Date();
  res.send(`<p>Phonebook has info for ${count} people</p><p>${time}</p>`);
});

// Route 3.3: Get a person by ID
app.get('/api/persons/:id', (req, res) => {
  const id = req.params.id;
  const person = persons.find(p => p.id === id);

  if (person) {
    res.json(person);
  } else {
    res.status(404).json({ error: 'person not found' });
  }
});

// Route 3.4: Delete a person by ID
app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndRemove(req.params.id)
    .then(result => {
      if (result) res.status(204).end();
      else res.status(404).json({ error: 'person not found' });
    })
    .catch(error => next(error));
});

// Route 3.5 & 3.6: Add a new person
app.post('/api/persons', (req, res, next) => {
  const { name, number } = req.body;

  if (!name || !number) {
    return res.status(400).json({ error: 'name and number are required' });
  }
  const person = new Person({ name, number });

  person.save()
    .then(savedPerson => res.status(201).json(savedPerson))
    .catch(error => next(error));
});

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
});


app.use(errorHandler); //error handling middleware


// Server setup
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
