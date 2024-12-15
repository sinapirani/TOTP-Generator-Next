import { totp } from 'otplib';
import { NextResponse } from 'next/server';

export async function GET() {
  const secret = process.env.SECRETSECRET_KEY_TOTP;

  if (!secret) {
    return NextResponse.json({ error: 'Secret not configured' }, { status: 500 });
  }

  try {
    const now = Math.floor(Date.now() / 1000);
    const code = totp.generate(secret);
    const timeStep = totp.timeRemaining();
    const expiresAt = (Math.floor(now / timeStep) + 1) * timeStep;

    return NextResponse.json({ 
      code,
      generatedAt: now,
      expiresAt: expiresAt
    });
  } catch (error) {
    console.error('Error generating code:', error);
    return NextResponse.json({ error: 'Failed to generate code' }, { status: 500 });
  }
}

