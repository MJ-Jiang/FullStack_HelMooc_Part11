import { useState, useImperativeHandle, forwardRef } from 'react'
import PropTypes from 'prop-types'
const Togglable = forwardRef((props, ref) => {
  //accept a ref from the parent. forwardRef allows you to pass the ref to a functional component like Togglable.
  const [visible, setVisible] = useState(false)

  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  useImperativeHandle(ref, () => {
    return {
      toggleVisibility
    }
  })
  //When someone uses this ref, give them access to toggleVisibility

  return (
    <div>
      <div style={hideWhenVisible}>
        <button onClick={toggleVisibility}>{props.buttonLabel}</button>
      </div>
      <div style={showWhenVisible} className='togglableContent'>
        {props.children}


        <button className='button' onClick={toggleVisibility}>cancel</button>
      </div>
    </div>
  )
})
Togglable.propTypes={
  buttonLabel:PropTypes.string.isRequired
}
Togglable.displayName='Togglable'

export default Togglable


//  <Togglable buttonLabel="Create New Blog">
//   <BlogForm />
//   //props.children = <BlogForm />
//   The child components are the React elements that we define between the opening and closing tags of a component.
// </Togglable>
