import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { logInfo, logError } from '@/lib/logger';
import { sendEmail, emailTemplates } from '@/lib/email';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';

const requestResetSchema = z.object({
  email: z.string().email(),
  locale: z.string().default('ro')
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    logInfo('Received password reset request', { email: body.email });

    const validatedData = requestResetSchema.parse(body);

    // Găsește utilizatorul
    const user = await prisma.user.findUnique({
      where: { email: validatedData.email }
    });

    if (!user) {
      // Returnăm același mesaj chiar dacă utilizatorul nu există (securitate)
      return NextResponse.json(
        { message: 'Dacă adresa de email există, vei primi instrucțiuni de resetare' },
        { status: 200 }
      );
    }

    // Generează token de resetare
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 oră

    // Salvează token-ul în baza de date
    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken,
        resetTokenExpiry
      }
    });

    // Trimite email-ul de resetare
    try {
      const emailTemplate = emailTemplates.passwordReset(resetToken, validatedData.locale);
      await sendEmail({
        to: validatedData.email,
        subject: emailTemplate.subject,
        html: emailTemplate.html
      });
    } catch (error) {
      logError('Eroare la trimiterea email-ului de resetare', error);
      return NextResponse.json(
        { message: 'Nu s-a putut trimite email-ul de resetare' },
        { status: 500 }
      );
    }

    logInfo('Password reset email sent', { userId: user.id });
    return NextResponse.json({
      message: 'Dacă adresa de email există, vei primi instrucțiuni de resetare'
    });

  } catch (error) {
    logError('Password reset request error', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: 'Date invalide', errors: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { message: 'A apărut o eroare la procesarea cererii' },
      { status: 500 }
    );
  }
}

// Ruta pentru actualizarea parolei
const updatePasswordSchema = z.object({
  token: z.string(),
  password: z.string().min(8),
  locale: z.string().default('ro')
});

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const validatedData = updatePasswordSchema.parse(body);

    // Găsește utilizatorul după token
    const user = await prisma.user.findFirst({
      where: {
        resetToken: validatedData.token,
        resetTokenExpiry: {
          gt: new Date()
        }
      }
    });

    if (!user) {
      return NextResponse.json(
        { message: 'Token invalid sau expirat' },
        { status: 400 }
      );
    }

    // Actualizează parola și șterge token-ul
    const hashedPassword = await bcrypt.hash(validatedData.password, 10);
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null
      }
    });

    logInfo('Password reset successful', { userId: user.id });
    return NextResponse.json({
      message: 'Parola a fost actualizată cu succes'
    });

  } catch (error) {
    logError('Password update error', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: 'Date invalide', errors: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { message: 'A apărut o eroare la actualizarea parolei' },
      { status: 500 }
    );
  }
} 