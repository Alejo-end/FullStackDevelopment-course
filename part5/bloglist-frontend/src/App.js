import { useState, useEffect } from 'react'
import blogService from "./services/blogs.js"
import authService from "./services/auth.js"
import AuthForm from './components/AuthForm.jsx'
import Blog from './components/Blog.jsx'
import CreateBlogForm from './components/CreateBlogForm.jsx'
import Alert from './components/Alert.jsx'


function App() {
  const [blogs, setBlogs] = useState([])
  const [username, setNewUsername] = useState('')
  const [password, setNewPassword] = useState('')
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')
  const [user, setUser] = useState(null)
  const [message, setMessage] = useState(null)
  const [color, setColor] = useState(null)

  useEffect(() => {
    blogService.getAllBlogs().then(data => {
      setBlogs(data)
    })
  }, [])

  useEffect(() => { //as given in the tutorial in part 5
    const loggedUserJSON = window.localStorage.getItem('blogUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleNameChange = (event) => {
    setNewUsername(event.target.value)
  }

  const handlePasswordChange = (event) => {
    setNewPassword(event.target.value)
  }

  const handleTitleChange = (event) => {
    setTitle(event.target.value)
  }

  const handleAuthorChange = (event) => {
    setAuthor(event.target.value)
  }

  const handleUrlChange = (event) => {
    setUrl(event.target.value)
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await authService.auth({ username, password })
      window.localStorage.setItem('blogUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      setMessage(`Successfully logged in`)
      setColor('green')
      setTimeout(() => {
        setMessage(null)
      }, 3000)
    }
    catch {
      setMessage(`Wrong username or password`)
      setColor('red')
      setTimeout(() => {
        setMessage(null)
      }, 3000)
    }
    setNewUsername('')
    setNewPassword('')
  }

  const handleLogout = () => {
    window.localStorage.clear()
    setUser(null)
  }

  const addBlog = async (event) => {
    event.preventDefault()
    const blog = {
      title: title,
      author: author,
      url: url,
    }
    try {
      const newBlog = await blogService.createBlog(blog)
      setBlogs(blogs.concat(newBlog))
      setMessage(`Successfully added new blog`)
      setColor('green')
      setTimeout(() => {
        setMessage(null)
      }, 3000)
    }
    catch {
      setMessage(`Failed to add blog, please try again`)
      setColor('red')
      setTimeout(() => {
        setMessage(null)
      }, 3000)
    }
    setTitle('')
    setAuthor('')
    setUrl('')
  }


  return (
    <>
      {user === null ?
        <>
          <h1>Login to App</h1>
          <Alert message={message} color={color} />
          <AuthForm submitFunc={handleLogin} username={username} password={password} usernameFunc={handleNameChange} passwordFunc={handlePasswordChange} buttonDesc="Login" /></> :
        <>
          <h2>Blogs</h2>
          <Alert message={message} />
          <p> {user.name} logged in <button onClick={handleLogout}>logout</button> </p>
          <h2>Create new blog</h2>
          <CreateBlogForm submitFunc={addBlog} inputTitleValue={title} inputTitleChangeFunc={handleTitleChange} inputAuthorValue={author} inputAuthorChangeFunc={handleAuthorChange} inputUrlValue={url} inputUrlChangeFunc={handleUrlChange} />
          {blogs.map(blog => <Blog key={blog.id} blog={blog} />)}
        </>
      }
    </>
  )
}

export default App;
