const mongoose = require('mongoose')
const server = require('..')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const { initialBlogs, blogsInDb } = require('./test_helper')

beforeEach(async () => {
  await Blog.deleteMany({})
  // let noteObj = new Blog(initialBlogs[0])
  // await noteObj.save()
  // noteObj = new Blog(initialBlogs[1])
  // await noteObj.save()

  for (let blog of initialBlogs) {
    let blogObj = new Blog(blog)
    await blogObj.save()
  }
})

describe('GET all blogs', () => {
  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(initialBlogs.length)
  })

  test('a specific blog is within the returned blogs', async () => {
    const response = await api.get('/api/blogs')
    // expect(response.body[0].title).toBe('React patterns')
    const contents = response.body.map(r => r.title)
    expect(contents).toContain('Go To Statement Considered Harmful')
  })

  test('_id return like id', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body[0].id).toBeDefined()
  })
})

describe('GET one blog', () => {
  test('a specific blog can be viewed', async () => {
    const blogsAtStart = await blogsInDb()
    const blogToView = blogsAtStart[0]
    const resultBlog = await api
      .get(`/api/blogs/${blogToView.id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)
    const processedBlogToView = JSON.parse(JSON.stringify(blogToView))
    expect(resultBlog.body).toEqual(processedBlogToView)
  })
})

describe('POST blog', () => {
  test('a valid blog can be added', async () => {
    const newBlog = {
      title: 'async/await simplifies making async calls',
      author: 'Luis Quiroz',
      url: 'https://github.com/',
      likes: 15,
    }
    await api
      .post('/api/blogs')
      .set('Content-type', 'application/json')
      .set('Authorization', 'bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InJvb3QiLCJpZCI6IjYyZDVjZThkOWIxNzc5OWFiODBjYWJmNiIsImlhdCI6MTY1ODE3NDkwNX0.o6dyzUqSjz6B80G0nW9tyT4thLtNmIbaKaN8e3XL8pQ')
      .send(newBlog)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const blogs = await blogsInDb()
    expect(blogs).toHaveLength(initialBlogs.length + 1)

    const contents = blogs.map(blog => blog.title)
    expect(contents).toContain('async/await simplifies making async calls')
  })

  test('new blog without likes equal 0', async () => {
    const newBlog = {
      title: 'new blog without likes :(',
      author: 'Pedro Pony',
      url: 'https://github.com/',
    }
    await api
      .post('/api/blogs')
      .set('Content-type', 'application/json')
      .set('Authorization', 'bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InJvb3QiLCJpZCI6IjYyZDVjZThkOWIxNzc5OWFiODBjYWJmNiIsImlhdCI6MTY1ODE3NDkwNX0.o6dyzUqSjz6B80G0nW9tyT4thLtNmIbaKaN8e3XL8pQ')
      .send(newBlog)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const blogs = await blogsInDb()
    const contentLikes = blogs.find(blog => blog.title === 'new blog without likes :(')
    expect(contentLikes.likes).toBeDefined()
    expect(contentLikes.likes).toEqual(0)
  })

  test('new blog without title and url return status 400', async () => {
    const newBlog = {
      author: 'Pedro Pony',
    }
    await api
      .post('/api/blogs')
      .set('Content-type', 'application/json')
      .set('Authorization', 'bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InJvb3QiLCJpZCI6IjYyZDVjZThkOWIxNzc5OWFiODBjYWJmNiIsImlhdCI6MTY1ODE3NDkwNX0.o6dyzUqSjz6B80G0nW9tyT4thLtNmIbaKaN8e3XL8pQ')
      .send(newBlog)
      .expect(400)
  })
})

describe('DELETE one blog', () => {
  test('succeeds with status code 204 if id is valid', async () => {
    const blogs = await blogsInDb()
    const blogToDelete = blogs[0]
    console.log(blogToDelete)
    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Content-type', 'application/json')
      .set('Authorization', 'bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InJvb3QiLCJpZCI6IjYyZDVjZThkOWIxNzc5OWFiODBjYWJmNiIsImlhdCI6MTY1ODE3NDkwNX0.o6dyzUqSjz6B80G0nW9tyT4thLtNmIbaKaN8e3XL8pQ')
      .expect(204)

    const blogsAtEnd = await blogsInDb()

    expect(blogsAtEnd).toHaveLength(initialBlogs.length - 1)

    const titles = blogsAtEnd.map(blog => blog.title)
    expect(titles).not.toContain(blogToDelete.title)
  })
})

describe('UPDATE', () => {
  test('one blog with 100 likes', async () => {
    const blogs = await blogsInDb()
    const blogToUpdate = blogs[0]
    const updateBlog = {
      likes: 100
    }
    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(updateBlog)
      .expect(200)

    const blogsAtEnd = await blogsInDb()
    expect(blogsAtEnd[0].likes).toEqual(100)
  })
})

afterAll(async () => {
  server.close()
  await mongoose.disconnect()
})