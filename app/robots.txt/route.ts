// app/robots.txt/route.ts

import { NextResponse } from 'next/server';

export function GET() {
    const content = `
User-agent: Googlebot
Allow: /google-home

User-agent: *
Allow: /

Sitemap: https://mapa.co.ke/sitemap.xml
`.trim();

    return new NextResponse(content, {
        headers: {
            'Content-Type': 'text/plain',
        },
    });
}
