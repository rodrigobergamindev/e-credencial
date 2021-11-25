

import NextAuth from 'next-auth'
import Providers from 'next-auth/providers'
import { NextApiRequest, NextApiResponse } from 'next'

let userAccount = {
  name: 'Rodrigo Bergamin',
  email: null,
  image: '/img/avatar.jpg'
}

const options = {
  providers: [
    Providers.Credentials({
      id: 'credentials',
      name: 'Credentials',
      credentials: {
        username: {label: "Username", type:"Text", placeholder: "user..."},
        password: {label: "Password", type: "password"}
      },
      async authorize(credentials, req) {
        // Add logic here to look up the user from the credentials supplied
        
        const user = {username: credentials.username, password: credentials.password}
       
        if (user) {
          //faz a busca no banco de dados e seta userAccount como o nosso usuário
          return user
        } else {
          // If you return null or false then the credentials will be rejected
          return null
          // You can also Reject this callback with an Error or with a URL:
          // throw new Error('error message') // Redirect to error page
          // throw '/path/to/redirect'        // Redirect to a URL
        }
      }
    })
  ],
  pages: {
    signIn: '/login',
    error: '/login',
    signOut: '/'
  },
  callbacks: {
    async signIn(user, account, profile) {
      if (user)
      {
        //autenticação
        
        userAccount.email = user.username
        console.log(userAccount)
         return true
      }
      else
      {
          return false;
      }
  },
  async session(session, token) {
    
    session.user = userAccount
    return session;
},
  }
}


export default (req: NextApiRequest, res: NextApiResponse) => NextAuth(req, res, options)