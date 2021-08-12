const mongoose = require('mongoose');

if (process.argv.length === 5) {
    const [tmp, tmp1, password, name, number] = process.argv;
    const Person = connectMongo(password);
    const person = new Person({ name, number });
    person.save().then(() => {
        console.log(`Added ${name} number ${number} to phonebook`);
        mongoose.connection.close();
    })

} else if (process.argv.length === 3) {
    const Person = connectMongo(process.argv[2]);
    Person.find({}).then(persons => {
        console.log('Phonebook:')
        persons.forEach(p => {
            console.log(`${p.name} ${p.number}`)
        })
        mongoose.connection.close()
    })
} else {
    console.log('Invalid parameters');
    console.log('to add person: node mongo.js [password] [person name] [number]');
    console.log('to list phonebook: node mongo.js [password]');
    process.exit(1);
}

function connectMongo(password) {
    const url = `mongodb+srv://fullstack_user:${password}@cluster0.sxo8f.mongodb.net/phonebook?retryWrites=true&w=majority`;
    mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true });

    const personSchema = mongoose.Schema({
        name: String,
        number: String
    });

    const Person = mongoose.model('Person', personSchema);

    return Person;
}
