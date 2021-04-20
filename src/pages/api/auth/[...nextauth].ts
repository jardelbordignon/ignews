import { query as q } from 'faunadb'
import NextAuth from 'next-auth'
import Providers from 'next-auth/providers'

import { fauna } from '../../../services/fauna'

export default NextAuth({
  providers: [
    Providers.GitHub({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
      scope: 'read:user'
    }),
  ],

  callbacks: {
    async session(session) {
      
      try {
        const match_subscription_by_user_ref = q.Match(
          q.Index('subscription_by_user_ref'),
          q.Select(
            'ref',
            q.Get(
              q.Match(
                q.Index('user_by_email'),
                q.Casefold(session.user.email)
              )
            )
          )
        )
  
        const match_subscription_by_status = q.Match(
          q.Index('subscription_by_status'),
          'active'
        )
  
        const userActiveSubscription = await fauna.query(
          q.Get(
            q.Intersection([
              match_subscription_by_user_ref,
              match_subscription_by_status
            ])
          )
        )
      
        return {
          ...session,
          activeSubscription: userActiveSubscription
        }

      } catch {
        return {
          ...session,
          activeSubscription: null,
        }
      }
    },

    async signIn(user, account, profile) {
      const { email } = user

      try {
        const match_user_by_email = q.Match(
          q.Index('user_by_email'),
          q.Casefold(user.email)
        )

        await fauna.query(
          q.If(
            q.Not(
              q.Exists(match_user_by_email)
            ),
            q.Create(
              q.Collection('users'),
              { data: { email }}
            ),
            q.Get(match_user_by_email)
          )
        )
  
        return true
      } catch {
        return false
      }
    },
  }
})
