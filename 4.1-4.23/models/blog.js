//This file defines what a blog is (creates a schema)

const mongoose = require('mongoose')

const blogSchema = new mongoose.Schema({
    title: String,
    author: String,
    url: String,
    likes: Number
  })

  blogSchema.set('toJson', {
    transform: (document, returnedObject) =>{
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject._v
    }
  })

  module.exports = mongoose.model('Blog', blogSchema)