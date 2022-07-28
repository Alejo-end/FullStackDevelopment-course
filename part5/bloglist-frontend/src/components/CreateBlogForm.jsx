import { useState } from 'react'

const CreateBlogForm = ({ addBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const handleTitleChange = (event) => {
    setTitle(event.target.value)
  }

  const handleAuthorChange = (event) => {
    setAuthor(event.target.value)
  }

  const handleUrlChange = (event) => {
    setUrl(event.target.value)
  }

  const createBlog = (event) => {
    event.preventDefault()
    const blog = {
      title: title,
      author: author,
      url: url,
    }
    addBlog(blog)
    setTitle('')
    setAuthor('')
    setUrl('')
  }


  return (
    <form onSubmit={createBlog}>
      <div>
                Title: <input value={title} onChange={handleTitleChange} />
        <br></br>
                Author: <input value={author} onChange={handleAuthorChange} />
        <br></br>
                URL: <input value={url} onChange={handleUrlChange} />
      </div>
      <div>
        <button type="submit">Create Blog</button>
      </div>
    </form>
  )
}

export default CreateBlogForm