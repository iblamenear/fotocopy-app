import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    // Protect Admin Routes
    if (path.startsWith("/admin") && path !== "/admin/login") {
      if (token?.role !== "admin") {
        return NextResponse.redirect(new URL("/admin/login", req.url));
      }
    }

    // Protect Courier Routes
    if (path.startsWith("/courier") && path !== "/courier/login") {
      if (token?.role !== "courier") {
        return NextResponse.redirect(new URL("/courier/login", req.url));
      }
    }

    // Protect Order, Checkout & Profile Routes (Any authenticated user)
    if (path.startsWith("/order") || path.startsWith("/checkout") || path.startsWith("/profile")) {
      if (!token) {
        return NextResponse.redirect(new URL("/login", req.url));
      }
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: ["/admin/:path*", "/courier/:path*", "/order/:path*", "/checkout/:path*", "/profile/:path*"],
};
