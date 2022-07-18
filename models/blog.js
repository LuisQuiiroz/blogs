const mongoose = require('mongoose')

// Schema
const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  author: String,
  url: {
    type: String,
    required: true
  },
  likes: Number,
  date: Date,
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
})

// formatea los datos (visualmente) de mongoDB.
blogSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})
const Blog = mongoose.model('Blog', blogSchema)

module.exports = Blog

