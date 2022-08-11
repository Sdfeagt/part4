//This file defines the operations of Schema from blog.js

const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')



blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({}).populate('user', { username: 1, name: 1 })

  response.json(blogs)
});

  blogsRouter.post('/', async (request, response) =>{
    const body = request.body

    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    if (!decodedToken.id) {
      return response.status(401).json({ error: 'token missing or invalid' })
    }
    const user = request.user


    const blog = new Blog({
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes,
        user: user._id
    })
      const savedBlog = await blog.save()
      user.blogs = user.blogs.concat(savedBlog._id)
      await user.save()
      
      response.status(201).json(savedBlog)
  })

  blogsRouter.get('/:id', async (request, response) => {
      const blog = await Blog.findById(request.params.id)
      if (blog) {
        response.json(blog)
      } else {
        response.status(404).end()
      }
  })
  
  blogsRouter.delete('/:id', async (request, response) => {
    const decodedToken = jwt.verify(request.token, process.env.SECRET)

    if (decodedToken === undefined){
      response.status(404).json({error: "Missing Token!"})
    }

    if(decodedToken.id.toString() === request.user.toString()){
      await Blog.findByIdAndRemove(request.params.id)
      response.status(204).end()
    }
    else{
      response.status(412).json({error: "Invalid token!"})
    }

  })

  blogsRouter.put('/:id', async (request, response) => {
    const body = request.body
    const updatedBlog = {
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes + 1
    }
    const newBlog = await Blog.findByIdAndUpdate( request.params.id, updatedBlog, { new: true })
    const responseType = newBlog ? 200 : 404
    response.status(responseType).json(newBlog)
  })

  module.exports = blogsRouter