import { useState, useEffect } from 'react'
import blogService from "./services/blogs.js"

const Post = ({ post }) => {
  return (
    <div>
      <p>{post.title} {post.author} {post.url} {post.likes}</p>
    </div>
  )
}

const CreateBlogForm = () => {
  return (
    <form onSubmit={() => { }}>
      <div>
        Title: <input onChange={() => { }} value={""} />
      </div>
      <div>
        Author: <input onChange={() => { }} value={""} />
      </div>
      <div>
        Url: <input onChange={() => { }} value={""} />
      </div>
      <div>
        <button type="submit">Add Blog</button>
      </div>
    </form>
  )
}

function App() {
  const [blogs, setBlogs] = useState([])

  useEffect(() => {
    blogService.getAllBlogs().then(data => {
      setBlogs(data)
    })
  }, [])

  return (
    <>
      <CreateBlogForm />
      {blogs.map(blog => <Post key={blog._id} post={blog} />)}
    </>
  );
}

export default App;