require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const Person = require('./models/person');

morgan.token('post_data', (req) => req.method === 'POST' ? JSON.stringify(req.body) : null);

const app = express();
app.use(express.json());
app.use(express.static('build'));
app.use(cors());
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :post_data'));

app.get('/api/persons', (req, res, next) => {
  Person.find({})
    .then(persons => {
      res.json(persons);
    })
    .catch(next);
});

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id);
  const person = phonebook.find(p => p.id === id);
  if (person) {
    res.json(person);
  } else {
    res.status(404).end();
  }
});

app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndRemove(req.params.id)
    .then(result => {
      if (result !== null) {
        res.status(204).end();
      } else {
        res.status(404).end();
      }
    })
    .catch(next);
});

app.post('/api/persons', (req, res, next) => {
  const newPerson = req.body;
  if (!newPerson || !newPerson.name || !newPerson.number) {
    return res.status(400).json({ "error": "person's name or number was missing" }
    );
  }

  const person = new Person({ name: newPerson.name, number: newPerson.number });
  person.save()
    .then(savedPerson => {
      res.status(201).json(savedPerson);
    })
    .catch(next)
});

app.get('/info', (req, res) => {
  res.send(
    ` <!DOCTYPE html>
      <html lang="en">
        <head><title>Info</title></head>
        <body>
          Phonebook has info for ${phonebook.length} people <br> ${new Date()} 
        </body>
      </html>`);
});

const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' });
  }

  next(error);
}

app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});