const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>')
  process.exit(1)
}

//Setting command line variables
const password = process.argv[2]
const name = process.argv[3]
const phone = process.argv[4]


const url = `mongodb+srv://fullstack:${password}@cluster0.le3uu.mongodb.net/person-app?retryWrites=true&w=majority`

//Connection
mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
})

//Create Schema
const personSchema = new mongoose.Schema({
  name: String,
  id: Number,
  phone: String
})

//Create Model
const Person = mongoose.model('Person', personSchema)

if(process.argv.length === 3){
  Person.find({}).then(result => {
    console.log('phonebook:')
    result.forEach(p => {
      console.log(p.name, p.phone)
    })
    mongoose.connection.close()
  })

}else {
  const person = new Person({
    name: name,
    id: Math.floor(Math.random()*1000000),
    phone: phone
  })
  person.save().then(() => {
    console.log(`Added ${name} number ${phone} to phonebook.`)
    mongoose.connection.close()
  })
}
