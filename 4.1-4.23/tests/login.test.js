const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const helper = require('./test_helper')
const User = require('../models/user')

describe('Tests are done with one pre-existing user', () =>{


beforeEach(async () => {
    await User.deleteMany({})

    const user = new User ({
        username: "rest",
        name: "foo",
        password: "bar"
    })
    await user.save()
})

test('New user is successfully added', async () =>{
    const usersfromDb = await helper.usersInDb()

    const newUser = {
      username: 'This is',
      name: 'Aname',
      password: 'easyyyyyy',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const response = await helper.usersInDb()
    expect(response.length).toBe(usersfromDb.length + 1)
})

test('User without username will not be added', async () =>{

    const usersfromDb = await helper.usersInDb()

    const newUser = {
      name: 'Mocium panie',
      password: 'waniepranie',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const response = await helper.usersInDb()
    expect(response.length).toBe(usersfromDb.length)
    
})

test('User without password will not be added', async () =>{
    
    const usersfromDb = await helper.usersInDb()

    const newUser = {
      username: 'f#0000',
      name: 'pikatchu.png',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const response = await helper.usersInDb()
    expect(response.length).toBe(usersfromDb.length)
    
})

test('User with too short username wont be added', async () =>{
    const usersfromDb = await helper.usersInDb()

    const newUser = {
      username: '12',
      name: 'GRYB',
      password: 'easyy123yyyy',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const response = await helper.usersInDb()
    expect(response.length).toBe(usersfromDb.length)
    })

    test('User with too short password wont be added', async () =>{
        const usersfromDb = await helper.usersInDb()
    
        const newUser = {
          username: '122233344',
          name: 'Fffff',
          password: 's',
        }
    
        await api
          .post('/api/users')
          .send(newUser)
          .expect(400) 
          .expect('Content-Type', /application\/json/)
    
        const response = await helper.usersInDb()
        expect(response.length).toBe(usersfromDb.length)
        })

test('User with existing username wont be added', async () =>{
    const usersfromDb = await helper.usersInDb()

    const newUser = {
      username: 'rest',
      name: 'GRYB',
      password: 'easyy123yyyy',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const response = await helper.usersInDb()
    expect(response.length).toBe(usersfromDb.length)
    })

})

    afterAll(() => {
        mongoose.connection.close()
      }) 

    
    
    