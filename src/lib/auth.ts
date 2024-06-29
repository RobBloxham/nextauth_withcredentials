import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { db } from './db'
import bcrypt from 'bcrypt'

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(db),
    secret: process.env.SECRET,
    session: {
        strategy: 'jwt',
    },
    pages: {
        signIn: '/sign-in'
    },
    providers: [
        CredentialsProvider({
          name: "Credentials",
          credentials: {
            email: { label: "email", type: "email", placeholder: "example@email.com" },
            password: { label: "Password", type: "password" }
          },
          async authorize(credentials) {
           if(!credentials?.email || !credentials?.password) {
            return null
           }
           const existingUser = await db.user.findUnique({
            where: {email: credentials?.email}
           })
           if(!existingUser) {
            return null
           }

           if(existingUser.password) {
            const passwordMatch = await bcrypt.compare(credentials.password, existingUser.password)
            if(!passwordMatch) {
             return null;
            }
           }

      
           return { 
            id: `${existingUser.id}`, 
            email: existingUser.email, 
            username: existingUser.username
          }
         }
        }),
        GoogleProvider({
          clientId: process.env.GOOGLE_ID!,
          clientSecret: process.env.GOOGLE_SECRET!,
          allowDangerousEmailAccountLinking: true, // Allow automatic linking of users table to accounts table in database - not dangerous when used with OAuth providers that already perform email verification (like Google)
          authorization: {
            params: {
              prompt: "consent",
              access_type: "offline",
              response_type: "code"
            }
          }
        })

      ],
      callbacks: {
        async jwt({token, user}) {
          if(user) {
            return {
              ...token,
              username: user.username
            }
          }
          return token
        },
        async session ({session, token}) {
          return { 
            ...session, 
            user: {
              ...session.user,
              username: token.username
            }
          }
        },
      }
}