import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null
const setToken = (newToken) => {
    token = `bearer ${newToken}`
}
const getAll = async () => {
    const request = axios.get(baseUrl)
    const response = await request
    return response.data
}

const getManyBlogs = async (ids) => {
    try {
        let url = `${baseUrl}/fetchByIds?ids=${ids.join(',')}`
        console.log('About to fetch blogs ... ')
        const response = await axios.get(url)
        return response.data
    } catch (error) {
        console.error('Error fetching blogs:', error)
    }
}

const getComments = async (blogId) => {
    try {
        let url = `${baseUrl}/${blogId}/comments`
        console.log('About to fetch comments... ')
        const response = await axios.get(url)
        return response.data
    } catch (error) {
        console.log('Error fetching comments: ', error)
    }
}

const addComment = async (blogId, comment) => {
    try {
        console.log('BlogId: ', blogId)
        console.log('Comment in addComment: ', comment)
        let url = `${baseUrl}/${blogId}/comments`
        const response = await axios.post(url, comment)
        return response.data
    } catch (error) {
        console.log('Error adding comment: ', error)
    }
}

const getSentiment = async (comment) => {
    try {
        console.log('Comment inside getSentiment: ', comment)
        let url = '/api/sentiment'
        const response = await axios.post(url, comment)
        return response.data
    } catch (error) {
        console.log('Error getting comment sentiment', error)
    }
}

const create = async (newObject) => {
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

const blogsService = {
    getAll,
    getManyBlogs,
    create,
    update,
    remove,
    setToken,
    getComments,
    addComment,
    getSentiment,
}

export default blogsService
