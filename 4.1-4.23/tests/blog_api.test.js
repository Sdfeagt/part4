const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const helper = require('./test_helper')
const Blog = require('../models/blog')

beforeEach(async () => {
  await Blog.deleteMany({})

  const blogObjects = helper.initialBlogs
    .map(blog => new Blog(blog))
  const promiseArray = blogObjects.map(blog => blog.save())
  await Promise.all(promiseArray)
})
  

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
}, 100000)
  
  test('a specific blog is within the returned blogs', async () => {
    const response = await api.get('/api/blogs')
  
    const contents = response.body.map(r => r.title)
    expect(contents).toContain(
      'Oh look, a bird!'
    )
  })
  test('a valid blog can be added', async () => {
    const newBlog = {
      title: 'How to kill your ex',
      author: 'John T Roosevelt',
      url: 'voggov.com',
      likes: 5000,
    }
  
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)
  
    const response = await helper.blogsInDb()
  
    const contents = response.map(r => r.title)
  
    expect(response).toHaveLength(helper.initialBlogs.length + 1)
    expect(contents).toContain(
      'How to kill your ex'
    )
  })

  test('blikes default to 0 if they are not defined', async () => {
    const newBlog = {
      title: 'How to kill your ex',
      author: 'John T Roosevelt',
      url: 'voggov.com'
    }
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
  
    const response = await helper.blogsInDb()
    const lookedfor = response[response.length-1]
    expect(lookedfor.likes).toBe(0)
  })

  test('a specific blog can be viewed using id', async () => {
    const blogsAtStart = await helper.blogsInDb()
    console.log(blogsAtStart);
  
    const blogToView = blogsAtStart[0]
  
    const resultBlog = await api
      .get(`/api/blogs/${blogToView.id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)
  
    const processedBlogToView = JSON.parse(JSON.stringify(blogToView))
  
    expect(resultBlog.body).toEqual(processedBlogToView)
  },)

  
  test('Blog without url will not be added', async () => {
    //Validation error occurs before data is sent, therefore Bad Request cannot be achieved
    const BlognotURL = {
      title: 'How to kill your ex',
      author: 'John T Roosevelt',
    }

    expect(t).toThrow(ValidationError)
  
    
    await api
    .post('/api/blogs')
    .send(BlognotURL)
    .expect(400)

  })

  test('Blog without title will not be added', async () => {
        //Validation error occurs before data is sent, therefore Bad Request cannot be achieved

    const newBlog = {
      author: 'John T Roosevelt',
      url: 'lonelyisland.io',
    }

    await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)

  })
  
  test('a blog can be deleted', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]
  
    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .expect(204)
   
    const blogsAtEnd = await helper.blogsInDb()
  
    expect(blogsAtEnd).toHaveLength(
      helper.initialBlogs.length - 1
    )
  
    const contents = blogsAtEnd.map(r => r.title)
  
    expect(contents).not.toContain(blogToDelete.title)
  })

afterAll(() => {
  mongoose.connection.close()
})