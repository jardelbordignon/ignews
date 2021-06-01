import { render, screen } from '@testing-library/react'
import { mocked } from 'ts-jest/utils'
import { getSession } from 'next-auth/client'

import Post, { getServerSideProps } from '../../pages/posts/[slug]'
import { getPrimicClient } from '../../services/prismic'

jest.mock('next-auth/client')
jest.mock('../../services/prismic')

const post = { 
  slug: 'my-new-post', 
  title: 'My New Post', 
  content: '<p>Post excerpt<p>', 
  updatedAt: '31 de maio'
}

describe('Post page', () => {
  it('renders correctly', () => {
    render( <Post post={post} /> )

    expect(screen.getByText('My New Post')).toBeInTheDocument()
    expect(screen.getByText('Post excerpt')).toBeInTheDocument()
  })


  it('redirects user if subscribe is not found', async () => {
    const mockedGetSession = mocked(getSession)
    mockedGetSession.mockResolvedValueOnce(null)
    
    const response = await getServerSideProps({
      params: { slug: 'my-new-post' }
    } as any)

    expect(response).toEqual(
      expect.objectContaining({
        redirect: expect.objectContaining({ destination: '/' })
      })
    )
  })


  it('loads inital data in getServerSideProps', async () => {
    const mockedGetPrimicClient = mocked(getPrimicClient)
    const mockedGetSession = mocked(getSession)

    mockedGetPrimicClient.mockReturnValueOnce({
      getByUID: jest.fn().mockResolvedValueOnce({
        data: {
          title: [ { type: 'heading', text: 'My New Post'} ],
          content: [ { type: 'paragraph', text: 'Post content' } ],
        },
        last_publication_date: '05-31-2021'
      })
    } as any)

    mockedGetSession.mockResolvedValueOnce({
      activeSubscription: 'fake-active-subscription'
    })

    const response = await getServerSideProps({
      params: { slug: 'my-new-post' }
    } as any)

    expect(response).toEqual(
      expect.objectContaining({
        props: {
          post: {
            slug: 'my-new-post',
            title: 'My New Post',
            content: '<p>Post content</p>',
            updatedAt: '31 de maio de 2021'
          }
        }
      })
    )

  })
})
