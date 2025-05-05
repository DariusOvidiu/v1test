import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { logInfo, logError } from '@/lib/logger';
import { sendVerificationEmail } from '@/lib/email';
import crypto from 'crypto';

const registerSchema = z.object({
  username: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(8),
  country: z.string(),
  phone: z.string(),
  interests: z.array(z.string())
});

export async function POST(req: Request) {
  if (req.method !== 'POST') {
    return NextResponse.json({ message: 'Method not allowed' }, { status: 405 });
  }

  try {
    const body = await req.json();
    logInfo('Received registration request', { 
      username: body.username,
      email: body.email,
      country: body.country
    });

    const validatedData = registerSchema.parse(body);
    logInfo('Registration data validated');

    // Verifică dacă username-ul există deja
    const existingUsername = await prisma.user.findUnique({
      where: { username: validatedData.username }
    });

    if (existingUsername) {
      logInfo('Registration failed: Username already exists', { username: validatedData.username });
      return NextResponse.json(
        { message: 'Username already exists' },
        { status: 400 }
      );
    }

    // Verifică dacă email-ul există deja
    const existingEmail = await prisma.user.findUnique({
      where: { email: validatedData.email }
    });

    if (existingEmail) {
      logInfo('Registration failed: Email already exists', { email: validatedData.email });
      return NextResponse.json(
        { message: 'Email already exists' },
        { status: 400 }
      );
    }

    // Găsește rolul de utilizator standard
    const userRole = await prisma.role.findUnique({
      where: { name: 'user' }
    });

    if (!userRole) {
      logError('Registration failed: User role not found');
      return NextResponse.json(
        { message: 'An error occurred during registration' },
        { status: 500 }
      );
    }

    // Generează token de verificare email
    const verificationToken = crypto.randomBytes(32).toString('hex');

    // Criptează parola
    const hashedPassword = await bcrypt.hash(validatedData.password, 10);
    logInfo('Password hashed successfully');

    // Creează utilizatorul cu rolul standard
    const user = await prisma.user.create({
      data: {
        username: validatedData.username,
        email: validatedData.email,
        password: hashedPassword,
        country: validatedData.country,
        phone: validatedData.phone,
        interests: JSON.stringify(validatedData.interests),
        emailVerificationToken: verificationToken,
        roles: {
          connect: [{ id: userRole.id }]
        }
      },
      include: {
        roles: true
      }
    });
    logInfo('User created successfully', { id: user.id, username: user.username });

    // Trimite email-ul de verificare
    const emailSent = await sendVerificationEmail(
      user.email,
      user.username,
      verificationToken
    );

    if (!emailSent) {
      logError('Failed to send verification email', { userId: user.id });
      // Nu returnăm eroare aici, deoarece utilizatorul a fost creat cu succes
      // Vom implementa o funcționalitate de retrimitere a email-ului mai târziu
    }

    // Creează o notificare pentru utilizator
    await prisma.notification.create({
      data: {
        userId: user.id,
        type: 'info',
        title: 'Welcome to Casino Guru!',
        message: 'Please verify your email address to complete your registration.',
        isRead: false
      }
    });

    // Elimină parola din răspuns
    const { password: _, emailVerificationToken: __, ...userWithoutPassword } = user;

    return NextResponse.json(
      { 
        success: true,
        message: 'User created successfully. Please check your email to verify your account.', 
        user: {
          ...userWithoutPassword,
          interests: JSON.parse(user.interests)
        },
        redirect: '/login'
      },
      { status: 201 }
    );
  } catch (error) {
    logError('Registration error', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          success: false,
          message: 'Validation error', 
          errors: error.errors 
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { 
        success: false,
        message: 'An error occurred during registration',
        error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      },
      { status: 500 }
    );
  }
} 