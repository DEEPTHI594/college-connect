import NextAuth from "next-auth/next";

import { authOptions } from "@/lib/auth"; // Adjust the path as necessary

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }