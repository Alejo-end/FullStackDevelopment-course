import React, { useState } from 'react'
import PropTypes from 'prop-types'

const Blog = ({ blog, updateBlog, person, delFunc }) => {
  const [visible, setVisible] = useState(false)
  const allowedAdminAcess = blog.person.username === person.username ? true : false

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  const hidden = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
    display: visible ? 'none' : ''
  }

  const shown = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
    display: visible ? '' : 'none'
  }

  const showDelete = {
    display: allowedAdminAcess ? '' : 'none'
  }

  const upvoteBlog = () => {
    const newBlog = {
      username: blog.person.username,
      id: blog.id,
      title: blog.title,
      author: blog.author,
      url: blog.url,
      likes: blog.likes + 1,
    }
    updateBlog(newBlog)
  }
  return (
    <div>
      <div style={hidden}>
        {blog.title} {blog.author} <button onClick={toggleVisibility}>View details</button>
      </div>
      <div style={shown}>
        {blog.title} {blog.author} <button onClick={toggleVisibility}>Hide details</button>
        <br></br>
        {blog.url}
        <br></br>
                likes {blog.likes} <button onClick={upvoteBlog}>Like</button>
        <br></br>
        <button style={showDelete} onClick={() => delFunc(blog.id)} >Delete</button>
      </div>
    </div>
  )
}

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  updateBlog: PropTypes.func.isRequired,
  username: PropTypes.object.isRequired,
  delFunc: PropTypes.func.isRequired
}

export default Blog