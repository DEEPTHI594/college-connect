import { NextAuthOptions, getServerSession } from "next-auth"
import {db} from "@/lib/db"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import GoogleProvider from "next-auth/providers/google"
import{nanoid} from 'nanoid'
export const authOptions : NextAuthOptions = {
    adapter : PrismaAdapter(db),
    session : {
        strategy : 'jwt'
    },
    pages : {       
        signIn : '/sign-in'
    }, 
    providers :[
        GoogleProvider({
            clientId : process.env.GOOGLE_CLIENT_ID!,
            clientSecret : process.env.GOOGLE_CLIENT_SECRET!,
        }),
    ],
    callbacks: {
        async signIn({ account, profile }) {
            // Only run this check for Google provider
            if (account?.provider === 'google') {
                const allowedDomains = ['mlrinstitutions.ac.in', 'mlrit.ac.in'];
                const email = profile?.email ?? '';

                const isAllowed = allowedDomains.some(domain => email.endsWith(`@${domain}`));
                
                if (!isAllowed) {
                    return false; // ❌ Reject login if domain not allowed
                }
                }
            return true; // ✅ Allow login
        },

        async session({ token, session }) {
            if (token) {
                session.user.id = token.id;
                session.user.username = token.username;
                session.user.image = token.picture;
                session.user.email = token.email;
                session.user.name = token.name;
            }
            return session;
        },

        async jwt({ token, user }) {
            const dbUser = await db.user.findFirst({
                where: {
                    email: token.email
                }
                });
                if (!dbUser) {
                token.id = user!.id;
                return token;
                }
                if (!dbUser.username) {
                await db.user.update({
                    where: {
                    id: dbUser.id,
                    },
                    data: {
                    username: nanoid(10),
                    }
                });
                }
                return {
                id: dbUser.id,
                name: dbUser.name,
                email: dbUser.email,
                picture: dbUser.image,
                username: dbUser.username,
                };
            },

        redirect() {
            return '/';
        }
        },
}

export const getAuthSession = () => getServerSession(authOptions)