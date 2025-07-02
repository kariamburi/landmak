import { NextResponse } from 'next/server';
import vision from '@google-cloud/vision';
import { readFile } from 'fs/promises';

const credentials = {
  client_email: process.env.VISION_GOOGLE_CLIENT_EMAIL,
  private_key: process.env.VISION_GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  project_id: process.env.VISION_GOOGLE_PROJECT_ID,
};
const client = new vision.ImageAnnotatorClient({ credentials });
// Category-to-keyword mapping for matching
const categoryKeywords: { [key: string]: string[] } = {
  "New builds": ["new construction", "building site", "modern house", "unfinished building"],
  "Houses & Apartments for Rent": ["house", "apartment", "residential", "for rent"],
  "Houses & Apartments for Sale": ["house", "apartment", "real estate", "for sale"],
  "Land & Plots for Rent": ["land", "plot", "field", "open space", "for rent"],
  "Land & Plots for Sale": ["land", "plot", "vacant lot", "field", "for sale"],
  "Commercial Property for Rent": ["office", "commercial building", "shop", "business center", "for rent"],
  "Commercial Property for Sale": ["office", "commercial property", "commercial real estate", "for sale"],
  "Event Centres, Venues & Workstations": ["event hall", "venue", "conference", "meeting room", "wedding"],
  "Short Let Property": ["short term", "bnb", "furnished apartment", "holiday home"],
  "Special Listings": ["mansion", "luxury", "exclusive", "premium"],
  "Property Services": ["agent", "valuation", "survey", "property manager", "signboard"],
  "Real Estate Agents": ["real estate agent", "agent", "signboard", "office"],
  "Surveyors / Valuers": ["surveyor", "valuation", "theodolite", "measuring", "map"],
  "Property Managers": ["property manager", "maintenance", "office", "real estate"],
  "Legal Services (Title, Deed, Lease)": ["contract", "title", "document", "lawyer", "notary", "deed", "lease"],
  "Building Contractors": ["construction", "builder", "contractor", "bricklayer", "scaffold", "cement"],
  "Construction & Technical Services": ["architecture", "engineer", "blueprint", "building plan", "survey"],
  "Mortgage & Financing Services": ["mortgage", "loan", "finance", "calculator", "bank"],
};
export async function POST(req: Request) {
  try {
    const { base64Image } = await req.json();

    if (!base64Image) {
      return NextResponse.json({ error: 'Missing image content' }, { status: 400 });
    }

    const [result] = await client.annotateImage({
      image: { content: base64Image },
      features: [
        { type: 'LABEL_DETECTION' },
        { type: 'TEXT_DETECTION' },
        { type: 'WEB_DETECTION' },
      ],
    });

    const labels = result.labelAnnotations?.map((l) => l.description?.toLowerCase()) || [];
    const text = result.textAnnotations?.map((t) => t.description?.toLowerCase()) || [];
    const web = result.webDetection || {};

    //const isRealProperty = labels.some((l:any) =>
    //  ['land', 'real estate', 'field', 'building', 'house', 'property', 'vacant lot'].includes(l)
    //);

    const hasWatermark = text.some((t: any) =>
      t.includes('sample') || t.includes('watermark') || t.includes('copyright') || t.length > 30
    );

    const likelyDownloaded =
      (web.fullMatchingImages && web.fullMatchingImages.length > 0) ||
      (web.pagesWithMatchingImages && web.pagesWithMatchingImages.length > 0);

    // Match categories
    const matchedCategories: string[] = [];
    for (const [category, keywords] of Object.entries(categoryKeywords)) {
      const matched = keywords.some((kw) => labels.includes(kw));
      if (matched) matchedCategories.push(category);
    }
    // ✅ isRealProperty is true if it matched any known category
    const isRealProperty = matchedCategories.length > 0;

    return NextResponse.json({
      isRealProperty,
      hasWatermark,
      likelyDownloaded,
      matchedCategories,
      labels,
      text,
    });
  } catch (error) {
    console.error('Vision API error:', error);
    return NextResponse.json({ error: 'Failed to analyze image' }, { status: 500 });
  }
}
