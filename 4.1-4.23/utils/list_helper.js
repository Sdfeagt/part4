const blog = require("../models/blog");

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) =>{
  const likesarray = blogs.map(bloglikes => bloglikes.likes)

const initialValue = 0;
const sumWithInitial = likesarray.reduce(
  (previousValue, currentValue) => previousValue + currentValue, initialValue)

  return sumWithInitial
}

const favoriteBlog = (blogs) =>{
  const likesarray = blogs.map(bloglikes => bloglikes.likes)
  const max = Math.max(...likesarray)
  console.log("From test function: ", likesarray);
  console.log("From test function: ", max);

  const found = blogs.find(blog =>{
    return blog.likes === max
  });
  console.log("From test function: ", found);

  return found

}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog
}