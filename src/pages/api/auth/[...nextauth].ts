

import NextAuth from 'next-auth'
import Providers from 'next-auth/providers'
import { NextApiRequest, NextApiResponse } from 'next'


const options = {
  providers: [
    Providers.Credentials({
      name: 'Credentials',
      credentials: {
        username: {label: "Username", type:"Text", placeholder: "jsmith"},
        password: {label: "Password", type: "password"}
      }
    })
  ],
  pages: {
    signIn: '/login',
    error: '/login',
    signOut: '/'
  },
  callbacks: {
    async authorize(credentials, req) {
      
      if (account.provider === 'google' &&
          (profile.email === process.env.EMAIL_ADM || profile.email === process.env.EMAIL_DEV)) {
        return true
      } else {
       
        return false
      }
    },
  }
}


export default (req: NextApiRequest, res: NextApiResponse) => NextAuth(req, res, options)