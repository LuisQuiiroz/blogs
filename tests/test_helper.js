const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
  {
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
    id: '5a422a851b54a676234d17f7',
    userId: '62d5ce8d9b17799ab80cabf6'
  },
  {
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
    id: '5a422aa71b54a676234d17f8',
    userId: '62d5ce8d9b17799ab80cabf6'
  }
]

const nonExistingId = async () => {
  const newBlog = new Blog({
    title: 'async/await simplifies making async calls',
    author: 'Luis Quiroz',
    url: 'https://github.com/',
    likes: 15,
  })
  await newBlog.save()
  await newBlog.remove()

  return newBlog._id.toString()
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(user => user.toJSON())
}

module.exports = {
  initialBlogs,
  nonExistingId,
  blogsInDb,
  usersInDb
}