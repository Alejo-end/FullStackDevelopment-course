import axios from "axios";

const baseUrl = 'http://localhost:3002/api/blogs' 

let token = null
const setToken = newToken => {  token = `bearer ${newToken}`}

const getAllBlogs = async () => {
  const request = await axios.get(baseUrl)
  return request.data
}

const createBlog = async newObject => {
  const config = {    
    headers: { Authorization: token },  
  }
  const response = await axios.post(baseUrl,newObject, config)
  return response.data
}

const defaultExport = { getAllBlogs,  createBlog, setToken }
export default defaultExport