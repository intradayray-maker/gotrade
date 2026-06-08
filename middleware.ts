// middleware.ts

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(req: NextRequest) {

const url = req.nextUrl.clone()

// Only apply redirect on the custom domain
const isCustomDomain = req.headers.get('host') === 'gotrade.one'

// Redirect ONLY the root path of the custom domain
if (isCustomDomain && url.pathname === '/') {
url.pathname = '/coming-soon'
return NextResponse.redirect(url)
}

return NextResponse.next()
}
