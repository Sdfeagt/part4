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

module.exports = {
  dummy,
  totalLikes
}