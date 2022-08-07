const listHelper = require('../utils/list_helper')

test('dummy returns one', () => {
  const blogs = []

  const result = listHelper.dummy(blogs)
  expect(result).toBe(1)
})

describe('total likes', () => {
  const listWithOneBlog = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 5,
      __v: 0
    }
  ]

  test('when list has only one blog, equals the likes of that', () => {
    const result = listHelper.totalLikes(listWithOneBlog)
    expect(result).toBe(5)
  })
})

describe('Most liked', () =>{
  const listWithtwoBlog = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 5,
      __v: 0
    },
    {
      _id: 'somethingidk',
      title: 'Oh look, a bird!',
      author: 'My dog, Felo',
      url: 'Wedonthavethemoneyforthat.com',
      likes: 50,
      __v: 0
    }
  ]

  test('Should be obj with 50 likes', () =>{
    const result = listHelper.favoriteBlog(listWithtwoBlog)
    expect(result).toStrictEqual(    {
      _id: 'somethingidk',
      title: 'Oh look, a bird!',
      author: 'My dog, Felo',
      url: 'Wedonthavethemoneyforthat.com',
      likes: 50,
      __v: 0
    })
  })
})