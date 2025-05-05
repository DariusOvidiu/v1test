import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { email, acceptTerms } = await request.json();

    if (!email || !acceptTerms) {
      return NextResponse.json(
        { error: 'Email și acceptarea termenilor sunt obligatorii' },
        { status: 400 }
      );
    }

    // Validare email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Adresa de email nu este validă' },
        { status: 400 }
      );
    }

    // Verifică dacă email-ul există deja
    const existingSubscriber = await prisma.newsletterSubscriber.findUnique({
      where: { email },
    });

    if (existingSubscriber) {
      return NextResponse.json(
        { error: 'Această adresă de email este deja înregistrată' },
        { status: 400 }
      );
    }

    const subscriber = await prisma.newsletterSubscriber.create({
      data: {
        email,
        acceptedTerms: acceptTerms,
        subscribedAt: new Date(),
      },
    });

    return NextResponse.json({ success: true, subscriber });
  } catch (error) {
    console.error('Eroare la salvarea în baza de date:', error);
    return NextResponse.json(
      { error: 'A apărut o eroare la procesarea cererii' },
      { status: 500 }
    );
  }
} 