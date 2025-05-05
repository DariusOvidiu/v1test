import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { logInfo, logError } from '@/lib/logger';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json(
        { message: 'Verification token is required' },
        { status: 400 }
      );
    }

    // Caută utilizatorul cu token-ul de verificare
    const user = await prisma.user.findFirst({
      where: { emailVerificationToken: token }
    });

    if (!user) {
      logError('Email verification failed: Invalid token', { token });
      return NextResponse.json(
        { message: 'Invalid verification token' },
        { status: 400 }
      );
    }

    // Verifică dacă email-ul este deja verificat
    if (user.isEmailVerified) {
      return NextResponse.json(
        { message: 'Email is already verified' },
        { status: 400 }
      );
    }

    // Actualizează utilizatorul
    await prisma.user.update({
      where: { id: user.id },
      data: {
        isEmailVerified: true,
        emailVerificationToken: null
      }
    });

    // Creează o notificare pentru utilizator
    await prisma.notification.create({
      data: {
        userId: user.id,
        type: 'success',
        title: 'Email Verified',
        message: 'Your email address has been successfully verified.',
        isRead: false
      }
    });

    logInfo('Email verified successfully', { userId: user.id });

    // Redirecționează către pagina de login cu un mesaj de succes
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/login?verified=true`
    );
  } catch (error) {
    logError('Error verifying email', error);
    return NextResponse.json(
      { message: 'An error occurred while verifying email' },
      { status: 500 }
    );
  }
} 