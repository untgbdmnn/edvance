import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
    const cookies = request.cookies.get('edvance-auth');
    const authState = cookies ? JSON.parse(cookies.value) : null;
    const token = authState ? authState.state.token : null;
    const { pathname } = request.nextUrl;

    const publicRoutes = ['/sign-in', '/sign-up', '/forgot-password',];

    if (!token) {
        if (!publicRoutes.includes(pathname)) {
            return NextResponse.redirect(new URL('/sign-in', request.url));
        }
    }
    else {
        if (publicRoutes.includes(pathname)) {
            return NextResponse.redirect(new URL('/dashboard', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
    ]
}