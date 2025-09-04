import{ useState } from 'react'
import '../App.css'
import blogService from '../services/blogs'


const Blog = ({ blog, user, setBlogs, onLike = () => {} }) => {


  const [showDetails, setShowDetails] = useState(false)
  const [likes, setLikes] = useState(blog.likes)
  const blogStyle = {
    paddingTop: 3,
    paddingLeft: 2,
    borderWidth: 1,
    marginBottom: 3,
    border: '1px solid black',
  }
  const handleLike=async() => {

    try{
      onLike()
      const updatedBlog={
        title:blog.title,
        author:blog.author,
        url:blog.url,
        likes:likes+1,

      }
      //console.log('blog.user:', blog.user)
      const returnedBlog=await blogService.update(blog.id,updatedBlog)
      setLikes(returnedBlog.likes)
      setBlogs(blogs => blogs.map(b => b.id === returnedBlog.id ? returnedBlog : b))

    }catch(error){
      console.error('Error liking the blog:', error)
    }
  }
  const handleRemove=async() => {
    const confirmRemove=window.confirm(`Remove blog "${blog.title}" by ${blog.author}?`)
    if(!confirmRemove) return
    try{
      await blogService.remove(blog.id,user.token)
      setBlogs(currentBlogs => currentBlogs.filter(b => b.id!==blog.id))


    }catch(error){
      console.error('Error removing the blog',error)
    }
  }

  const isOwner = blog.user && (blog.user.id === user.id)

  return(
    <div style={blogStyle} className="blog">
      <div>
        {blog.title} {blog.author}
        <button className='button' onClick={() => setShowDetails(!showDetails)}>
          {showDetails?'Hide':'View'}
        </button>
      </div>

      {showDetails && (
        <div style={{ lineHeight: 1.2 }}>
          <p style={{ margin: 0 }}>{blog.url}</p>
          <div style={{ margin: 0 }}>
            <p style={{ display: 'inline', marginRight: '10px', margin: 0 }}>
            likes {likes}
            </p>
            <button className='button' onClick={handleLike} aria-label="like-button">like</button>
          </div>
          <p style={{ margin: 0 }}>{blog.author}</p>
          {isOwner && <button className='button' onClick={handleRemove} aria-label="remove-button" style={{ backgroundColor: '#87CEFA' }}>remove</button>}
        </div>
      )}


    </div>

  )


}



export default Blog