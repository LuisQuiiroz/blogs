const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response, next) => {
  const blogs = await Blog.find({})
  try {
    response.json(blogs)
  } catch (error) {
    next(error)
  }
})

blogsRouter.get('/:id', async (request, response, next) => {
  try {
    const blog = await Blog.findById(request.params.id)
    if (blog) {
      response.json(blog)
    } else {
      response.status(400).send({ error: 'id does not exist' })
    }
  } catch (error) {
    next(error)
  }
})

blogsRouter.post('/', async (request, response, next) => {
  const body = request.body
  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0
  })
  try {
    const saveNote = await blog.save()
    response.json(saveNote)
  } catch (error) {
    next(error)
  }
})

blogsRouter.delete('/:id', async (request, response, next) => {
  try {
    await Blog.findByIdAndDelete(request.params.id)
    response.status(204).end()
  } catch (error) {
    next(error)
  }

})

blogsRouter.put('/:id', async (request, response, next) => {
  const { id } = request.params
  const { body } = request
  const updateBlog = {
    likes: body.likes
  }
  try {
    const updatedBlog = await Blog.findByIdAndUpdate(id, updateBlog, { new: true })
    // { new: true } - Return the updated object
    // { new: false } - Return the obtained object - Default
    response.json(updatedBlog)
  } catch (error) {
    next(error)
  }
})

// info blogs

module.exports = blogsRouter