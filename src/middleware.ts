import { withAuth } from "next-auth/middleware";

export const middleware = withAuth({
  pages: {
    signIn: "/signin",
  },
});

export const config = {
  matcher: ["/tasks/:path*", "/api/tasks/:path*"],
};
