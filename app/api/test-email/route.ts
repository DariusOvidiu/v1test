import { NextResponse } from 'next/server';
import { sendVerificationEmail } from '@/lib/email';
import { logInfo, logError } from '@/lib/logger';

export async function GET() {
  try {
    const testEmail = 'gamblinghelperagent@gmail.com';
    const testUsername = 'Test User';
    const testToken = 'test-token-123';

    const success = await sendVerificationEmail(testEmail, testUsername, testToken);

    if (success) {
      logInfo('Test email sent successfully');
      return NextResponse.json({ message: 'Test email sent successfully' });
    } else {
      logError('Failed to send test email');
      return NextResponse.json(
        { message: 'Failed to send test email' },
        { status: 500 }
      );
    }
  } catch (error) {
    logError('Error sending test email', error);
    return NextResponse.json(
      { message: 'An error occurred while sending test email' },
      { status: 500 }
    );
  }
} 