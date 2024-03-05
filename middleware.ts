import NextAuth from "next-auth";
import authConfig from "@/auth.config";
import {
  apiAuthPrefix,
  DEFAULT_LOGIN_REDIRECT,
  authRoutes,
  publicRoutes,
} from "@/routes";

const { auth } = NextAuth(authConfig);

// @ts-expect-error
export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
  if (isApiAuthRoute) {
    return null;
  }

  const isAuthRoute = authRoutes.includes(nextUrl.pathname);
  if (isAuthRoute) {
    if (isLoggedIn) {
      return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    }
    return null;
  }

  const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
  if (!isLoggedIn && !isPublicRoute) {
    return Response.redirect(new URL("/", nextUrl));
  }

  return null;
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
