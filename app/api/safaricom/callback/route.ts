import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const body = await req.json();
  console.log('stkpush Received:', body);

  // Optionally add validation logic here...

  return NextResponse.json(
    { ResultCode: 0, ResultDesc: 'stkpush accepted' },
    { status: 200 }
  );
}
