require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const Person = require('./models/person');

morgan.token('post_data', (req) => req.body ? JSON.stringify(req.body) : null);

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

app.get('/api/persons/:id', (req, res, next) => {
  Person.findById(req.params.id)
    .then(person => {
      if (person) {
        res.json(person);
      } else {
        res.status(404).end();
      }
    })
    .catch(next);
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
    return res.status(400).json({ error: 'person\'s name or number was missing' }
    );
  }

  const person = new Person({ name: newPerson.name, number: newPerson.number });
  person.save()
    .then(savedPerson => {
      res.status(201).json(savedPerson);
    })
    .catch(next);
});

app.put('/api/persons/:id', (req, res, next) => {
  const body = req.body;
  if (!body || !body.number) {
    return res.status(400).json({ error: 'person\'s number was missing' }
    );
  }

  Person.findByIdAndUpdate(req.params.id, { number: body.number }, { new: true })
    .then(savedPerson => {
      console.log('saved person', savedPerson);
      res.status(201).json(savedPerson);
    })
    .catch(next);
});

app.get('/info', (req, res, next) => {
  Person.find({})
    .then(persons => {
      res.send(
        ` <!DOCTYPE html>
          <html lang="en">
            <head><title>Info</title></head>
            <body>
              Phonebook has info for ${persons.length} people <br> ${new Date()} 
            </body>
          </html>`);
    })
    .catch(next);
});

const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === 'CastError') {
    return response.status(400).json({ error: 'malformatted id' });
  }
  if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message });
  }

  next(error);
};

app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});