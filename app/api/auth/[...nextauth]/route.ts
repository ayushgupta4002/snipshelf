import prisma from "@/lib/prisma";
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  debug: true, // Enable debug mode for detailed error logs
  callbacks: {
    async signIn({ user, account, profile }) {
      const email = user.email;
      const image = user.image;
      const name = user.name;

      try {
        console.log("User:", user);
        if(!email){
          return false;
        }
        const userExist = await prisma.user.findUnique({
          where: {
            email :email || "",
          },
          
        })
        if(!userExist){
          await prisma.user.create({
            data: {
              email : email,
              name : name,
              apiKey : "123456",
            },
          });
        }
        // Check if user already exists
        // const existingUser = await prisma.user.findUnique({
        //   where: { email },
        // });

        // if (!existingUser) {
        //   // If not, create a new user
        //   await prisma.user.create({
        //     data: {
        //       email,
        //       image,
        //     },
        //   });
        // }
      } catch (error) {
        console.error("Error inserting user into the database:", error);
        return false; // Return false to reject the sign-in
      }

      return true; // Return true to continue the sign-in process
    },
    async redirect({ url, baseUrl }) {
      // Redirect user to the dashboard after sign-in
      return `${baseUrl}/dashboard`;
    },
  },
});

export { handler as GET, handler as POST };
