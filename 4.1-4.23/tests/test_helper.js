const Blog = require('../models/blog')

const initialBlogs = [
    {
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 5,
    },
    {
      title: 'Oh look, a bird!',
      author: 'My dog, Felo',
      url: 'Wedonthavethemoneyforthat.com',
      likes: 50,
    }
  ]

const nonExistingId = async () => {
  const blog = new Blog({title: 'To be removed', author: 'To be removed', url: 'non.pl', likes: 4})
  await blog.save()
  await blog.remove()

  return blog._id.toString()
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

module.exports = {
  initialBlogs, nonExistingId, blogsInDb
}