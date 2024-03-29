import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null
const setToken = newToken => {
  token = `bearer ${newToken}`
}
const getAll = async () => {
  const request = axios.get(baseUrl)
  const response = await request
  return response.data
}
const create = async newObject => {
  const config = {
    headers: { Authorization: token },
  }
  const request = axios.post(baseUrl, newObject, config)
  const response = await request
  return response.data
}
const update = async (id, newObject) => {
  const request = axios.put(`${baseUrl}/${id}`, newObject)
  const response = await request
  return response.data
}

const remove = async (id, token) => {
  const config = {
    headers: { Authorization: token },
  }
  const request = axios.delete(`${baseUrl}/${id}`, config)
  console.log('Request = ', request)
  const response = await request
  return response.data
}

const exportedObject = {
  getAll, create, update, remove, setToken
}

export default exportedObject