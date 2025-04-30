// app/api/safaricom/stkpush/route.ts

import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const consumerKey = process.env.MPESA_CONSUMER_KEY || '';
const consumerSecret = process.env.MPESA_CONSUMER_SECRET || '';
const businessShortCode = process.env.MPESA_SHORTCODE || '';
const passkey = process.env.MPESA_PASSKEY || '';

const callbackURL = 'https://pocketshop.co.ke/api/safaricom/callback';

function getTimestamp(): string {
  const now = new Date();
  return now.toISOString().replace(/[-T:]/g, '').slice(0, 14);
}

function generatePassword(): { password: string; timestamp: string } {
  const timestamp = getTimestamp();
  const password = Buffer.from(businessShortCode + passkey + timestamp).toString('base64');
  return { password, timestamp };
}

async function getAccessToken(): Promise<string> {
  const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64');
  const response = await axios.get('https://api.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials', {
    headers: {
      Authorization: `Basic ${auth}`,
    },
  });
  return response.data.access_token;
}

// Only POST requests
export async function POST(req: NextRequest) {
  try {
    const { Amount, Account, accountReference } = await req.json();

    if (!Amount || !Account || !accountReference) {
      return NextResponse.json({ error: 'Amount, AccountReference and Account are required' }, { status: 400 });
    }

    const transactionDesc = 'Payment to Pockestshop';
    const { password, timestamp } = generatePassword();
    const accessToken = await getAccessToken();

    const stkRequest = {
      BusinessShortCode: businessShortCode,
      Password: password,
      Timestamp: timestamp,
      TransactionType: 'CustomerPayBillOnline',
      Amount: parseInt(Amount),
      PartyA: Account,
      PartyB: businessShortCode,
      PhoneNumber: Account,
      CallBackURL: callbackURL,
      AccountReference: accountReference,
      TransactionDesc: transactionDesc,
    };

    const response = await axios.post(
      'https://api.safaricom.co.ke/mpesa/stkpush/v1/processrequest',
      stkRequest,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error('STK Push error:', error?.response?.data || error.message);
    return NextResponse.json(
      {
        error: 'Failed to initiate STK Push',
        details: error?.response?.data || error.message,
      },
      { status: 500 }
    );
  }
}
