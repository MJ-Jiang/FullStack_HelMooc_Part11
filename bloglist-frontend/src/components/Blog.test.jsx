import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'
import { vi, expect, test } from 'vitest'
import BlogForm from './BlogForm'

vi.mock('../services/blogs', () => {
  return {
    __esModule: true,
    //can use import blogService from '../services/blogs'
    default: {
      create:vi.fn(newBlog => Promise.resolve({ ...newBlog,id:'555' })),
      update: vi.fn((id, updatedBlog) => Promise.resolve({ ...updatedBlog, id })),
      remove: vi.fn(() => Promise.resolve()),
      //vi.fn(...) creates a fake function that can track the number of calls, parameters, and return the result you give.
    },
    //The mocked module exports a default object, which contains update and remove methods.
  }
})
// vi.mock('mockpath', () => {
//   return mockcontent
// })

//vi.mock(...) is a function used by Vitest to fake a module
const initialBlog = {
  id: '12345',
  title: 'Component testing is done with react-testing-library',
  author: 'Test-author',
  url: 'http://www.com',
  likes: 5,
  user: { id: 'user1' },
}
const currentUser = { id: 'user1' }


test('renders title and author, but not url or likes by default', () => {
  render(<Blog blog={initialBlog} user={currentUser} />)

  expect(screen.getByText(/Component testing is done with react-testing-library/i)).toBeDefined()
  expect(screen.getByText(/Test-author/i)).toBeDefined()

  expect(screen.queryByText(initialBlog.url)).toBeNull()
  expect(screen.queryByText(/likes/i)).toBeNull()
  //getByText will report an error if it cannot find the value, while queryByText will return null if it cannot find the value.
})


test('renders url and likes after showing details', async () => {
  render(<Blog blog={initialBlog} user={currentUser}/>)

  const user = userEvent.setup()
  const viewButton = screen.getByText('View')
  await user.click(viewButton)

  expect(screen.getByText(initialBlog.url)).toBeDefined()
  expect(screen.getByText((content) => content.includes('likes') && content.includes(String(initialBlog.likes)))).toBeDefined()
})


test('if the like button is clicked twice, the event handler the component received as props is called twice', async () => {
  const setBlogs = vi.fn()
  const mockOnLike = vi.fn()

  render(
    <Blog
      blog={initialBlog}
      user={currentUser}
      setBlogs={setBlogs}
      onLike={mockOnLike}
    />
  )
  const user = userEvent.setup()
  const viewButton = screen.getByText('View')
  await user.click(viewButton)
  const likeButton = screen.getByRole('button', { name: /like-button/i })
  await user.click(likeButton)
  await user.click(likeButton)
  expect(mockOnLike).toHaveBeenCalledTimes(2)
})

test('<BlogForm /> updates parent state and calls onSubmit',async() => {
  const setBlogs=vi.fn()
  const setMessage=vi.fn()
  const blogs=[]

  const user=userEvent.setup()

  render(<BlogForm setBlogs={setBlogs} blogs={blogs} setMessage={setMessage}/>)
  const title=screen.getByRole('textbox', { name:/title/i })
  const author=screen.getByRole('textbox',{ name:/author/i })
  const url=screen.getByRole('textbox',{ name:/url/i })
  await user.type(title,'testTitle')
  await user.type(author,'testAuthor')
  await user.type(url,'http://www.test')

  const createButton=screen.getByRole('button',{ name:/create/i })
  await user.click(createButton)
  expect(setBlogs).toHaveBeenCalledTimes(1)

  const newBlogsArray=setBlogs.mock.calls[0][0]
  expect(newBlogsArray).toHaveLength(1)
  expect(newBlogsArray[0]).toMatchObject({
    title:'testTitle',
    author:'testAuthor',
    url:'http://www.test'
  })

  expect(setMessage).toHaveBeenCalledTimes(1)
  expect(setMessage.mock.calls[0][0]).toMatchObject(
    {
      text:expect.stringContaining('testTitle'),
      type:'success'
    }
  )



})
