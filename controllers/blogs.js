const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const { SECRET } = require('../utils/config')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({}).populate('userId', { username: 1, name: 1 })
  response.json(blogs)
})

blogsRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  if (blog) {
    response.json(blog)
  } else {
    response.status(400).send({ error: 'id does not exist' })
  }
})

blogsRouter.post('/', async (request, response) => {
  const { body, token } = request

  const decodedToken = jwt.verify(token, SECRET)
  if (!token || !decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }
  const user = await User.findById(decodedToken.id)

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
    date: new Date(),
    userId: user._id
  })
  const saveBlog = await blog.save()
  user.blogs = user.blogs.concat(saveBlog._id)
  await user.save()
  response.json(saveBlog)
})

blogsRouter.delete('/:id', async (request, response) => {
  const { id: idToDelete } = request.params
  const { token } = request
  const decodedToken = jwt.verify(token, SECRET)
  if (!token || !decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }

  const blog = await Blog.findById(idToDelete)
  const user = await User.findById(decodedToken.id)
  if ((blog === null) || (blog.userId.toString() !== user._id.toString())) {
    return response.status(401).json({ error: 'blog does not exist' })
  }

  await Blog.findByIdAndDelete(idToDelete)
  response.status(204).end()
})

blogsRouter.put('/:id', async (request, response) => {
  const { id } = request.params
  const { body } = request
  const updateBlog = {
    likes: body.likes
  }
  const updatedBlog = await Blog.findByIdAndUpdate(id, updateBlog, { new: true })
  // { new: true } - Return the updated object
  // { new: false } - Return the obtained object - Default
  response.json(updatedBlog)
})

// info blogs

module.exports = blogsRouter