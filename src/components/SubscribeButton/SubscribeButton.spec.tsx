import { fireEvent, render, screen } from '@testing-library/react'
import { mocked } from 'ts-jest/utils'
import { signIn, useSession } from 'next-auth/client'
import { useRouter } from 'next/router'

import { SubscribeButton } from '.'

jest.mock('next-auth/client')
jest.mock('next/router')


describe('SubscribeButton component', () => {

  it('renders correctly', () => {
    const mockedUseSession = mocked(useSession)
    mockedUseSession.mockReturnValueOnce([null, false])

    render( <SubscribeButton /> )
  
    expect(screen.getByText('Subscribe now')).toBeInTheDocument()
  })


  it('redirects user to sign in when not authenticated', () => {
    const mockedSignIn = mocked(signIn)
    const mockedUseSession = mocked(useSession)
    mockedUseSession.mockReturnValueOnce([null, false])

    render( <SubscribeButton /> )

    const subscribeButton = screen.getByText('Subscribe now')

    fireEvent.click(subscribeButton)

    expect(mockedSignIn).toHaveBeenCalled()
  })
  
  it('redirects to posts when user already has a subscription', () => {
    const mockedUseRouter = mocked(useRouter)
    const mockedUseSession = mocked(useSession)

    const pushMocked = jest.fn()

    mockedUseSession.mockReturnValueOnce([
      { 
        user: { name: 'John Doe', email: 'johndoe@email.com'},
        expires: '2d',
        activeSubscription: 'fakea-ctive-subscription'
      },
      false
    ])

    mockedUseRouter.mockReturnValueOnce({
      push: pushMocked
    } as any)

    render( <SubscribeButton /> )

    const subscribeButton = screen.getByText('Subscribe now')

    fireEvent.click(subscribeButton)

    expect(pushMocked).toHaveBeenCalled()
  })

})
