import axios from 'axios'
const baseUrl = '/api/blogs'
let token=null
const setToken=newToken => {
  token=`Bearer ${newToken}`
}
//Used to set the token after successful login. This token will be included in the POST / PUT request for identity authentication.
const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}
const create=async newObject => {
  //console.log('newObject:', newObject)
  const config={
    headers: { Authorization: token },
  }
  //The backend can only determine whether you have permission to create a blog after seeing the token
  const response=await axios.post(baseUrl,newObject,config)
  return response.data
}
const update=(id,newObject) => {
  const request=axios.put(`${ baseUrl }/${id}`, newObject)
  return request.then(response => response.data)
}
const remove = (id) => {
  const config = {
    headers: { Authorization: token }
  }
  return axios.delete(`${baseUrl}/${id}`, config)
}

export default { getAll,create,update,setToken,remove }