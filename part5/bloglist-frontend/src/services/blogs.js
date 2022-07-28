import axios from "axios"
const URL = "/api/blogs"

const getAllBlogs = () => {
  const request = axios.get(URL)
  return request.then(response => response.data)
}

const createBlog = newObject => {
  const request = axios.post(URL, newObject)
  return request.then(response => response.data)
}

const deleteBlog = id => {
  const request = axios.delete(`${URL}/${id}`)
  return request.then(response => response.data)
}

const updateBlog = (id, newObject) => {
  const request = axios.put(`${URL}/${id}`, newObject)
  return request.then(response => response.data)
}

// eslint-disable-next-line
export default { createBlog, getAllBlogs, deleteBlog, updateBlog }