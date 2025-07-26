// app/sitemap.xml/route.ts

import { getAllAds } from '@/lib/actions/dynamicAd.actions';
import { NextResponse } from 'next/server';

export async function GET() {
    const baseUrl = 'https://mapa.co.ke';

    // Fetch all ads (modify this to only fetch necessary fields for performance)
    const ads = await getAllAds(); // Make sure this returns an array of { _id, updatedAt }

    const urls = ads.map((ad: any) => {
        return `
      <url>
        <loc>${baseUrl}/property/${ad._id}</loc>
        <lastmod>${new Date(ad.updatedAt).toISOString()}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.8</priority>
      </url>`;
    });

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset
      xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
    >
      <url>
        <loc>${baseUrl}</loc>
        <changefreq>daily</changefreq>
        <priority>1.0</priority>
      </url>
      ${urls.join('\n')}
    </urlset>`;

    return new NextResponse(xml, {
        headers: {
            'Content-Type': 'application/xml',
        },
    });
}
