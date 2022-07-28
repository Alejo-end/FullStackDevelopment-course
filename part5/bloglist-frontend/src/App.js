import { useState, useEffect, useRef } from 'react'
import blogService from './services/blogs'
import authService from './services/auth'
import CreateBlogForm from './components/CreateBlogForm'
import AuthForm from './components/AuthForm'
import Blog from './components/Blog'
import Alert from './components/Alert'
import Toggle from './components/Toggle'


function App() {
  const [blogs, setBlogs] = useState([])
  const [username, setNewUsername] = useState('')
  const [password, setNewPassword] = useState('')
  const [user, setUser] = useState(null)
  const [message, setMessage] = useState(null)
  const [color, setColor] = useState(null)

  const blogFormRef = useRef()

  useEffect(() => {
    const getAllBlogs = async () => {
      const allBlogs = await blogService.getAllBlogs()
      setBlogs(allBlogs.sort((a,b) => b.likes - a.likes))
    }
    getAllBlogs()
  }, [])

  useEffect(() => {
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

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await authService.auth({ username, password })
      window.localStorage.setItem('blogUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      setMessage('Successfully logged in')
      setColor('green')
      setTimeout(() => {
        setMessage(null)
      }, 3000)
    }
    catch(error) {
      setMessage('Wrong username or password')
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

  const addBlog = async (createdBlog) => {
    blogFormRef.current.toggleVisibility()
    try {
      const newBlog = await blogService.createBlog(createdBlog)
      const concBlogs = (blogs.concat(newBlog))
      setBlogs(concBlogs.sort((a,b) => b.likes - a.likes))
      setColor('green')
      setMessage('Successfully added new blog')
      setTimeout(() => {
        setMessage(null)
      }, 3000)
    }
    catch(error) {
      setColor('red')
      setMessage('Failed to add blog, please try again')
      setTimeout(() => {
        setMessage(null)
      }, 3000)
    }
  }

  const updateBlog = async (createdBlog) => { //updates likes
    try {
      const newBlog = await blogService.update(createdBlog.id, createdBlog)
      const mapBlogs = blogs.map(blog => blog.id === createdBlog.id ? newBlog : blog)
      setBlogs(mapBlogs.sort((a,b) => b.likes - a.likes))
      setColor('green')
      setMessage('Successfully liked')
      setTimeout(() => {
        setMessage(null)
      }, 3000)
    }
    catch(error) {
      setColor('red')
      setMessage('Failed to like, please try again')
      setTimeout(() => {
        setMessage(null)
      }, 3000)
    }
  }

  const deleteBlog = async (id) => { //updates likes
    try {
      if(window.confirm('Are you sure you want to delete this blog?')) {
        await blogService.deleteBlog(id)
        const mapBlogs = blogs.filter(blog => blog.id !== id)
        setBlogs(mapBlogs.sort((a,b) => b.likes - a.likes))
        setColor('green')
        setMessage('Successfully deleted')
        setTimeout(() => {
          setMessage(null)
        }, 3000)
      }
    }
    catch(error) {
      setColor('red')
      setMessage('Failed to delete, please try again')
      setTimeout(() => {
        setMessage(null)
      }, 3000)
    }
  }

  return (
    <>
      {user === null ?
        <>
          <h1>Login to App</h1>
          <Alert text={message} color={color} />
          <AuthForm submitFunc={handleLogin} username={username} password={password} usernameFunc={handleNameChange} passwordFunc={handlePasswordChange} buttonDesc="Login" />
        </>
        :
        <>
          <h2>Blogs</h2>
          <Alert text={message} color={color}  />
          <p> {user.name} logged in <button onClick={handleLogout}>Logout</button> </p>
          <h2>Create New Blog</h2>
          <Toggle buttonLabel="Create Blog" ref={blogFormRef}>
            <CreateBlogForm addBlog={addBlog} />
          </Toggle>
          {blogs.map(blog =>
            <Blog key={blog.id} blog={blog} updateBlog={updateBlog} person={user} delFunc={deleteBlog} />
          )}
        </>
      }
    </>
  )
}

export default App
