const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

//set datbase url using env variable.
const uri = process.env.MONGODB_URI

console.log('connecting to', uri)

//Connection
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
}).then(() => {
  console.log('connected to MongoDB')
})
  .catch(err => {
    console.log('error connecting to MongoDB', err.message)
  })

//Create Schema
const personSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true, minLength: 3 },
  phone: { type: String, required: true, unique: true, minLength: 8 }
})

personSchema.plugin(uniqueValidator)

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})
//Create and export Model
module.exports = mongoose.model('Person', personSchema)


