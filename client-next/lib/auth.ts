import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import {
  UserLoginInfo,
  AuthResponse,
  GetUserResponse,
  User,
} from "../types/api";
import CryptoJS from "crypto-js";

export function hashPassword(password: string): string {
  if (!password || password.trim().length === 0) {
    throw new Error("Password cannot be empty");
  }
  const hash = CryptoJS.SHA256(password);
  return hash.toString(CryptoJS.enc.Hex);
}

// Create a type for the safe user data (excluding sensitive fields)
type SafeUser = Omit<User, "password" | "otp" | "otp_retries" | "locked_till">;

// Extend NextAuth's built-in types to match our User schema
declare module "next-auth" {
  interface Session {
    user: SafeUser & {
      accessToken: string;
    };
  }

  interface User extends SafeUser {
    accessToken: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends SafeUser {
    accessToken: string;
    tokenExpiry?: number;
  }
}

// Helper function to create user ID
const createUserId = (regNumber: string): string => {
  return `UID${regNumber}`;
};

// Helper function to fetch user data
const fetchUserData = async (
  userId: string,
  token: string
): Promise<User | null> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/user/info/${userId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      return null;
    }

    const data: GetUserResponse = await response.json();

    if (data.user) {
      return data.user;
    }

    return null;
  } catch (error) {
    console.error("Error fetching user data:", error);
    return null;
  }
};

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        reg_number: {
          label: "Registration Number",
          type: "text",
          placeholder: "Enter your registration number",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },
      async authorize(credentials) {
        if (!credentials?.reg_number || !credentials?.password) {
          return null;
        }

        try {
          // Hash the password with SHA-256 using crypto-js before sending to backend
          const hashedPassword = hashPassword(credentials.password);

          const loginData: UserLoginInfo = {
            reg_number: credentials.reg_number,
            password: hashedPassword,
          };

          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(loginData),
            }
          );

          if (!response.ok) {
            return null;
          }

          const data: AuthResponse = await response.json();

          if (data.token) {
            const userId = createUserId(credentials.reg_number);
            const userData = await fetchUserData(userId, data.token);

            if (userData) {
              // Return user data with accessToken, excluding sensitive fields
              const {
                password,
                otp,
                otp_retries,
                locked_till,
                ...safeUserData
              } = userData;

              return {
                ...safeUserData,
                accessToken: data.token,
              };
            }
          }

          return null;
        } catch (error) {
          console.error("Authentication error:", error);
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/auth/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 6 * 60 * 60, // 6 hours
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        // Clear any default NextAuth properties and copy user properties
        const { name, email, picture, sub, ...cleanToken } = token;

        // Copy all user properties to token
        return {
          ...cleanToken,
          ...user,
          tokenExpiry: Date.now() + 6 * 60 * 60 * 1000,
        };
      }

      return token;
    },
    async session({ session, token }) {
      if (token) {
        // Create a clean session user object
        const sessionUser: SafeUser & { accessToken: string } = {
          id: token.id,
          reg_number: token.reg_number,
          first_name: token.first_name,
          last_name: token.last_name,
          email: token.email ?? "",
          is_lead: token.is_lead,
          departments: token.departments,
          clubs: token.clubs,
          contributions: token.contributions,
          handles: token.handles,
          total_points: token.total_points,
          last_updated: token.last_updated,
          accessToken: token.accessToken,
        };

        session.user = sessionUser;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
