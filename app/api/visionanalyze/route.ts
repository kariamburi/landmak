import { NextResponse } from 'next/server';
import vision from '@google-cloud/vision';
import { readFile } from 'fs/promises';

const credentials = {
    client_email: process.env.VISION_GOOGLE_CLIENT_EMAIL,
    private_key: process.env.VISION_GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    project_id: process.env.VISION_GOOGLE_PROJECT_ID,
};
const client = new vision.ImageAnnotatorClient({ credentials });
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

    const isRealProperty = labels.some((l:any) =>
      ['land', 'real estate', 'field', 'building', 'house', 'property', 'vacant lot'].includes(l)
    );

    const hasWatermark = text.some((t:any) =>
      t.includes('sample') || t.includes('watermark') || t.includes('copyright') || t.length > 30
    );

    const likelyDownloaded =
      (web.fullMatchingImages && web.fullMatchingImages.length > 0) ||
      (web.pagesWithMatchingImages && web.pagesWithMatchingImages.length > 0);

    return NextResponse.json({
      isRealProperty,
      hasWatermark,
      likelyDownloaded,
      labels,
      text,
    });
  } catch (error) {
    console.error('Vision API error:', error);
    return NextResponse.json({ error: 'Failed to analyze image' }, { status: 500 });
  }
}
