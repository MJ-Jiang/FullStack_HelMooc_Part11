import axios from 'axios'
const baseUrl = '/api/login'


const login = async credentials => {
  const response = await axios.post(baseUrl, credentials)
  //credentials (typically an object like { username, password })
  return response.data
}

export default { login }