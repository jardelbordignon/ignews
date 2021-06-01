
import { render, screen } from '@testing-library/react'
import { useSession } from 'next-auth/client'
import { mocked } from 'ts-jest/utils'
import { useRouter } from 'next/router'

import Post, { getStaticProps } from '../../pages/posts/preview/[slug]'
import { getPrismicClient } from '../../services/prismic'

jest.mock('next-auth/client')
jest.mock('next/router')
jest.mock('../../services/prismic')

const post = { 
  slug: 'my-new-post', 
  title: 'My New Post', 
  content: '<p>Post excerpt<p>', 
  updatedAt: '31 de maio'
}

describe('Post Preview page', () => {
  it('renders correctly', () => {
    const mockedUseSession = mocked(useSession)
    mockedUseSession.mockReturnValueOnce([null, false])

    render( <Post post={post} /> )

    expect(screen.getByText('My New Post')).toBeInTheDocument()
    expect(screen.getByText('Post excerpt')).toBeInTheDocument()
    expect(screen.getByText('Wanna continue reading?')).toBeInTheDocument()
  })

  it('redirects user to complete post when user is subscribed', async () => {
    const mockedUseSession = mocked(useSession)
    const mockedUseRouter = mocked(useRouter)
    const pushMocked = jest.fn()

    mockedUseSession.mockReturnValueOnce([
      { activeSubscription: 'fake-active-subscription' },
      false
    ] as any)

    mockedUseRouter.mockReturnValueOnce({
      push: pushMocked
    } as any)

    render( <Post post={post} /> )

    expect(pushMocked).toHaveBeenCalledWith('/posts/my-new-post')
  })

  it('loads data in getStaticProps', async () => {
      const mockedGetPrismicClient = mocked(getPrismicClient)
  
      mockedGetPrismicClient.mockReturnValueOnce({
        getByUID: jest.fn().mockResolvedValueOnce({
          data: {
            title: [ { type: 'heading', text: 'My New Post'} ],
            content: [ { type: 'paragraph', text: 'Post content' } ],
          },
          last_publication_date: '05-31-2021'
        })
      } as any)
  
      const response = await getStaticProps({
        params: { slug: 'my-new-post' }
      })
  
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
