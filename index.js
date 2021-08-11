const express = require('express');

const app = express();

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


app.get('/api/persons', (req, res) => {
  console.log('/api/persons');
  res.json(phonebook);
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
  console.log(`Server running on port ${PORT}`)
});