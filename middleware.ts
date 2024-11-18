import NextAuth from "next-auth";
// import authConfig from "@/auth.config";
import { NextRequest } from "next/server";

// const { auth } = NextAuth(authConfig);

// export default auth((req: any) => {
//   // const isLoggedIn = !!req.auth;
//   // const { nextUrl } = req;
//   // const isApiAuthRoute = nextUrl.pathname.startsWith("/api/auth");
//   // const isAuthRoute = nextUrl.pathname.startsWith("/auth");
//   // const isCheckoutRoute = nextUrl.pathname.startsWith("/checkout");
//   // const isAccountRoute = nextUrl.pathname.startsWith("/account");
//   // if (isApiAuthRoute) {
//   //   return null;
//   // }
//   // if (isAuthRoute) {
//   //   if (isLoggedIn) {
//   //     return Response.redirect(new URL("/", nextUrl));
//   //   }
//   //   return null;
//   // }
//   // if (!isLoggedIn && (isCheckoutRoute || isAccountRoute)) {
//   //   let callbackUrl = nextUrl.pathname;
//   //   if (nextUrl.search) {
//   //     callbackUrl += nextUrl.search;
//   //   }
//   //   const encodedCallbackUrl = encodeURIComponent(callbackUrl);
//   //   return Response.redirect(
//   //     new URL(`/auth?callbackUrl=${encodedCallbackUrl}`, nextUrl),
//   //   );
//   // }
//   // return null;
// });

export async function middleware(req: NextRequest) {
  return null;
}

// Optionally, don't invoke Middleware on some paths
export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
