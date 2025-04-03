import { prisma } from "@/client";
import { Account, Session, SessionStrategy, User } from "next-auth";
import { JWT } from "next-auth/jwt";
import Google from "next-auth/providers/google";
import jwt from "jsonwebtoken"


export const authOptions = {
    providers: [
        Google({
            clientId: process.env.CLIENT_ID!,
            clientSecret: process.env.CLIENT_SECRET!
        })
    ],
    secret: process.env.NEXTAUTH_SECRET!,
    callbacks: {
        async signIn({ user, account }: { user: User | null, account: Account | null }) {
            if (account?.provider === 'google') {
                if (!user) {
                    console.log("user is not present")
                    return false
                } else {
                    try {
                        const existingUser = await prisma.user.findUnique({
                            where: {
                                email: user.email
                            },
                            select: {
                                id: true,
                                instituteId: true,
                                image: true,
                                name: true,
                                Gender: true,
                                role: true
                            }
                        })

                        if (!existingUser || (existingUser.role === "USER")) {
                            return false
                        }
                        const token = jwt.sign({ id: existingUser.id, instituteId: existingUser.instituteId, role: (existingUser.role === "OWNER" ? "OWNER" : "ADMIN") }, process.env.JWT_SECRET!)
                        user.role = existingUser.role
                        user.instituteId = existingUser.instituteId
                        user.id = existingUser.id
                        user.jwtToken = token
                        user.image = existingUser.image ?? undefined
                        user.name = existingUser.name
                        user.gender = existingUser.Gender ? (existingUser.Gender === "MALE" ? "male" : "female") : null
                        return true
                    } catch (e) {
                        console.log(e)
                        return false

                    }
                }
            }else {
                return false
            }
        },
    
    jwt: async ({ token, user }: { token: JWT, user: User }) => {
        // console.log(user)
        if (user) {
            // console.log("this is the user", user)
            token.role = user.role
            token.instituteId = user.instituteId
            token.id = user.id
            token.jwtToken = user.jwtToken
            token.name = user.name
            token.gender = user.gender
            token.image = user.image
            // console.log("this is the token ", token)

            return token

        }
        return token
    },
    session: async ({ session, token }: { session: Session, token: JWT }) => {
        // console.log("this run many times")

        const newSession = session as Session
        newSession.user.jwtToken = token.jwtToken as string
        newSession.user.role = token.role as string
        newSession.user.instituteId = token.instituteId as string | null
        newSession.user.id = token.id as string
        newSession.user.image = token.image as string
        newSession.user.name = token.name as string ?? null
        newSession.user.gender = token.gender as string ?? null
        return newSession

    }
},
    pages: {
        signIn: "/",
    },
    cookies: {
        sessionToken: {
          name: `${process.env.NODE_ENV === "production" ? "__Secure-" : ""}next-auth.session-token`,
          options: {
            httpOnly: true,
            sameSite: "lax",
            path: "/",
            secure: process.env.NODE_ENV === "production",
          },
        },
      },
      session: {
        strategy: "jwt" as SessionStrategy,
        maxAge: 60 * 60 * 24 * 3,
      },
}