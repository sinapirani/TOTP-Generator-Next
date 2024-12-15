import { totp } from 'otplib';
import { NextResponse } from 'next/server';

export async function GET() {
  const secret = process.env.INSTAGRAM_SECRET;

  if (!secret) {
    return NextResponse.json({ error: 'Secret not configured' }, { status: 500 });
  }

  try {
    const code = totp.generate(secret);
    return NextResponse.json({ code });
  } catch (error) {
    console.error('Error generating code:', error);
    return NextResponse.json({ error: 'Failed to generate code' }, { status: 500 });
  }
}

