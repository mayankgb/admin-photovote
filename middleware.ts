import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export default async function middleware(req: NextRequest) {
    const token = await getToken({req, secret: process.env.NEXTAUTH_SECRET})

    const { pathname } = req.nextUrl

    if (token) {
        if (pathname === "/") {
            return NextResponse.redirect(`${process.env.NEXT_PUBLIC_URL}/home`)
        }
        return NextResponse.next()
    }

    if (pathname === "/") {
        return NextResponse.next()
    }

    const redirectUrl = req.nextUrl.clone()
    redirectUrl.pathname = "/"
    redirectUrl.searchParams.set("callback" , pathname)
    return NextResponse.redirect(redirectUrl)

}

export const config = {
    matcher:["/",'/home', "/approvecandidate", "/createcontest", "/endcontest", "/startcontest"]
}