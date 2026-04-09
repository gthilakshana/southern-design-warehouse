import NextAuth from "next-auth"
import { authConfig } from "./auth.config"
import Credentials from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { getDirectDb } from "@/lib/mongodb-direct"

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  session: { strategy: "jwt" },
  trustHost: true,
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        if (!credentials?.email || !credentials?.password) {
          console.log("Auth: Missing credentials");
          return null;
        }

        console.log(`Auth: Attempting login for ${credentials.email}`);

        // Direct MongoDB Bypass
        const db = await getDirectDb();
        const user = await db.collection("User").findOne({ 
          email: credentials.email as string 
        });

        if (!user) {
          console.log(`Auth: User not found - ${credentials.email}`);
          return null;
        }

        if (!user.password) {
          console.log(`Auth: User has no password set - ${credentials.email}`);
          return null;
        }

        const isValid = await bcrypt.compare(
          credentials.password as string,
          user.password
        );

        if (!isValid) {
          console.log(`Auth: Invalid password for ${credentials.email}`);
          return null;
        }

        console.log(`Auth: Login successful for ${credentials.email} (Role: ${user.role})`);

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
        }
      },
    }),
  ],
})
