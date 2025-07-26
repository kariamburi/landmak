// app/sitemap.xml/route.ts

import { getAllAds } from '@/lib/actions/dynamicAd.actions';
import { NextResponse } from 'next/server';

export async function GET() {
    const baseUrl = 'https://mapa.co.ke';

    // Fetch ads (ensure it returns at least _id and updatedAt)
    const ads = await getAllAds();

    const urls = ads
        .filter((ad: any) => ad && ad._id) // Ensure ad and ID exist
        .map((ad: any) => {
            const updatedDate = ad.updatedAt ? new Date(ad.updatedAt) : new Date();

            // Fallback to current date if invalid
            const lastmod = isNaN(updatedDate.getTime())
                ? new Date().toISOString()
                : updatedDate.toISOString();

            return `
      <url>
        <loc>${baseUrl}/property/${ad._id}</loc>
        <lastmod>${lastmod}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.8</priority>
      </url>`;
        });

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
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
