const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const helper = require('./test_helper')
const Blog = require('../models/blog')
const User = require('../models/user')
const bcrypt = require('bcrypt')
const { error } = require('../utils/logger')


beforeEach(async () => {
  await Blog.deleteMany({})



  const blogObjects = helper.initialBlogs
    .map(blog => new Blog(blog))
  const promiseArray = blogObjects.map(blog => blog.save())
  await Promise.all(promiseArray)

  await User.deleteMany({})
  const master = new User({
    username: "root123",
    passwordHash: await bcrypt.hash('toor', 10)
  })
  console.log(master.passwordHash);
  await master.save()
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
    const userresponse = await api.post('/api/login').send({username: "root123", password: "toor"})
    console.log(userresponse.body.token)
    await api
      .post('/api/blogs')
      .set('Authorization', `bearer ${userresponse.body.token}`)
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

  test('likes default to 0 if they are not defined', async () => {
    const newBlog = {
      title: 'How to kill your ex',
      author: 'John T Roosevelt',
      url: 'voggov.com'
    }
    const user = await api.post('/api/login').send({ username: 'root123', password: 'toor' })

    await api
      .post('/api/blogs')
      .set('Authorization', `bearer ${user.body.token}`)
      .send(newBlog)
      .expect(201)
  
    const response = await helper.blogsInDb()
    const lookedfor = response[response.length-1]
    expect(lookedfor.likes).toBe(0)
  })

  test('a specific blog can be viewed using id', async () => {
    const blogsAtStart = await helper.blogsInDb()
  
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

  test('increment likes by 1', async () => {
    const blogs = await helper.blogsInDb()
    const Blog = blogs[0]
    const updatedBlog = {
      title: Blog.title,
      author: Blog.author,
      url: Blog.url,
      likes: Blog.likes
    }
    await
     api.put(`/api/blogs/${Blog.id}`)
     .send(updatedBlog)
     .expect(200)

    const update = await helper.blogsInDb()
    const BlogUpdated = update[0]

    expect(BlogUpdated.likes).toBe(Blog.likes + 1)
  })

afterAll(() => {
  mongoose.connection.close()
})