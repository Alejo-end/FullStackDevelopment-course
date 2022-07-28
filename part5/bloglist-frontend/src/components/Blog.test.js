import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { fireEvent, render, screen } from '@testing-library/react'
import Blog from './Blog'

describe('<Blog />', () => {
  let component
  const testUser = {
    person: { username: 'TestUser' },
  }
  const newBlog = {
    title: 'Test title',
    author: 'Test author',
    url: 'Test url',
    likes: 10,
    person: {
      username: 'TestUser',
    },
  }

  const updateBlog = jest.fn()
  const delFunc = jest.fn()

  beforeEach(() => {
    component = render(<Blog blog={newBlog} updateBlog={updateBlog} person={testUser} delFunc={delFunc} />)
  })

  test('renders only title and author at start', () => {
    expect(component.container).toHaveTextContent('Test title')
    expect(component.container).toHaveTextContent('Test author')
    const urlEl = screen.queryByText('Test url')
    expect(urlEl).toBeNull()
    const likesEl = screen.queryByText('likes')
    expect(likesEl).toBeNull()
  })

  test('renders url and likes on button press', () => {
    const button = component.container.querySelector('.viewDetailsBut')
    fireEvent.click(button)
    expect(component.container).toHaveTextContent('Test url')
    expect(component.container).toHaveTextContent('likes')
  })

  test('Click like button twice', () => {
    const buttonView = component.container.querySelector('.viewDetailsBut')
    fireEvent.click(buttonView)
    const buttonLike = component.container.querySelector('.likeBut')
    fireEvent.click(buttonLike)
    fireEvent.click(buttonLike)
  })
})