import axios from 'axios'
const baseUrl = '/api/users'

const getAll = async () => {
    const request = axios.get(baseUrl)
    const response = await request
    return response.data
}
//const create = async (newObject) => {
//const config = {
//headers: { Authorization: token },
//}
//const request = axios.post(baseUrl, newObject, config)
//const response = await request
//return response.data
//}

const userService = {
    getAll,
}

export default userService
