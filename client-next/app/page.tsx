import { getServerSession } from "next-auth";
import { authOptions } from "../lib/auth";
import { redirect } from "next/navigation";

export default async function HomePage() {
  const session = await getServerSession(authOptions);

  // Middleware will handle the redirects, but we can also do it here for clarity
  if (session) {
    redirect("/dashboard");
  } else {
    redirect("/auth/login");
  }
}
