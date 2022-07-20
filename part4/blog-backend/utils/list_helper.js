const dummy = () => {
    return 1
}

const totalLikes = (blogs) => {
    const reducer = (sum, item) => {
        return sum + item.likes
    }

    return blogs.length === 0 ? 0 : blogs.reduce(reducer, 0)
}

const favouriteBlog = (blogs) => {
    let fav = blogs.reduce((sum, item) => {
        return sum.likes > item.likes ? sum : item
    })

    return [fav.title, fav.author, fav.likes]
}

module.exports = {
    dummy,
    totalLikes,
    favouriteBlog
}