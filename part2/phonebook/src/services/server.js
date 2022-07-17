import axios from 'axios'
const url = 'https://backend-fullstackcourse.herokuapp.com'

//as instructed in 2.16, similar as what was shown in the example. Due to a react warning I assigned the default exports to a variable first.
const getAllPersons = async () => {
    const request = axios.get(url + '/api/persons')
    const response = await request
    return response.data
}

const createPerson = async newPerson => {
    const request = axios.post(url + '/api/persons', newPerson)
    const response = await request
    return response.data
}

const updatePerson = async (id, newPerson) => {
    const request = axios.put(`${url} + '/api/persons/' + ${id}`, newPerson)
    const response = await request
    return response.data
}

const deletePerson = async (id) => {
    const request = axios.delete(`${url} + '/api/persons/' + ${id}`)
    const response = await request
    return response.data
}

const server = { getAllPersons, createPerson, updatePerson, deletePerson }
export default server