import { useState, useEffect,useRef } from 'react'
import Blog from './components/Blog'
import loginService from './services/login'
import Notification from './components/Notification'
import blogService from './services/blogs'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const[message,setMessage]=useState(null)
  const blogFormRef=useRef()
  //offers a reference to the component.

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])
  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )
  }, [])
  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username, password,
      })

      window.localStorage.setItem(
        'loggedBlogappUser',JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
      //If the login is successful, the form fields are emptied and the server response (including a token and the user details) is saved to the user field of the application's state.
    } catch (exception) {
      setMessage({ text:'Wrong username or password',type:'error' })
      setTimeout(() => {setMessage(null)},5000)
    }
  }
  const handleLogout=async(event) => {
    event.preventDefault()
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
  }

  if(user===null){
    return(
      <div>
        <Notification message={message} />
        <LoginForm
          username={username}
          password={password}
          handleLogin={handleLogin}
          setUsername={setUsername}
          setPassword={setPassword}
        />
      </div>
    )
  }
  return(
    <div>
      <Notification message={message} />
      <h2>blogs</h2>
      <div >
        <p style={{ display: 'inline', marginRight: '10px'  }}>{user.username} logged-in</p>
        <button className='button' onClick={handleLogout} aria-label="logout-button" >log out</button>
      </div>
      <Togglable buttonLabel="Create New Blog" ref={blogFormRef}>
        <BlogForm
          blogs={blogs}
          setBlogs={setBlogs}
          setMessage={setMessage}
        />
      </Togglable>

      {
        [...blogs]
          .sort((a,b) => b.likes-a.likes)
          .map(blog => <Blog key={blog.id} blog={blog} user={user} setBlogs={setBlogs}/>)
      }

    </div>
  )
}


export default App