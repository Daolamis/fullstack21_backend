const express = require('express');
const morgan = require('morgan');

morgan.token('post_data', (req) => req.method === 'POST' ? JSON.stringify(req.body, null, 2) : null);

const app = express();
app.use(express.json());
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :post_data'));

let phonebook = [
  {
    name: "Arto Hellas",
    number: "040-123456",
    id: 1
  },
  {
    name: "Ada Lovelace",
    number: "39-44-5323523",
    id: 2
  },
  {
    name: "Dan Abramov",
    number: "12-43-234345",
    id: 3
  },
  {
    name: "Mary Poppendieck",
    number: "39-23-6423122",
    id: 4
  }
];

const generateId = () => {
  return Math.floor(Math.random() * 10000);
}

app.get('/api/persons', (req, res) => {
  res.json(phonebook);
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

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id);
  const person = phonebook.find(p => p.id === id);
  if (person) {
    phonebook = phonebook.filter(p => p.id !== id);
    //console.log(`person ${person.name} was deleted`)
    res.status(204).end();
  } else {
    res.status(404).end();
  }
});

app.post('/api/persons', (req, res) => {
  const newPerson = req.body;
  if (!newPerson || !newPerson.name || !newPerson.number) {
    return res.status(400).json({ "error": "person's name or number was missing" }
    );
  }

  if (phonebook.find(p => p.name === newPerson.name)) {
    return res.status(409).json({ "error": "name must be unique" });
  }

  newPerson.id = generateId();
  phonebook = phonebook.concat(newPerson);

  res.status(201).json(newPerson);
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

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});