import axios from 'axios'

const baseUrl = 'http://localhost:3002/api/auth'

const auth = async credentials => {
    const response = await axios.post(baseUrl, credentials)
    return response.data
}
const defaultExport = { auth }
export default defaultExport