// app/api/safaricom/register/route.ts

import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(req: NextRequest) {
  const consumerKey = process.env.MPESA_CONSUMER_KEY || '';
  const consumerSecret = process.env.MPESA_CONSUMER_SECRET || '';
  const businessShortCode = process.env.MPESA_SHORTCODE || '';

  const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64');

  try {
    // Step 1: Get Access Token
    const tokenRes = await axios.get('https://api.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials', {
      headers: {
        Authorization: `Basic ${auth}`,
        'Content-Type': 'application/json',
      },
    });

    const accessToken = tokenRes.data.access_token;
    console.log('Access Token:', accessToken);

    if (!accessToken) {
      throw new Error('Access token not received');
    }

    // Step 2: Register URLs
    const registerRes = await axios.post('https://api.safaricom.co.ke/mpesa/c2b/v2/registerurl', {
      ShortCode: businessShortCode,
      ResponseType: 'Completed',
      ConfirmationURL: 'https://pocketshop.co.ke/api/safaricom/confirmation',
      ValidationURL: 'https://pocketshop.co.ke/api/safaricom/validation',
    }, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });
    console.log('Register Response:', registerRes.data);
    return NextResponse.json(registerRes.data);

  } catch (error: any) {
    console.error('Safaricom Register Error:', error.response?.data || error.message);
    return NextResponse.json(
      { error: 'Failed to register URLs', details: error.response?.data || error.message },
      { status: 500 }
    );
  }
}
