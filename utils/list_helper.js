const dummy = (blogs) => {
  return blogs.length + 1
}

const totalLikes = (blogs) => {
  const likes = blogs.map(blog => blog.likes).reduce((acc, item) => acc + item, 0)
  return likes
}

const favoriteBlog = (blogs) => {
  const likes = blogs.map(blog => blog.likes)
  const maxLikes = Math.max(...likes)
  const favorite = blogs.find(blog => blog.likes === maxLikes)
  return favorite
}

// const mostBlogs = (blogs) => {
//   // const search = blogs.reduce((acc, blog) => ({
//   //   ...acc,
//   //   [blog.author]: ++acc[blog.author] || 1
//   // }), {})
//   // console.log(search)

//   const search = blogs.reduce((acc, blog) => {
//     acc[blog.author] = ++acc[blog.author] || 1
//     return acc
//   }, {})

//   const duplicates = blogs.filter(blog => {
//     return search[blog.author]
//   })
//   console.log(search)
//   console.log(duplicates)
//   return search
// }

module.exports = {
  dummy, totalLikes, favoriteBlog
}