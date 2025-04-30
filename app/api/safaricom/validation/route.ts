import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const body = await req.json();
  console.log('C2B Validation Received:', body);

  // Optionally add validation logic here...

  return NextResponse.json(
    { ResultCode: 0, ResultDesc: 'Validation accepted' },
    { status: 200 }
  );
}
