import { getAllAds } from '@/lib/actions/dynamicAd.actions';
import { NextResponse } from 'next/server';

export async function GET() {
  const baseUrl = 'https://mapa.co.ke';

  const staticUrls = [
    {
      loc: `${baseUrl}/`,
      changefreq: 'daily',
      priority: '1.0',
    },
    {
      loc: `${baseUrl}/about`,
      changefreq: 'monthly',
      priority: '0.5',
    },
    {
      loc: `${baseUrl}/terms`,
      changefreq: 'monthly',
      priority: '0.5',
    },
  ];

  // Fetch dynamic ads
  const ads = await getAllAds();

  const dynamicUrls = ads
    .filter((ad: any) => ad && ad._id)
    .map((ad: any) => {
      const updatedDate = ad.updatedAt ? new Date(ad.updatedAt) : new Date();
      const lastmod = isNaN(updatedDate.getTime())
        ? new Date().toISOString()
        : updatedDate.toISOString();

      return {
        loc: `${baseUrl}/property/${ad._id}`,
        lastmod,
        changefreq: 'weekly',
        priority: '0.8',
      };
    });

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${[...staticUrls, ...dynamicUrls]
      .map((url) => {
        return `
  <url>
    <loc>${url.loc}</loc>
    ${url.lastmod ? `<lastmod>${url.lastmod}</lastmod>` : ''}
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`;
      })
      .join('\n')}
</urlset>`;

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}
