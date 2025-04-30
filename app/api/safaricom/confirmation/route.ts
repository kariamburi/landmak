// app/api/confirmation/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { handleError } from '@/lib/utils';
import { createPayment } from '@/lib/actions/payment.actions';
import { updateTransaction } from '@/lib/actions/transactions.actions';

interface MpesaCallbackData {
  TransID: string;
  TransTime: string;
  MSISDN: string;
  FirstName: string;
  MiddleName: string;
  LastName: string;
  TransAmount: number;
  BillRefNumber: string;
  OrgAccountBalance?: string;
}

export async function POST(req: NextRequest) {
  try {
    const body: MpesaCallbackData = await req.json();

    const db_arr = {
      internal_transaction_id: body.TransID,
      // name: `${body.FirstName} ${body.MiddleName} ${body.LastName}`,
      name: `${body.FirstName}`,
      receipt: body.TransID,
      time: body.TransTime,
      account: body.BillRefNumber,
      phonenumber: body.MSISDN,
      amount: body.TransAmount,
      org_balance: body.OrgAccountBalance?.split('.')[0],
    };

    const paymentresponse = await createPayment({
      payment: {
        orderTrackingId: db_arr.account,
        name: db_arr.name,
        transactionId: db_arr.receipt,
        amount: db_arr.amount,
        status: 'successful',
        balance: db_arr.org_balance || '0',
        date: new Date(),
      }
    });
    const response = await updateTransaction(db_arr.account);

    return NextResponse.json({ status: response });
  } catch (error: any) {
    console.error("Confirmation API error:", error);
    handleError(error);
    return NextResponse.json({ status: 'error', error: error.message }, { status: 500 });
  }
}
