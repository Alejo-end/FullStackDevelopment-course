import axios from 'axios'
const url = '/api/persons'

const getAllPersons = () => {
    const request = axios.get(url)
    return request.then(response => response.data)
}

const createPerson = newPerson => {
    const request = axios.post(url, newPerson)
    return request.then(response => response.data)
}

const updatePerson = (id, newPerson) => {
    const request = axios.put(`${url}/${id}`, newPerson)
    return request.then(response => response.data)
}

const deletePerson = (id) => {
    const request = axios.delete(`${url}/${id}`)
    return request.then(response => response.data)
}

const server = { getAllPersons, createPerson, updatePerson, deletePerson }
export default server