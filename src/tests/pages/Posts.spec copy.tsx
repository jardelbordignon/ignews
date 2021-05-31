import { render, screen } from '@testing-library/react'
import { mocked } from 'ts-jest/utils'

import { getPrimicClient } from '../../services/prismic'
import Posts, { getStaticProps } from '../../pages/posts'

jest.mock('../../services/prismic')

const posts = [
  { 
    slug: 'my-new-post', 
    title: 'My New Post', 
    excerpt: 'Post excerpt', 
    updatedAt: '31 de maio'
  }
]

describe('Posts page', () => {
  it('renders correctly', () => {
    render( <Posts posts={posts} /> )

    expect(screen.getByText('My New Post')).toBeInTheDocument()
  })


  it('loads inital data in getStaticProps', async () => {
    const mockedGetPrimicClient = mocked(getPrimicClient)

    mockedGetPrimicClient.mockReturnValueOnce({
      query: jest.fn().mockResolvedValueOnce({
        resutls: [
          {
            uid: 'my-new-post',
            data: {
              title: [ { type: 'heading', text: 'My New Post'} ],
              content: [ { type: 'paragraph', text: 'Post expect' } ],
            },
            last_publication_date: '05-31-2021'
          }
        ]
      }),
    } as any)

    const response = await getStaticProps({})

    expect(response).toEqual(
      expect.objectContaining({
        props: {
          posts: [{
            slug: 'my-new-post',
            title: 'My New Post',
            excerpt: 'Post expect',
            updatedAt: '31 de maio de 2021'
          }]
        }
      })
    )
  })
})
