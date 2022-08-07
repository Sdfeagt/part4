//This file defines the operations of Schema from blog.js

const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/',(request, response) =>{
    Blog.find({}).then(blogs =>{
        response.json(blogs)
    })
})

  blogsRouter.post('/', (request, response, next) =>{
    const body = request.body

    const blog = new Blog({
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes
    })

    blog.save()
    .then(savedblog =>{
        response.json(savedblog)
    })
    .catch(error => next(error))
  })

  module.exports = blogsRouter