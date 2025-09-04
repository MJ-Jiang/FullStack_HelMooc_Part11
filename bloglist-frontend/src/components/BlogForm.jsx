import { useState } from 'react'
import blogService from '../services/blogs'
import PropTypes from 'prop-types'
const BlogForm=({ setBlogs,blogs,setMessage }) => {
  const[title,setTitle]=useState('')
  const[author,setAuthor]=useState('')
  const[url,setUrl]=useState('')

  const handleNewBlog=async(event) => {
    event.preventDefault()
    try{
      const newBlog={ title,author,url }
      const returnedBlog=await blogService.create(newBlog)
      setBlogs(blogs.concat(returnedBlog))
      setTitle('')
      setAuthor('')
      setUrl('')
      setMessage({ text:`A new blog "${title}" by ${author} added`,type:'success' })
      setTimeout(() => {setMessage(null)},5000)
    }catch(error){
      console.error('error creating blog:',error)
    }
  }
  return (
    <div className='formDiv'>
      <h3>Create new</h3>
      <form onSubmit={handleNewBlog}>
                title:
        <input
          type='text'
          value={title}
          name='title'
          aria-label="title"
          onChange={({ target }) => setTitle(target.value)}
        />
        <br/>
                author:
        <input
          type='text'
          value={author}
          name='author'
          aria-label="author"
          onChange={({ target }) => setAuthor(target.value)}
        />
        <br/>
                url:
        <input
          type='text'
          value={url}
          name='url'
          aria-label="url"
          onChange={({ target }) => setUrl(target.value)}
        />

        <br/>
        <button type="submit" className="button" aria-label="create">Create</button>
      </form>
    </div>
  )

}
BlogForm.propTypes={
  setBlogs:PropTypes.func.isRequired,
  blogs:PropTypes.array.isRequired,
  setMessage:PropTypes.func.isRequired
}


export default BlogForm